import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, Hash, Link, Code2, Camera } from 'lucide-react';

const menuLinks = ['About', 'Work', 'Services', 'Process', 'Contact'];
const socials = [
  { label: 'Twitter / X', icon: <Hash size={14} />, href: '#' },
  { label: 'LinkedIn', icon: <Link size={14} />, href: 'https://www.linkedin.com/in/marouane-belahouane-2a62b1309?utm_source=share_via&utm_content=profile&utm_medium=member_android' },
  { label: 'GitHub', icon: <Code2 size={14} />, href: 'https://github.com/marouaneblhn-cell' },
  { label: 'Instagram', icon: <Camera size={14} />, href: 'https://www.instagram.com/marouane__bln.08/' },
];

const scrollTo = (id) => {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden"
      style={{ backgroundColor: '#0d1116', borderTop: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Massive background text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none select-none overflow-hidden">
        <span
          className="text-[25vw] font-black tracking-tighter text-white leading-none"
          style={{ opacity: 0.05 }}
        >
          CONTACT
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-10">

        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Label */}
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-[#00df8f]" />
              <span className="text-xs font-semibold tracking-widest text-[#00df8f] uppercase">Let's Talk</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-6">
              HOW CAN<br />
              I HELP<span className="text-[#00df8f]">?</span>
            </h2>

            <p className="text-gray-400 leading-relaxed max-w-sm mb-10 text-sm sm:text-base">
              Whether you're a startup launching your first product, an established brand
              looking to evolve, or a founder with a bold idea — I'd love to hear from you.
              Let's create something remarkable together.
            </p>

            <motion.a
              href="mailto:marouaneblhn@gmail.com"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-semibold text-sm text-black"
              style={{
                background: '#ffffff',
                boxShadow: '0 0 30px rgba(255,255,255,0.15)',
              }}
            >
              <Mail size={16} />
              marouaneblhn@gmail.com
              <ArrowUpRight size={15} />
            </motion.a>
          </motion.div>

          {/* Right — Links grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 gap-12 lg:justify-end"
          >
            {/* Menu */}
            <div>
              <div className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-6">Menu</div>
              <ul className="space-y-3">
                {menuLinks.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => scrollTo(`#${link.toLowerCase()}`)}
                      className="text-sm text-gray-400 hover:text-[#00df8f] transition-colors duration-300 font-medium"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Socials */}
            <div>
              <div className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-6">Socials</div>
              <ul className="space-y-3">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={s.href !== '#' ? '_blank' : undefined}
                      rel={s.href !== '#' ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#00df8f] transition-colors duration-300 font-medium"
                    >
                      {s.icon}
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} className="pt-8">

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tighter text-white">
                MAROUANE<span className="text-[#00df8f]">.</span>
              </span>
              <span className="text-xs text-gray-600">—</span>
              <span className="text-xs text-gray-600">© 2026 Marouane Portfolio. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Terms of Use</a>
              <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
