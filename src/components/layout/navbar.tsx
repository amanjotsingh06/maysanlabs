"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, Search, ChevronRight } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import dynamic from "next/dynamic";
const SearchModal = dynamic(() => import("@/components/search/search-modal"), {
  loading: () => null,
});

import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen || !menuRef.current) return;
    const firstFocusable = menuRef.current.querySelector<HTMLElement>("a, button, [tabindex]:not([tabindex='-1'])");
    firstFocusable?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (e.key !== "Tab" || !menuRef.current) return;
      const focusable = menuRef.current.querySelectorAll<HTMLElement>("a, button, [tabindex]:not([tabindex='-1'])");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const navItems = [
    { name: "Services", href: "/services" },
    { name: "Products", href: "/products" },
    { name: "Tools", href: "/tools" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header>
      <nav aria-label="Main navigation" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        mounted && scrolled
          ? "bg-[var(--bg-dark)]/80 backdrop-blur-xl py-3 shadow-[0_1px_0_rgba(255,255,255,0.05)]"
          : "bg-transparent py-4 md:py-5"
      }`}>
        <div className="container-main flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-current={isActive("/") ? "page" : undefined}>
            <div className="relative h-8 w-8 md:h-9 md:w-9 rounded-[2px] overflow-hidden flex items-center justify-center border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-brand-primary/30 group-hover:shadow-[0_0_15px_rgba(26,109,214,0.2)]">
              <Image 
                src="/logo-rounded-v2.webp" 
                alt=""
                width={36}
                height={36}
                priority
                fetchPriority="high"
                sizes="36px"
                className="h-full w-full object-contain" 
              />
            </div>
            <span className="text-sm font-semibold tracking-wide text-foreground/90 transition-colors duration-300 group-hover:text-foreground">
              Maysan <span className="text-brand-primary">Labs</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`relative px-3.5 py-2 text-sm font-medium rounded-[2px] transition-all duration-200 ${
                  isActive(item.href)
                    ? "text-brand-primary bg-brand-primary/10"
                    : "text-foreground/50 hover:text-foreground hover:bg-white/[0.04]"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search (Cmd+K)"
              aria-keyshortcuts="Control+K, Meta+K"
              className="w-9 h-9 flex items-center justify-center text-foreground/40 hover:text-foreground rounded-[2px] hover:bg-white/[0.04] transition-all duration-200 focus-ring"
            >
              <Search size={16} aria-hidden="true" />
            </button>
            <ThemeToggle />
            <Link
              href="/start"
              onClick={() => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: "cta_click", label: "navbar_desktop" }); }}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-brand-primary rounded-[2px] text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-primary/90 hover:shadow-[0_0_20px_rgba(26,109,214,0.3)] hover:-translate-y-0.5 active:translate-y-0 focus-ring"
            >
              Book a Call
              <ChevronRight size={14} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <button 
            type="button"
            className="lg:hidden w-10 h-10 flex items-center justify-center text-foreground/50 hover:text-foreground rounded-[2px] hover:bg-white/[0.04] transition-all duration-200 focus-ring"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-haspopup="true"
            aria-controls="mobile-navigation-menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
 
      {/* Sticky Mobile CTA */}
      <div className={`fixed bottom-0 left-0 right-0 z-[90] lg:hidden px-4 pb-4 transition-all duration-300 ${isOpen ? 'opacity-0 translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
        <Link 
          href="/start"
          onClick={() => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: "cta_click", label: "navbar_sticky_mobile" }); }}
          className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-brand-primary rounded-[2px] font-semibold text-sm text-white shadow-lg shadow-brand-primary/25 transition-all duration-200 hover:shadow-xl hover:shadow-brand-primary/30 active:scale-[0.98]"
        >
          <Phone size={15} aria-hidden="true" />
          Book a Call
        </Link>
      </div>
 
      {isOpen && (
          <div 
            ref={menuRef}
            id="mobile-navigation-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div className="absolute inset-0 bg-background/95 backdrop-blur-2xl" />
            <div className="relative flex flex-col h-full p-5 pt-20 justify-between overflow-y-auto">
              <div className="flex flex-col gap-1">
                {navItems.map((item, index) => (
                  <div
                    key={item.name}
                    style={{ animationDelay: `${index * 40}ms` }}
                    className="animate-fade-in-up"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-[2px] text-base font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? "text-brand-primary bg-brand-primary/10"
                          : "text-foreground/60 hover:text-foreground hover:bg-white/[0.03]"
                      }`}
                    >
                      {item.name}
                      <ChevronRight size={16} className="text-foreground/20" />
                    </Link>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4">
                <Link
                  href="/start"
                  onClick={() => { setIsOpen(false); window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: "cta_click", label: "navbar_mobile_menu" }); }}
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-brand-primary rounded-[2px] font-semibold text-sm text-white shadow-lg shadow-brand-primary/20 transition-all duration-200 active:scale-[0.98]"
                >
          <Phone size={15} aria-hidden="true" />
                  Book a Call
                </Link>

                <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <span className="text-foreground/30 text-xs font-medium">Preferences</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => { setIsOpen(false); setIsSearchOpen(true); }}
                      aria-label="Open search"
                      className="w-9 h-9 flex items-center justify-center text-foreground/40 hover:text-foreground rounded-[2px] hover:bg-white/[0.04] transition-all duration-200 focus-ring"
                    >
                      <Search size={16} />
                    </button>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {isSearchOpen && <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
    </header>
  );
}
