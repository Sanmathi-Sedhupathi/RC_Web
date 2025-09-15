import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { ThemeToggle } from "../components/ThemeToggle";
import About from "../assets/about.png";
import Hero from "../assets/hero.png";
import { motion } from "framer-motion";

const navigationItems = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
];

// Floating particles background
// Bigger & brighter red particles
const ParticlesBackground = () => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const p = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(p);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 rounded-full bg-red-500"
          style={{
            boxShadow: "0 0 8px 4px rgba(239,68,68,0.5)", // soft red glow
            filter: "blur(1px)", // subtle shine
          }}
          initial={{ x: `${p.x}vw`, y: `${p.y}vh`, opacity: 0.3, scale: 0.8 }}
          animate={{
            y: [`${p.y}vh`, `${(p.y + 10) % 100}vh`],
            x: [`${p.x}vw`, `${(p.x + (Math.random() > 0.5 ? 5 : -5)) % 100}vw`],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.3, 0.9],
          }}
          transition={{
            duration: 8 + Math.random() * 5, // slower float
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};



export const Desktop = (): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<
    | { type: "success"; text: string }
    | { type: "error"; text: string }
    | null
  >(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitResult(null);
    if (!name || !email || !message) {
      setSubmitResult({ type: "error", text: "Please fill in all fields." });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/sendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to send");
      setSubmitResult({ type: "success", text: data?.message || "Email sent." });
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setSubmitResult({ type: "error", text: err?.message || "Something went wrong" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
 <div className="relative min-h-screen w-full overflow-x-hidden transition-colors duration-300">
      {/* background color */}
      <div className="absolute inset-0 bg-black dark:bg-black light:bg-white -z-20" />      {/* Red particles background */}
      <ParticlesBackground />

      {/* Header */}
      <header className="fixed w-full h-[70px] top-0 left-0 bg-black/90 dark:bg-black/90 light:bg-white/90 backdrop-blur-sm shadow-lg z-50 transition-colors duration-300">
        <nav className="flex w-full max-w-7xl mx-auto h-full items-center justify-between px-4 lg:px-8">
          <div className="text-white font-redseven text-l tracking-tight hover:scale-105 transition-transform duration-300">
            Rider's Companion
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navigationItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="relative font-medium text-white text-sm tracking-wide hover:text-red-400 transition-all duration-300 hover:scale-110 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-red-400 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </a>
            ))}
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="w-9 h-9 p-0 hover:bg-white/10"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-white" />
              ) : (
                <Menu className="h-5 w-5 text-white" />
              )}
            </Button>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-sm border-t border-white/10">
            <div className="flex flex-col py-4">
              {navigationItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-6 py-3 text-white text-sm tracking-wide hover:bg-white/10 transition-all duration-300 hover:translate-x-2"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-[70px]">
        {/* Hero Section */}
        <section
          id="home"
          className="relative min-h-screen flex flex-col items-center justify-center px-4"
        >
          <div
            className="w-full max-w-[400px] mx-auto mb-8 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <img
              className="w-full h-auto mx-auto hover:scale-105 transition-transform duration-500"
              alt="Riders Companion Logo"
              src={Hero}
            />
          </div>

          <div className="text-center max-w-3xl mx-auto space-y-6">
            <p
              className="font-display font-medium text-white text-lg md:text-xl lg:text-2xl leading-relaxed opacity-0 animate-fade-in-up tracking-wide"
              style={{ animationDelay: "1s" }}
            >
              The ultimate riding app for solo journeys & unforgettable group
              adventures with friends and family
            </p>
            <p
              className="font-display font-semibold text-white text-xl md:text-2xl lg:text-3xl opacity-0 animate-bounce-in tracking-wider"
              style={{ animationDelay: "1.4s" }}
            >
              Together on every road
            </p>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 lg:py-24">
          <h2 className="text-l md:text-xl lg:text-3xl font-redseven text-white mb-16 text-center opacity-0 animate-slide-in-left tracking-tight">
            About Riders Companion
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] items-center">
            <div
              className="order-2 lg:order-1 opacity-0 animate-slide-in-left w-full flex justify-center"
              style={{ animationDelay: "0.3s" }}
            >
              <img
                className="w-full max-w-full h-auto rounded-lg shadow-2xl hover:scale-105 transition-transform duration-500 hover:shadow-red-500/20"
                alt="About Riders Companion"
                src={About}
              />
            </div>

            <div className="order-1 lg:order-2 space-y-8 px-4 lg:px-0">
              <p
                className="font-sans font-light text-white text-lg md:text-xl lg:text-2xl leading-relaxed opacity-0 animate-slide-in-right"
                style={{ animationDelay: "0.6s" }}
              >
                Riders Companion is your ultimate ride buddy – connecting you,
                your friends, and the road.
              </p>
              <p
                className="font-sans font-light text-white text-lg md:text-xl lg:text-2xl leading-relaxed opacity-0 animate-slide-in-right"
                style={{ animationDelay: "0.9s" }}
              >
                Stay on track, ride together, and explore more with ease.
              </p>
              <p
                className="font-display font-bold text-white text-xl md:text-2xl lg:text-3xl leading-relaxed opacity-0 animate-bounce-in tracking-wide"
                style={{ animationDelay: "1.2s" }}
              >
                Ride. Connect. Explore.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 lg:py-20">
          <h2 className="text-l md:text-xl lg:text-3xl font-redseven text-white mb-16 text-center opacity-0 animate-fade-in-up tracking-tight">
            Contact Riders Companion
          </h2>

          <div className="w-full flex justify-center">
            <Card className="w-full max-w-5xl bg-red-700/80 rounded-xl border-0 backdrop-blur-sm opacity-0 animate-scale-in hover:scale-105 transition-transform duration-500">
              <CardContent className="p-6 lg:p-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      className="h-12 bg-white rounded-lg border-0 text-gray-900 placeholder:text-gray-500 font-sans transition-all duration-300 focus:scale-105 focus:shadow-lg"
                      placeholder="Your Name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                      className="h-12 bg-white rounded-lg border-0 text-gray-900 placeholder:text-gray-500 font-sans transition-all duration-300 focus:scale-105 focus:shadow-lg"
                      placeholder="Your Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <Textarea
                    className="min-h-[150px] bg-white rounded-lg border-0 resize-none text-gray-900 placeholder:text-gray-500 font-sans transition-all duration-300 focus:scale-105 focus:shadow-lg"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto px-12 h-12 bg-white hover:bg-gray-100 text-gray-900 rounded-lg font-display font-medium text-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </div>

                  {submitResult && (
                    <div
                      className={
                        submitResult.type === "success"
                          ? "text-green-100 text-center"
                          : "text-red-100 text-center"
                      }
                    >
                      {submitResult.text}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="text-center">
          <p
            className="text-white/70 text-sm font-sans opacity-0 animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            © 2025 Riders Companion. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
