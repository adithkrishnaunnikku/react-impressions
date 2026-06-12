import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

/* ---------- types ---------- */
interface ExtraCharge {
  name: string;
  price: number;
}

interface Product {
  id: string;
  category: string;
  price: number;
  featured: boolean;
  minOrder: number;
  description: string;
  size?: string;
  material?: string;
  images: string[];
  extraCharges?: ExtraCharge[];
}

/* ---------- constants ---------- */
const WHATSAPP_NUMBER = "919526577999";
const ITEMS_PER_PAGE = 12;
const DEFAULT_DESC =
  "Experience the timeless elegance of this design. Crafted on premium materials with exquisite detailing.";

const DATA_URL =
  "https://raw.githubusercontent.com/allurecards/allurecards.in/main/data/cards.json";
const IMAGE_BASE =
  "https://raw.githubusercontent.com/allurecards/allurecards.in/main/";

/* ---------- Animated Price Component (no external hooks) ---------- */
const AnimatedPrice = ({ value }: { value: number }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    const step = (val: number) => {
      // smooth count up/down
      const diff = value - val;
      if (Math.abs(diff) < 0.5) {
        setDisplay(value);
        return;
      }
      const increment = diff * 0.15; // speed factor
      const next = val + (Math.abs(increment) > 1 ? increment : (diff > 0 ? 1 : -1));
      setDisplay(Math.round(next));
      animationFrame = requestAnimationFrame(() => step(next));
    };
    animationFrame = requestAnimationFrame(() => step(display));
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return <span>Rs. {display.toLocaleString("en-IN")}</span>;
};

/* ---------- main component ---------- */
export function PortfolioSection({
  initialFilter = "All",
  onCategoriesLoaded,
}: {
  initialFilter?: string;
  onCategoriesLoaded?: (cats: string[]) => void;
}) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [currentFilter, setCurrentFilter] = useState(initialFilter);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(100);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentFilter(initialFilter);
  }, [initialFilter]);

  useEffect(() => {
    fetch(DATA_URL)
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((data: Product[]) => {
        const normalized = data.map((p) => ({
          ...p,
          images: p.images?.length
            ? p.images.map((img) =>
                img.startsWith("http") ? img : `${IMAGE_BASE}${img}`
              )
            : ["assets/cards/placeholder.jpg"],
          minOrder: p.minOrder ?? 100,
          description: p.description || DEFAULT_DESC,
          extraCharges: p.extraCharges || [],
        }));
        setAllProducts(normalized);
        setLoading(false);

        const cats = [...new Set(normalized.map((p) => p.category).filter(Boolean))];
        onCategoriesLoaded?.(cats);
      })
      .catch((err) => {
        console.error("Failed to load cards.json:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  const applyFilters = useCallback(() => {
    let filtered =
      currentFilter === "All"
        ? [...allProducts]
        : allProducts.filter((p) => p.category === currentFilter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "featured":
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredProducts(filtered);
    setVisibleCount(Math.min(ITEMS_PER_PAGE, filtered.length));
  }, [allProducts, currentFilter, searchQuery, sort]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const uniqueCategories = [
    ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
  ];

  const handleShowMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + ITEMS_PER_PAGE, filteredProducts.length)
    );
  };

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setQty(product.minOrder);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const shareProduct = () => {
    if (!selectedProduct) return;
    const url = `${window.location.origin}${window.location.pathname}#card=${selectedProduct.id}`;
    const title = `Check out ${selectedProduct.id} from the ${selectedProduct.category} Collection`;

    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {
        navigator.clipboard.writeText(url).then(() => {
          alert("Link copied to clipboard!");
        });
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert("Link copied to clipboard!");
      });
    }
  };

  const getPriceBreakdown = (product: Product, quantity: number) => {
    const cardCost = quantity * product.price;
    const extraCharges = product.extraCharges || [];
    const extraTotal = extraCharges.reduce((sum, ch) => sum + ch.price, 0);

    let printingFee = 0;
    let printingWaived = 0;
    if (product.minOrder === 100) {
      printingFee = quantity < 200 ? 600 : 0;
      printingWaived = quantity < 200 ? 0 : 600;
    }

    let factor = 1.0;
    let discountPct = 0;
    if (quantity >= 1000) {
      factor = 0.9;
      discountPct = 10;
    } else if (quantity >= 500) {
      factor = 0.95;
      discountPct = 5;
    }

    const discountAmt = Math.round(cardCost * (1 - factor));
    const finalTotal = Math.round(cardCost * factor) + printingFee + extraTotal;
    const totalSavings = printingWaived + discountAmt;

    return {
      cardCost,
      extraCharges,
      extraTotal,
      printingFee,
      printingWaived,
      discountPct,
      discountAmt,
      finalTotal,
      totalSavings,
    };
  };

  const getWhatsAppLink = (product: Product, quantity: number) => {
    const b = getPriceBreakdown(product, quantity);
    const lines = [
      `*Design:* ${product.id} (${product.category} Collection)`,
      `*Quantity:* ${quantity}`,
      ``,
      `*Price Breakdown:*`,
      `Card Cost: Rs. ${b.cardCost.toLocaleString()}`,
    ];
    b.extraCharges.forEach((ch) => lines.push(`${ch.name}: Rs. ${ch.price}`));
    if (b.extraCharges.length > 1)
      lines.push(`Total Extra Charges: Rs. ${b.extraTotal.toLocaleString()}`);
    if (product.minOrder === 100) {
      if (b.printingFee > 0) lines.push(`Extra charge below 200: Rs. 600`);
      else lines.push(`Extra charge below 200: FREE (saved Rs. 600)`);
    }
    if (b.discountAmt > 0)
      lines.push(
        `Volume Discount (${b.discountPct}%): – Rs. ${b.discountAmt.toLocaleString()}`
      );
    lines.push(`───`);
    lines.push(`*Final Estimate: Rs. ${b.finalTotal.toLocaleString()}*`);
    lines.push(`*You Save: Rs. ${b.totalSavings.toLocaleString()}*`);
    lines.push(``);
    lines.push(`Please let me know how to proceed.`);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      lines.join("\n")
    )}`;
  };

  if (loading) {
    return (
      <section className="py-24 sm:py-32 px-6" id="portfolio">
        <div className="max-w-6xl mx-auto text-center text-pearl/50">
          Loading designs…
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 sm:py-32 px-6" id="portfolio">
        <div className="max-w-6xl mx-auto text-center text-pearl/50">
          Unable to load designs. Please try again later.
        </div>
      </section>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="relative py-24 sm:py-32 px-6 overflow-hidden" id="portfolio">
      {/* ---- animated background using Framer Motion (no style tag) ---- */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `linear-gradient(270deg, 
            rgba(139,92,246,0.04) 0%, 
            rgba(245,240,232,0.04) 50%, 
            rgba(139,92,246,0.04) 100%)`,
          backgroundSize: "400% 400%",
        }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 15, ease: "linear", repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-serif text-[clamp(2rem,5vw,3.2rem)] leading-tight text-pearl mb-4">
            Our Portfolio
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-pearl/70 leading-relaxed">
            Each design is a labour of love — from the first sketch to the final
            wax seal. Browse our collection.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCurrentFilter("All")}
              className={`filter-btn px-4 py-2 rounded-full text-xs tracking-wider uppercase transition ${
                currentFilter === "All"
                  ? "bg-royal text-pearl"
                  : "bg-white/[0.05] text-pearl/70 hover:bg-white/[0.1]"
              }`}
            >
              All
            </button>
            {uniqueCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCurrentFilter(cat)}
                className={`filter-btn px-4 py-2 rounded-full text-xs tracking-wider uppercase transition ${
                  currentFilter === cat
                    ? "bg-royal text-pearl"
                    : "bg-white/[0.05] text-pearl/70 hover:bg-white/[0.1]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2 ml-auto">
            <input
              type="text"
              placeholder="Search designs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/[0.05] border border-pearl/10 rounded-full px-4 py-2 text-xs text-pearl placeholder-pearl/30 focus:outline-none focus:border-royal/50"
              id="portfolio-search"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white/[0.05] border border-pearl/10 rounded-full px-3 py-2 text-xs text-pearl focus:outline-none [&_option]:text-gray-900 [&_option]:bg-white"
              id="portfolio-sort"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <motion.div
          id="product-container"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={currentFilter + searchQuery + sort}
        >
          {filteredProducts.slice(0, visibleCount).map((product) => (
            <motion.div
              key={product.id}
              variants={cardVariants}
              whileHover={{
                y: -6,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              className="product-card w-full group relative overflow-hidden rounded-xl border border-pearl/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-500 hover:border-royal/30 hover:shadow-[0_0_30px_-10px_rgba(139,92,246,0.2)]"
            >
              <div className="product-img-wrapper relative h-[420px] bg-gradient-to-br from-royal-deep/20 to-royal/20 flex items-center justify-center overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.id}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <span className="font-serif italic text-pearl/20 text-5xl drop-shadow-lg">
                  IW
                </span>
                {product.featured && (
                  <span className="featured-badge absolute top-2 left-2 bg-royal text-pearl text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-full z-10 animate-pulse">
                    Featured
                  </span>
                )}
                <div className="quick-view-overlay absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openModal(product)}
                    className="quick-view-btn px-6 py-3 bg-royal text-pearl rounded-full text-xs tracking-wider uppercase hover:bg-royal-deep transition-colors shadow-lg"
                  >
                    Quick View
                  </motion.button>
                </div>
              </div>
              <div className="p-4 text-center">
                <h4 className="font-serif text-pearl text-base tracking-wide">
                  {product.id}
                </h4>
                <p className="text-pearl/50 text-[10px] tracking-wider uppercase mt-1">
                  {product.category}
                </p>
                <p className="product-price text-pearl/80 text-sm mt-2">
                  Rs. {product.price} / card
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredProducts.length === 0 && (
          <p className="text-center text-pearl/50 text-sm mt-12">
            No designs match your criteria.
          </p>
        )}

        {visibleCount < filteredProducts.length && (
          <div className="text-center mt-10">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              id="show-more-btn"
              onClick={handleShowMore}
              className="px-6 py-2 rounded-full border border-pearl/30 text-pearl/70 text-xs tracking-wider uppercase hover:bg-pearl/5 transition-colors"
            >
              Show More
            </motion.button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <Modal
            product={selectedProduct}
            qty={qty}
            setQty={setQty}
            onClose={closeModal}
            onShare={shareProduct}
            onLightbox={openLightbox}
            getPriceBreakdown={getPriceBreakdown}
            getWhatsAppLink={getWhatsAppLink}
            modalRef={modalRef}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightboxOpen && selectedProduct && (
          <Lightbox
            images={selectedProduct.images}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={() =>
              setLightboxIndex(
                (prev) =>
                  (prev - 1 + selectedProduct.images.length) %
                  selectedProduct.images.length
              )
            }
            onNext={() =>
              setLightboxIndex(
                (prev) => (prev + 1) % selectedProduct.images.length
              )
            }
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ============================================================
   Modal Component
   ============================================================ */
function Modal({
  product,
  qty,
  setQty,
  onClose,
  onShare,
  onLightbox,
  getPriceBreakdown,
  getWhatsAppLink,
  modalRef,
}: {
  product: Product;
  qty: number;
  setQty: (q: number) => void;
  onClose: () => void;
  onShare: () => void;
  onLightbox: (index: number) => void;
  getPriceBreakdown: (p: Product, q: number) => ReturnType<
    typeof PortfolioSection
  > extends (...args: any[]) => infer R
    ? R
    : never;
  getWhatsAppLink: (p: Product, q: number) => string;
  modalRef: React.RefObject<HTMLDivElement | null>;
}) {
  const b = getPriceBreakdown(product, qty);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const mainImageSrc = product.images[activeImageIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      id="quick-view-modal"
      ref={modalRef}
      onClick={(e) => {
        if (e.target === modalRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-background border border-pearl/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-pearl/60 hover:text-pearl transition-colors text-2xl z-10"
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <motion.div
              className="relative rounded-xl overflow-hidden border border-pearl/10 mb-4 cursor-pointer"
              whileHover={{ scale: 1.01 }}
            >
              <img
                src={mainImageSrc}
                alt={product.id}
                className="w-full h-auto object-contain"
                onClick={() => onLightbox(activeImageIndex)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "assets/cards/placeholder.jpg";
                }}
              />
            </motion.div>
            {product.images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {product.images.map((img, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.08 }}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition ${
                      idx === activeImageIndex
                        ? "border-royal scale-105"
                        : "border-transparent"
                    }`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="md:w-1/2">
            <h3 className="font-serif text-2xl text-pearl mb-1">
              {product.id}
            </h3>
            <p className="text-xs text-pearl/50 uppercase tracking-widest mb-4">
              {product.category} Collection
            </p>
            <p className="text-pearl/70 text-sm mb-4">{product.description}</p>
            {product.size && product.material && (
              <p className="text-xs text-pearl/50 mb-2">
                Size: {product.size} &nbsp;|&nbsp; Material: {product.material}
              </p>
            )}
            <p className="text-lg text-pearl/90 mb-6">
              Rs. {product.price} / card
            </p>

            <div className="mb-4">
              <label className="text-xs text-pearl/60 block mb-2">
                Quantity
              </label>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full bg-white/[0.05] border border-pearl/10 rounded-full px-4 py-2 text-sm text-pearl focus:outline-none [&_option]:text-gray-900 [&_option]:bg-white"
              >
                {Array.from(
                  { length: (1500 - product.minOrder) / 50 + 1 },
                  (_, i) => product.minOrder + i * 50
                ).map((n) => (
                  <option key={n} value={n}>
                    {n.toLocaleString()} cards
                  </option>
                ))}
              </select>
            </div>

            <div className="calc-summary space-y-2 text-xs text-pearl/70 mb-6">
              <div className="flex justify-between">
                <span>
                  Card Cost ({qty} × Rs. {product.price})
                </span>
                <span>Rs. {b.cardCost.toLocaleString()}</span>
              </div>
              {b.extraCharges.map((ch, i) => (
                <div key={i} className="flex justify-between">
                  <span>{ch.name}</span>
                  <span>Rs. {ch.price.toLocaleString()}</span>
                </div>
              ))}
              {b.extraCharges.length > 1 && (
                <div className="flex justify-between font-medium">
                  <span>Total Extra Charges</span>
                  <span>Rs. {b.extraTotal.toLocaleString()}</span>
                </div>
              )}
              {product.minOrder === 100 && (
                <div className="flex justify-between">
                  <span>Extra charge below 200</span>
                  {b.printingFee > 0 ? (
                    <span>Rs. {b.printingFee.toLocaleString()}</span>
                  ) : (
                    <span className="text-green-600">FREE</span>
                  )}
                </div>
              )}
              {b.discountPct > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Volume Discount ({b.discountPct}%)</span>
                  <span>− Rs. {b.discountAmt.toLocaleString()}</span>
                </div>
              )}
              {b.totalSavings > 0 && (
                <div className="flex justify-between font-semibold text-royal border-t border-pearl/10 pt-2 mt-2">
                  <span>You Save</span>
                  <span>Rs. {b.totalSavings.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-medium text-pearl mt-4 pt-2 border-t border-pearl/10">
                <span>Final Estimate</span>
                <AnimatedPrice value={b.finalTotal} />
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={getWhatsAppLink(product, qty)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-4 py-3 rounded-full bg-[#25D366] text-white text-xs uppercase tracking-wider font-medium hover:brightness-105 hover:shadow-[0_0_15px_#25D366] transition-all"
              >
                Order via WhatsApp
              </a>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onShare}
                className="px-4 py-3 rounded-full border border-pearl/20 text-pearl/80 text-xs tracking-wider uppercase hover:bg-white/[0.05] transition"
              >
                Share
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   Lightbox
   ============================================================ */
function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      id="gallery-overlay"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white text-2xl hover:text-pearl transition-colors"
        onClick={onClose}
      >
        &times;
      </button>
      {images.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-pearl transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
          >
            ‹
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-pearl transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            ›
          </button>
        </>
      )}
      <motion.img
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        src={images[currentIndex]}
        alt={`Image ${currentIndex + 1} of ${images.length}`}
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      {images.length > 1 && (
        <div className="absolute bottom-4 text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </motion.div>
  );
}