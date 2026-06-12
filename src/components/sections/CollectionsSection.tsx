import { useMemo } from "react";
import { motion } from "motion/react";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Heritage: "Rich, traditional luxury",
  Minimal: "Understated elegance",
  Floral: "Nature's romantic touch",
  Modern: "Contemporary & bold",
};

interface CollectionsSectionProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
}

export function CollectionsSection({ categories, onSelectCategory }: CollectionsSectionProps) {
  const cardAnimations = useMemo(
    () =>
      categories.map(() => ({
        floatDuration: 5 + Math.random() * 3,
        floatDelay: Math.random() * 2,
      })),
    [categories],
  );

  return (
    <section className="relative py-28 sm:py-36 px-6 overflow-hidden" id="collections">
      {/* Moving background */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(201,169,110,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(80,70,140,0.06) 0%, transparent 60%)",
          backgroundSize: "200% 200%",
        }}
      />

      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <h2 className="font-serif text-[clamp(2rem,5vw,3.5rem)] leading-tight text-pearl mb-4">
          Our Collections
        </h2>
        <p className="max-w-xl mx-auto text-sm sm:text-base text-pearl/70 leading-relaxed mb-14">
          Discover the signature styles that define our atelier. Each collection
          is a distinct expression of luxury and craftsmanship.
        </p>

        <div className="flex flex-col items-center gap-6">
          {categories.map((cat, idx) => (
            <motion.button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1, ease: "easeOut" }}
              // Continuous floating
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: cardAnimations[idx].floatDuration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: cardAnimations[idx].floatDelay,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group w-full max-w-xs sm:max-w-sm border border-white/10 bg-white/[0.02] backdrop-blur-sm rounded-xl p-6 sm:p-8 text-center transition-colors duration-300 hover:border-[color-mix(in_oklab,var(--gold)_50%,transparent)]"
            >
              <h3 className="font-serif text-2xl sm:text-3xl text-pearl mb-2">
                {cat}
              </h3>
              <p className="text-sm text-pearl/60">
                {CATEGORY_DESCRIPTIONS[cat] || "Explore our exclusive collection"}
              </p>
              <span className="inline-block mt-3 text-[color-mix(in_oklab,var(--gold)_70%,transparent)] text-lg group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}