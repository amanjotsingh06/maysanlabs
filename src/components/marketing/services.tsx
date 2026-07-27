"use client";

import {
  TrendingUp,
  Layout,
  BarChart3,
  ArrowUpRight,
  Zap,
  Code2,
  Database,
  Cloud,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const services = [
  {
    title: "Custom Software & Web Apps",
    desc: "Purpose-built software designed exactly for your business. Includes headless commerce (Medusa) stores, customer portals, and daily operations dashboards.",
    icon: Cloud,
    href: "/services/web",
    features: ["Custom design (no templates)", "Headless commerce with Medusa", "Simple customer/staff logins", "Highly secure database"],
  },
  {
    title: "Business Automation Tools",
    desc: "Get rid of manual Excel sheets. We automate your daily billing, receipts, WhatsApp notifications, and customer emails.",
    icon: TrendingUp,
    href: "/services/web",
    features: ["GST-ready billing systems", "Automated WhatsApp & SMS alerts", "Automatic invoice generation"],
  },
  {
    title: "Custom Mobile Apps (Android & iOS)",
    desc: "Launch your own customized mobile app on Android and iOS to connect with your customers or track your field teams easily.",
    icon: Code2,
    href: "/services/web",
    features: ["Works on Android & iPhones", "Fast, light & responsive", "App Store & Play Store publishing"],
  },
  {
    title: "Secure Cloud Hosting",
    desc: "Get secure server hosting on AWS with automatic daily backups. Your business data is always safe, encrypted, and accessible.",
    icon: Database,
    href: "/services/cloud",
    features: ["Automatic daily data backups", "Safe & encrypted database", "99.9% guaranteed uptime SLA"],
  },
  {
    title: "Smart Business Dashboards",
    desc: "Track your daily sales, inventory, expenses, and net profit in real-time with easy-to-read charts and single-click Excel exports.",
    icon: Layout,
    href: "/services/web",
    features: ["Real-time sales & profit tracker", "One-click Excel data export", "Simple charts & visual reports"],
  },
  {
    title: "Integration with Popular Tools",
    desc: "Connect your custom software with WhatsApp Business APIs, SMS services, Razorpay, Paytm, Tally, Google Sheets, or Medusa commerce APIs.",
    icon: BarChart3,
    href: "/services/web",
    features: ["Razorpay & UPI payment setup", "Medusa commerce API integration", "Tally & Zoho ledgers sync", "WhatsApp Business API links"],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
      
      <div className="container-main relative">
        <div className="text-center mb-12 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 dark:bg-brand-primary/5 border border-brand-primary/20 dark:border-brand-primary/10 text-brand-primary text-xs font-medium">
              <Zap size={12} />
              Services
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="heading-md text-foreground mb-3"
          >
            Software services for your <span className="text-brand-primary">business growth</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-foreground/60 text-sm md:text-base max-w-lg mx-auto"
          >
            From custom apps to automatic WhatsApp billing, we handle all your technology needs so you can focus 100% on growing your business.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const isFeatured = index === 0;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="group"
              >
                <Card className={`h-full group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ${
                  isFeatured ? "border-brand-primary/30 shadow-sm" : ""
                }`}>
                  {isFeatured && (
                    <Badge variant="outline" className="absolute top-4 right-4 bg-brand-primary/10 text-brand-primary border-brand-primary/20 hover:bg-brand-primary/15">
                      Popular
                    </Badge>
                  )}
                  <div className="p-6 pt-6">
                    <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                      <service.icon size={19} />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-2">{service.title}</h3>
                    <p className="text-sm text-foreground/60 mb-4 leading-relaxed">{service.desc}</p>
                    <ul className="space-y-2.5 mb-5 border-t border-gray-100 dark:border-white/[0.06] pt-4">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-xs text-foreground/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/30 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={service.href}
                      aria-label={`Learn more about ${service.title}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:gap-2.5 transition-all"
                    >
                      Learn more <ArrowUpRight size={12} />
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

