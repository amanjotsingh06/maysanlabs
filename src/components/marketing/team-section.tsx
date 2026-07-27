"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Linkedin } from "@/components/ui/brand-icons";

const team = [
  {
    name: "Rashid Khan",
    role: "Founder & CEO",
    bio: "Visionary leader with 15+ years in enterprise software. Driving Maysan's mission to build scalable solutions.",
    image: null,
  },
  {
    name: "Junaid Ansari",
    role: "Technical Director",
    bio: "Architecture expert specializing in cloud-native solutions and high-scale systems. Former senior engineer at top tech companies.",
    image: null,
  },
  {
    name: "Saif Ali",
    role: "Lead Developer",
    bio: "Full-stack expert with deep knowledge in React, Node.js, and cloud infrastructure. Leads our development teams.",
    image: null,
  },
];

const advisors = [
  {
    name: "Dr. Amit Sharma",
    role: "Tech Advisor",
    company: "Former CTO, Fortune 500",
    bio: "Strategic advisor bringing decades of enterprise technology experience.",
  },
  {
    name: "Sarah Johnson",
    role: "Business Advisor",
    company: "Venture Partner",
    bio: "Guides our growth strategy with insights from successful SaaS exits.",
  },
];

export default function TeamSection() {
  return (
    <section className="py-20 border-t border-white/5" id="team">
      <div className="container-main">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <span className="badge-section">
              Our Team
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-semibold text-foreground"
          >
            Meet the <span className="text-brand-primary">Founders</span>
          </motion.h2>
        </div>

        {/* Founders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:border-brand-primary/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 flex items-center justify-center text-brand-primary text-3xl font-bold mb-6">
                {member.name.charAt(0)}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-1 group-hover:text-brand-primary transition-colors">
                {member.name}
              </h3>
              <p className="text-brand-primary text-sm font-medium mb-4">
                {member.role}
              </p>
              <p className="text-foreground/45 text-sm leading-relaxed mb-6">
                {member.bio}
              </p>
              <div className="flex gap-3">
                <a href="https://linkedin.com/company/maysanlabs" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/[0.03] flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-brand-primary/10 hover:text-brand-primary transition-all">
                  <Linkedin size={16} />
                </a>
                <a href="mailto:business@maysanlabs.com" className="w-9 h-9 rounded-lg bg-white/[0.03] flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-brand-primary/10 hover:text-brand-primary transition-all">
                  <Mail size={16} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Advisors */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-foreground mb-8 text-center">
            Advisory Board
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {advisors.map((advisor, index) => (
              <motion.div
                key={advisor.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/[0.02] border border-white/5 rounded-xl p-6"
              >
                <h4 className="text-foreground font-semibold mb-1">{advisor.name}</h4>
                <p className="text-brand-primary text-sm mb-3">{advisor.role} at {advisor.company}</p>
                <p className="text-foreground/40 text-sm">{advisor.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Join Team CTA */}
        <div className="text-center mt-16">
          <p className="text-foreground/50 mb-6">Want to join our growing team?</p>
          <Link href="/careers" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary rounded-full font-semibold text-sm text-black hover:shadow-[0_0_30px_rgba(26,109,214,0.5)] transition-all">
            View Open Positions
          </Link>
        </div>
      </div>
    </section>
  );
}