"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, ShoppingCart, GraduationCap, Mail, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const products = [
  {
    name: "Maysan Shop",
    tagline: "Commerce Without Boundaries",
    description: "Full-stack enterprise e-commerce platform designed for scalability, automation, and high-performance online selling.",
    highlights: [
      "High-performance payment gateway integrations",
      "Real-time multi-warehouse inventory automation",
      "Precision-tuned responsive checkout experience",
    ],
    icon: ShoppingCart,
    link: "/products/flash-fashion",
  },
  {
    name: "Edu-Maysan",
    tagline: "Intelligence for Every Classroom",
    description: "A complete education management and analytics platform that simplifies administration, improves academic operations, and delivers real-time institutional insights.",
    highlights: [
      "Unified institutional operations dashboard",
      "Multi-role administrator, teacher, and student portals",
      "Real-time analytics and biometric attendance tracking",
    ],
    icon: GraduationCap,
    link: "/products/edu-maysan",
  },
  {
    name: "MaysanMails",
    tagline: "Own Your Email Infrastructure",
    description: "A self-hosted enterprise email platform built for businesses that need high deliverability, complete control, and advanced campaign automation without recurring subscriber fees.",
    highlights: [
      "High-deliverability SMTP routing",
      "Advanced campaign automation",
      "Complete data ownership and privacy",
    ],
    icon: Mail,
    link: "/products/maysanmails",
  },
];

export default function Products() {
  return (
    <section id="products" className="py-20 md:py-32 relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] rounded-full blur-[140px] bg-brand-primary/5 dark:bg-brand-primary/10 pointer-events-none" />
      
      <div className="container-main relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 dark:bg-brand-primary/5 border border-brand-primary/20 dark:border-brand-primary/10 text-brand-primary text-xs font-semibold tracking-wide uppercase">
              <Sparkles size={12} />
              Our Products
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="heading-lg text-foreground mb-4 max-w-3xl mx-auto"
          >
            Powerful Digital Products Built by <span className="text-brand-primary">Maysan Labs</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-foreground/60 text-base md:text-lg max-w-2xl mx-auto"
          >
            From enterprise commerce platforms to education management systems and email infrastructure, our products are designed to help businesses scale with reliable, secure, and intelligent technology.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="h-full"
            >
              <Card className="h-full relative group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <Badge variant="outline" className="absolute top-4 right-4 bg-brand-primary/10 text-brand-primary border-brand-primary/20 hover:bg-brand-primary/15">
                  Built by Maysan Labs
                </Badge>
                <div className="p-6 pt-6 flex flex-col h-full">
                  <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                    <product.icon size={19} />
                  </div>
                  
                  <h3 className="text-base font-bold text-foreground mb-1">{product.name}</h3>
                  <p className="text-brand-primary text-xs font-semibold mb-2">
                    {product.tagline}
                  </p>
                  <p className="text-sm text-foreground/60 mb-4 leading-relaxed flex-grow">
                    {product.description}
                  </p>
                  
                  <ul className="space-y-2.5 mb-5 border-t border-gray-100 dark:border-white/[0.06] pt-4">
                    {product.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-foreground/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/30 shrink-0 mt-1" />
                        <span className="leading-snug">{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={product.link}
                    aria-label={`Learn more about ${product.name}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:gap-2.5 transition-all mt-auto"
                  >
                    Learn more <ArrowUpRight size={12} />
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
