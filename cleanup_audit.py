from pathlib import Path
from datetime import datetime
import shutil
import argparse

SUSPECT_DIRS = {
    "node_modules",
    "dist",
    "build",
    ".next",
    ".nuxt",
    ".cache",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    ".turbo",
    ".vercel",
    ".parcel-cache",
    ".idea",
    ".vscode",
    "coverage",
    ".DS_Store",
}

SUSPECT_FILES = {
    ".DS_Store",
    "Thumbs.db",
    "npm-debug.log",
    "yarn-error.log",
    "pnpm-debug.log",
}

IMPORTANT_KEEP = {
    ".git",
    ".gitignore",
    ".gitattributes",
    ".env",
    ".env.example",
    "package.json",
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    "requirements.txt",
    "pyproject.toml",
    "README.md",
    "vercel.json",
    "vite.config.js",
    "vite.config.ts",
    "tsconfig.json",
    "tsconfig.app.json",
    "src",
    "public",
}

def human_size(num):
    for unit in ["B", "KB", "MB", "GB", "TB"]:
        if num < 1024:
            return f"{num:.2f} {unit}"
        num /= 1024
    return f"{num:.2f} PB"

def scan_folder(root: Path, large_mb: int):
    all_files = []
    flagged_dirs = []
    flagged_files = []
    total_size = 0

    for path in root.rglob("*"):
        try:
            if path.is_dir():
                if path.name in SUSPECT_DIRS:
                    flagged_dirs.append(path)
            elif path.is_file():
                size = path.stat().st_size
                total_size += size
                all_files.append((size, path))

                if path.name in SUSPECT_FILES:
                    flagged_files.append(path)
                elif size >= large_mb * 1024 * 1024:
                    flagged_files.append(path)
        except (PermissionError, FileNotFoundError):
            continue

    all_files.sort(reverse=True, key=lambda x: x[0])
    return total_size, all_files, flagged_dirs, flagged_files

def move_to_backup(paths, root: Path):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_root = root / f"_cleanup_backup_{timestamp}"
    backup_root.mkdir(exist_ok=True)

    moved = []
    for path in paths:
        try:
            relative = path.relative_to(root)
            target = backup_root / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(path), str(target))
            moved.append((path, target))
        except Exception as e:
            print(f"[WARN] Could not move {path}: {e}")

    return backup_root, moved

def main():
    parser = argparse.ArgumentParser(description="Audit and clean a project folder safely.")
    parser.add_argument("folder", nargs="?", default=".", help="Folder to scan")
    parser.add_argument("--large-mb", type=int, default=25, help="Flag files larger than this size in MB")
    parser.add_argument("--move-flagged", action="store_true", help="Move flagged files/folders to backup instead of deleting")
    args = parser.parse_args()

    root = Path(args.folder).resolve()

    if not root.exists() or not root.is_dir():
        print("Invalid folder path.")
        return

    print(f"\nScanning: {root}\n")

    total_size, all_files, flagged_dirs, flagged_files = scan_folder(root, args.large_mb)

    print(f"Total project size: {human_size(total_size)}")
    print(f"Total files found: {len(all_files)}")
    print(f"Flagged folders: {len(flagged_dirs)}")
    print(f"Flagged files: {len(flagged_files)}\n")

    print("Top 20 largest files:")
    for size, path in all_files[:20]:
        print(f"  {human_size(size):>10}  {path}")

    print("\nFlagged folders:")
    for path in flagged_dirs:
        mark = "[KEEP]" if path.name in IMPORTANT_KEEP else "[CHECK]"
        print(f"  {mark} {path}")

    print("\nFlagged files:")
    for path in flagged_files:
        mark = "[KEEP]" if path.name in IMPORTANT_KEEP else "[CHECK]"
        try:
            size = path.stat().st_size
            print(f"  {mark} {human_size(size):>10}  {path}")
        except FileNotFoundError:
            continue

    print("\nImportant files/folders detected:")
    for name in sorted(IMPORTANT_KEEP):
        found = list(root.glob(name))
        if found:
            for item in found:
                print(f"  [SAFE] {item}")

    if args.move_flagged:
        targets = []

        for p in flagged_dirs + flagged_files:
            if p.name not in IMPORTANT_KEEP and ".git" not in p.parts:
                targets.append(p)

        if not targets:
            print("\nNothing eligible to move.")
            return

        print(f"\nMoving {len(targets)} flagged items to backup...")
        backup_root, moved = move_to_backup(targets, root)
        print(f"Backup created at: {backup_root}")
        print(f"Moved items: {len(moved)}")
        print("Review the backup before deleting it permanently.")

if __name__ == "__main__":
    main()