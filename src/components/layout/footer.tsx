import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { Twitter, Linkedin, Instagram, Facebook } from "@/components/ui/brand-icons";

const linkGroups = [
  {
    title: "Services",
    links: [
      { name: "Web Development", href: "/services/web" },
      { name: "Mobile Apps", href: "/services" },
      { name: "Cloud Infrastructure", href: "/services/cloud" },
      { name: "AI & Automation", href: "/services/ai" },
      { name: "MaysanMails", href: "/products/maysanmails" },
    ],
  },
  {
    title: "Products",
    links: [
      { name: "Maysan Shop", href: "/products" },
      { name: "Edu-Maysan", href: "/products/edu-maysan" },
      { name: "MaysanMails", href: "/products/maysanmails" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Case Studies", href: "/case-studies" },
      { name: "Blog", href: "/blog" },
      { name: "Free Tools", href: "/tools" },
      { name: "Pricing", href: "/pricing" },
      { name: "About", href: "/about" },
      { name: "Admin Login", href: "/studio" },
    ],
  },
];

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/maysanlabs" },
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/maysanlabs" },
  { name: "LinkedIn", icon: Linkedin, href: "https://in.linkedin.com/company/maysanlabs" },
  { name: "Twitter", icon: Twitter, href: "https://x.com/maysanlabs" },
];

export default function ContactFooter() {
  return (
    <footer className="bg-background border-t border-gray-100 dark:border-white/[0.06] pb-20 md:pb-0">
      {/* Links + Brand + Contact */}
      <section className="py-16">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-10">
            {/* Brand column — spans 2 */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-5 group">
                <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center border border-gray-200 dark:border-white/[0.08]">
                  <Image
                    src="/logo-rounded-v2.webp"
                    alt="Maysan Labs"
                    width={48}
                    height={48}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-lg font-extrabold tracking-wider text-foreground uppercase">
                    Maysan <span className="text-brand-primary">Labs</span>
                  </span>
                  <span className="text-xs text-foreground/50 tracking-wider uppercase font-semibold block">
                    Build • Scale • Grow
                  </span>
                </div>
              </Link>
              <p className="text-sm text-foreground/60 leading-relaxed max-w-sm mb-6">
                Enterprise SaaS development studio building scalable applications for businesses worldwide.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] flex items-center justify-center text-foreground/50 hover:text-brand-primary hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all"
                    aria-label={`${social.name} (opens in new tab)`}
                  >
                    <social.icon size={18} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link groups — spans 2 */}
            <div className="md:col-span-2 grid grid-cols-2 gap-8">
              {linkGroups.slice(0, 2).map((group) => (
                <nav key={group.title} aria-label={group.title}>
                  <h3 className="text-xs font-semibold text-foreground/70 uppercase tracking-widest mb-4">
                    {group.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {group.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm text-foreground/60 hover:text-brand-primary transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>

            {/* Resources + Contact — spans 2 */}
            <div className="md:col-span-2 grid grid-cols-2 gap-8">
              <nav aria-label="Resources">
                <h3 className="text-xs font-semibold text-foreground/70 uppercase tracking-widest mb-4">Resources</h3>
                <ul className="space-y-2.5">
                  {linkGroups[2].links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm text-foreground/60 hover:text-brand-primary transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <address className="not-italic">
                <h3 className="text-xs font-semibold text-foreground/70 uppercase tracking-widest mb-4">Contact</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5 text-sm text-foreground/60">
                    <MapPin size={14} className="text-brand-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="block">Gurgaon, India</span>
                      <span className="text-xs text-foreground/50">Sector 44, Haryana</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-foreground/60">
                    <MapPin size={14} className="text-brand-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="block">Cardiff, UK</span>
                      <span className="text-xs text-foreground/50">94 Neville Street, Wales</span>
                    </div>
                  </li>
                  <li>
                    <a href="tel:+919660641530" className="flex items-start gap-2.5 text-sm text-foreground/60 hover:text-brand-primary transition-colors">
                      <Phone size={14} className="text-brand-primary shrink-0 mt-0.5" />
                      +91 96606 41530
                    </a>
                  </li>
                  <li>
                    <Link href="/contact" className="flex items-start gap-2.5 text-sm text-brand-primary hover:text-brand-light transition-colors">
                      <Mail size={14} className="shrink-0 mt-0.5" />
                      business@maysanlabs.com
                    </Link>
                  </li>
                </ul>
              </address>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom bar */}
      <div className="border-t border-gray-100 dark:border-white/[0.06] py-6">
        <div className="container-main flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-foreground/50">
            &copy; {new Date().getFullYear()} maysanlabs. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-foreground/50 hover:text-brand-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-foreground/50 hover:text-brand-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
