"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";
import { Button } from "@/components/ui/Button";
import { Mail, FileText, Github, Linkedin } from "lucide-react";

export default function AboutCTA() {
  const { t } = useTranslation();

  return (
    <section data-about-cta className="relative py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl opacity-60" />

          {/* CTA Card */}
          <div className="relative bg-bg/80 backdrop-blur-xl border border-border/30 rounded-3xl p-12 md:p-16">
            <div className="text-center space-y-8">
              <div data-tetris-title>
                <h2 className="title-section gradient-text mb-4">
                  Let's Work Together
                </h2>
                <p className="text-lg md:text-xl text-text/70 max-w-2xl mx-auto">
                  I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                <Button
                  variant="filled"
                  size="lg"
                  asLink
                  href="mailto:thomas.augot@gmail.com"
                  className="w-full sm:w-auto"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Get in Touch
                </Button>
                <Button
                  variant="outlined"
                  size="lg"
                  asLink
                  href="/assets/cv/Thomas_Augot_CV.pdf"
                  className="w-full sm:w-auto"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Download CV
                </Button>
              </div>

              {/* Social Links */}
              <div className="flex gap-6 justify-center items-center pt-8 border-t border-border/30">
                <a
                  href="https://github.com/thomasaugot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-text/60 hover:text-primary transition-colors duration-300"
                >
                  <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-mono">GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/thomas-augot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-text/60 hover:text-primary transition-colors duration-300"
                >
                  <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-mono">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
