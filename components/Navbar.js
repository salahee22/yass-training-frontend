"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/football", label: "Football" },
    { href: "/training", label: "Entraînement" },
    { href: "/elite", label: "Elite" },
  ];

  const isActive = (href) => pathname === href;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? "rgba(10,10,10,0.97)" : "#0A0A0A",
        borderBottom: scrolled ? "1px solid #2A2A2A" : "1px solid transparent",
        backdropFilter: "blur(12px)",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "68px",
            position: "relative",
          }}
        >
          {/* Logo — gauche */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontFamily: "Inter", fontStyle: "italic", fontWeight: 900, fontSize: "20px", color: "#fff", letterSpacing: "-0.02em" }}>
                Yass
              </span>
              <span style={{ fontFamily: "Inter", fontStyle: "italic", fontWeight: 900, fontSize: "20px", letterSpacing: "-0.02em", color: "#FFFFFF", marginLeft: "3px" }}>
                Training
              </span>
            </div>
          </Link>

          {/* Nav links — centré */}
          <div
            className="hidden md:flex"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: "13px",
                  color: isActive(link.href) ? "#FFFFFF" : "#AAAAAA",
                  textDecoration: "none",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  background: "transparent",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => { if (!isActive(link.href)) e.currentTarget.style.color = "#FFFFFF" }}
                onMouseLeave={(e) => { if (!isActive(link.href)) e.currentTarget.style.color = "#AAAAAA" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Droite — recherche + sign up */}
          <div
            className="hidden md:flex"
            style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}
          >
            {/* Search */}
            {searchOpen ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  style={{ background: "rgba(26,26,40,0.9)", border: "1px solid #00C3D0", borderRadius: "24px", padding: "7px 16px", color: "#fff", fontFamily: "Inter", fontSize: "13px", outline: "none", width: "200px" }}
                />
                <button onClick={() => { setSearchOpen(false); setSearchQuery("") }} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", display: "flex" }}>
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#AAAAAA", display: "flex", alignItems: "center", transition: "color 0.2s ease" }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "#AAAAAA"}
              >
                <Search size={18} />
              </button>
            )}

            {/* Sign up button */}
            <Link
              href="/elite#inscription"
              className="btn-cyan"
              style={{ padding: "8px 18px", fontSize: "12px" }}
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
