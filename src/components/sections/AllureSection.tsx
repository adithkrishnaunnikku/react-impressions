export function AllureSection() {
  return (
    <section className="py-24 sm:py-32 px-6 relative overflow-hidden">
      {/* Subtle gold radial glow in background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(201,169,110,0.4) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          {/* Ornamental gold divider */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span
              className="h-px w-16"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(201,169,110,0.8), transparent)",
              }}
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(201,169,110,0.9)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            <span
              className="h-px w-16"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(201,169,110,0.8), transparent)",
              }}
            />
          </div>

          <h2 className="font-serif text-[clamp(2rem,5vw,3.2rem)] leading-tight text-pearl mb-4">
            The Allure Collection
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-pearl/70 leading-relaxed">
            Curated for those who refuse to settle — these invitations are the
            first whisper of your wedding’s magnificence. Each card is a
            masterpiece of letterpress, gilded edges, and heirloom paper,
            reserved for the most discerning celebrations.
          </p>
        </div>

        {/* Premium redirect box with gold accents */}
        <div
          className="relative overflow-hidden rounded-2xl border backdrop-blur-md p-8 sm:p-12 text-center"
          style={{
            borderColor: "rgba(201,169,110,0.3)",
            background:
              "linear-gradient(135deg, rgba(201,169,110,0.08) 0%, rgba(30,20,60,0.4) 100%)",
            boxShadow: "0 20px 50px -15px rgba(201,169,110,0.15)",
          }}
        >
          {/* Gold shimmer effect */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "linear-gradient(45deg, transparent 40%, rgba(201,169,110,0.3) 50%, transparent 60%)",
              backgroundSize: "200% 200%",
              animation: "shimmer 3s ease-in-out infinite",
            }}
          />
          <div
            aria-hidden
            className="absolute -top-10 left-1/2 -translate-x-1/2 h-40 w-80 rounded-full blur-3xl opacity-30"
            style={{
              background:
                "radial-gradient(circle, rgba(201,169,110,0.5), transparent 70%)",
            }}
          />

          <h3 className="relative font-serif text-2xl sm:text-3xl text-pearl mb-4">
            Aspirational Cards, Unforgettable First Impressions
          </h3>
          <p className="relative text-sm text-pearl/70 max-w-lg mx-auto mb-8">
            We’ve partnered with <strong className="text-[#c9a96e]">Allure Cards</strong> to bring you an
            exclusive range of luxury wedding invitations. From hand‑painted
            motifs to real gold leaf, every piece tells a story.
          </p>
          <a
            href="https://www.allurecards.in"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center justify-center px-8 py-3 rounded-full text-xs tracking-[0.3em] uppercase font-medium transition-all duration-500 hover:-translate-y-0.5 hover:brightness-110"
            style={{
              background:
                "linear-gradient(135deg, rgba(201,169,110,0.9) 0%, rgba(180,140,80,1) 100%)",
              color: "#0a0a0a",
              boxShadow:
                "0 10px 25px -8px rgba(201,169,110,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            Explore Allure Cards
            <svg
              className="ml-2 h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        </div>

        {/* Feature cards with gold borders */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3 text-center">
          {[
            {
              title: "Gilded Elegance",
              desc: "Real gold foil on double‑thick cotton paper.",
            },
            {
              title: "Hand‑Painted Motifs",
              desc: "Original watercolour artwork on every card.",
            },
            {
              title: "Timeless Typography",
              desc: "Bespoke calligraphy and hot‑foil stamping.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-lg border backdrop-blur-sm transition-all hover:-translate-y-1"
              style={{
                borderColor: "rgba(201,169,110,0.25)",
                background:
                  "linear-gradient(180deg, rgba(201,169,110,0.05) 0%, transparent 100%)",
                boxShadow: "0 8px 20px -10px rgba(201,169,110,0.1)",
              }}
            >
              {/* Tiny gold ornament */}
              <div className="flex justify-center mb-3">
                <span
                  className="h-px w-10"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(201,169,110,0.6), transparent)",
                  }}
                />
              </div>
              <h4 className="font-serif text-pearl text-lg mb-2">{item.title}</h4>
              <p className="text-pearl/60 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Optional shimmer animation keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </section>
  );
}