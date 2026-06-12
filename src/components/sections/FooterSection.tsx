import { motion } from "motion/react";
import { Instagram } from "lucide-react";

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="relative bg-background border-t border-[color-mix(in_oklab,var(--gold)_25%,transparent)] pt-16 pb-8 px-6"
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto">
        <div className="footer-grid grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Brand & contact info */}
          <div className="footer-brand flex flex-col items-start space-y-6">
            <img
              src="/impressionslogo.png"
              alt="Allure – Luxury Wedding Invitations"
              className="footer-logo-img h-12 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />

            <div className="footer-divider w-16 h-px bg-gradient-to-r from-[color-mix(in_oklab,var(--gold)_70%,transparent)] to-transparent" />

            <address className="footer-address not-italic text-sm text-pearl/70 leading-relaxed">
              Impressions Wedding Cards,
              <br />
              Paravattani, Opp. Childrens Park,
              <br />
              East Fort P.O.,
              <br />
              Thrissur, Kerala — 680005
            </address>

            <p className="footer-contact text-sm text-pearl/60 space-x-1">
              <a
                href="tel:+919526577999"
                className="hover:text-pearl transition-colors"
              >
                +91 95265 77 999
              </a>
              <span className="text-pearl/30">·</span>
              <a
                href="tel:+919020077999"
                className="hover:text-pearl transition-colors"
              >
                +91 90200 77 999
              </a>
              <span className="text-pearl/30">·</span>
              <a
                href="mailto:allurecards.in@gmail.com"
                className="hover:text-pearl transition-colors"
              >
                allurecards.in@gmail.com
              </a>
            </p>

            <div className="footer-social">
              <motion.a
                href="https://www.instagram.com/impressions_wedding_cards?igsh=MXMwZ3hzNHRmaWN4Zw=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-pearl/60 hover:text-pearl transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={false}
              >
                <motion.span
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.05] border border-pearl/10"
                  whileHover={{
                    boxShadow:
                      "0 0 15px 3px rgba(201,169,110,0.3)",
                    borderColor: "rgba(201,169,110,0.5)",
                  }}
                >
                  <Instagram
                    size={16}
                    className="text-pearl/70 group-hover:text-pearl"
                  />
                </motion.span>
                <span>Instagram</span>
              </motion.a>
            </div>
          </div>

          {/* Google Map */}
          <div className="footer-map-container rounded-xl overflow-hidden border border-pearl/10">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3922.5!2d76.22!3d10.52!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDMxJzEyLjAiTiA3NsKwMTMnMTIuMCJF!5e0!3m2!1sen!2sin!4v1700000000000"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Allure by Impressions — Atelier Location"
              className="w-full h-64 sm:h-72"
            />
            <a
              href="https://maps.google.com/?q=Impressions+Castle+Paravattani+Thrissur+Kerala"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center py-3 text-xs uppercase tracking-wider text-pearl/60 hover:text-pearl transition-colors bg-white/[0.02]"
            >
              Get Directions to our Atelier
            </a>
          </div>
        </div>

        <div className="footer-bottom pt-8 border-t border-pearl/10">
          <p className="footer-copy text-xs text-pearl/40 text-center">
            © {currentYear} Allure by Impressions Wedding Cards. All rights
            reserved. Crafted with devotion in Thrissur.
          </p>
        </div>
      </div>
    </footer>
  );
}