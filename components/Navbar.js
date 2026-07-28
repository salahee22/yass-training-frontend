"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, X, Menu, LayoutDashboard, LogIn, User, ShieldCheck, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [dashboardLink, setDashboardLink] = useState(null); // { href, label } ou null
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setLoginDropdownOpen(false);
  }, [pathname]);

  // Détecte quel type d'utilisateur est connecté
  useEffect(() => {
    const adminToken = localStorage.getItem("admin_token");
    const playerToken = localStorage.getItem("player_token");
    if (adminToken) {
      setDashboardLink({ href: "/dashboard", label: "Dashboard" });
    } else if (playerToken) {
      setDashboardLink({ href: "/account", label: "Mon compte" });
    } else {
      setDashboardLink(null);
    }
  }, [pathname]);

  const navLinks = [
    { href: "/football", label: "Football" },
    { href: "/training", label: "Entraînement" },
    { href: "/elite", label: "Elite" },
  ];

  const isActive = (href) => pathname === href;

  return (
    <>
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
            <Link href="/" style={{ textDecoration: "none", outline: "none" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontFamily: "Inter", fontStyle: "italic", fontWeight: 900, fontSize: "20px", color: "#fff", letterSpacing: "-0.02em" }}>
                  Yass
                </span>
                <span style={{ fontFamily: "Inter", fontStyle: "italic", fontWeight: 900, fontSize: "20px", letterSpacing: "-0.02em", color: "#FFFFFF", marginLeft: "3px" }}>
                  Training
                </span>
              </div>
            </Link>

            {/* Nav links — centré, desktop uniquement */}
            <div
              className="desktopNav"
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
                    outline: "none",
                  }}
                  onMouseEnter={(e) => { if (!isActive(link.href)) e.currentTarget.style.color = "#FFFFFF" }}
                  onMouseLeave={(e) => { if (!isActive(link.href)) e.currentTarget.style.color = "#AAAAAA" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Droite — recherche + connexion/dashboard + sign up, desktop uniquement */}
            <div
              className="desktopNav"
              style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}
            >
              {searchOpen ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    style={{ background: "rgba(26,26,40,0.9)", border: "1px solid #2A2A2A", borderRadius: "24px", padding: "7px 16px", color: "#fff", fontFamily: "Inter", fontSize: "13px", outline: "none", width: "200px" }}
                  />
                  <button onClick={() => { setSearchOpen(false); setSearchQuery("") }} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", display: "flex", outline: "none" }}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="noTapHighlight"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#AAAAAA", display: "flex", alignItems: "center", transition: "color 0.2s ease", outline: "none" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                  onMouseLeave={e => e.currentTarget.style.color = "#AAAAAA"}
                >
                  <Search size={18} />
                </button>
              )}

              {dashboardLink ? (
                <Link
                  href={dashboardLink.href}
                  className="noTapHighlight"
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    background: "#1E1E1E", color: "#FFFFFF",
                    fontFamily: "Inter", fontWeight: 600, fontSize: "12px",
                    padding: "8px 16px", borderRadius: "24px",
                    textDecoration: "none", outline: "none",
                    border: "1px solid #2A2A2A", transition: "background 0.2s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#2A2A2A"}
                  onMouseLeave={e => e.currentTarget.style.background = "#1E1E1E"}
                >
                  <LayoutDashboard size={14} />
                  {dashboardLink.label}
                </Link>
              ) : (
                <>
                  <div style={{ position: "relative" }}>
                    <button
                      onClick={() => setLoginDropdownOpen(o => !o)}
                      className="noTapHighlight"
                      style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        background: "transparent", color: "#AAAAAA",
                        fontFamily: "Inter", fontWeight: 600, fontSize: "12px",
                        padding: "8px 14px", borderRadius: "24px",
                        border: "1px solid #2A2A2A", cursor: "pointer", outline: "none",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = "#FFF"; e.currentTarget.style.borderColor = "#444" }}
                      onMouseLeave={e => { e.currentTarget.style.color = "#AAAAAA"; e.currentTarget.style.borderColor = "#2A2A2A" }}
                    >
                      <LogIn size={13} /> Connexion
                      <ChevronDown size={12} style={{ transform: loginDropdownOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
                    </button>

                    {loginDropdownOpen && (
                      <>
                        <div onClick={() => setLoginDropdownOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 10 }} />
                        <div style={{
                          position: "absolute", top: "calc(100% + 8px)", right: 0,
                          background: "#141414", border: "1px solid #262626", borderRadius: "12px",
                          padding: "6px", minWidth: "190px", zIndex: 20,
                          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                        }}>
                          <Link
                            href="/login"
                            className="noTapHighlight"
                            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", textDecoration: "none", color: "#EEE", fontFamily: "Inter", fontSize: "13px", fontWeight: 600, outline: "none" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#1E1E1E"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          >
                            <User size={15} color="#C8A84B" /> Espace joueur
                          </Link>
                          <Link
                            href="/dashboard/login"
                            className="noTapHighlight"
                            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", textDecoration: "none", color: "#EEE", fontFamily: "Inter", fontSize: "13px", fontWeight: 600, outline: "none" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#1E1E1E"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          >
                            <ShieldCheck size={15} color="#C8A84B" /> Espace admin
                          </Link>
                        </div>
                      </>
                    )}
                  </div>

                  <Link
                    href="/elite#inscription"
                    className="btn-cyan noTapHighlight"
                    style={{ padding: "8px 18px", fontSize: "12px", outline: "none" }}
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>

            {/* Burger mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="mobileBurger noTapHighlight"
              style={{ marginLeft: "auto", display: "none", background: "none", border: "none", color: "#FFF", cursor: "pointer", outline: "none", padding: "4px" }}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* OVERLAY + DRAWER MOBILE */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1100 }}
        />
      )}

      <div className={`mobileDrawer${mobileMenuOpen ? " open" : ""}`} style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "260px", background: "#0F0F0F", borderLeft: "1px solid #1E1E1E", zIndex: 1200, padding: "20px", display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
          <button onClick={() => setMobileMenuOpen(false)} className="noTapHighlight" style={{ background: "none", border: "none", color: "#888", cursor: "pointer", outline: "none" }}>
            <X size={22} />
          </button>
        </div>

        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="noTapHighlight"
            style={{
              fontFamily: "Inter", fontWeight: 600, fontSize: "15px",
              color: isActive(link.href) ? "#FFFFFF" : "#AAAAAA",
              textDecoration: "none", padding: "12px 14px", borderRadius: "8px",
              background: isActive(link.href) ? "#1E1E1E" : "transparent",
              outline: "none",
            }}
          >
            {link.label}
          </Link>
        ))}

        <div style={{ marginTop: "12px", paddingTop: "16px", borderTop: "1px solid #1E1E1E", display: "flex", flexDirection: "column", gap: "6px" }}>
          {dashboardLink ? (
            <Link
              href={dashboardLink.href}
              className="noTapHighlight"
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                fontFamily: "Inter", fontWeight: 600, fontSize: "15px",
                color: "#FFFFFF", textDecoration: "none",
                padding: "12px 14px", borderRadius: "8px",
                background: "#1E1E1E", outline: "none",
              }}
            >
              <LayoutDashboard size={16} />
              {dashboardLink.label}
            </Link>
          ) : (
            <>
              <p style={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#666", padding: "0 14px", marginBottom: "2px" }}>
                Connexion
              </p>
              <Link
                href="/login"
                className="noTapHighlight"
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", borderRadius: "8px", textDecoration: "none", color: "#EEE", fontFamily: "Inter", fontSize: "14px", fontWeight: 600, outline: "none" }}
              >
                <User size={15} color="#C8A84B" /> Espace joueur
              </Link>
              <Link
                href="/dashboard/login"
                className="noTapHighlight"
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", borderRadius: "8px", textDecoration: "none", color: "#EEE", fontFamily: "Inter", fontSize: "14px", fontWeight: 600, outline: "none" }}
              >
                <ShieldCheck size={15} color="#C8A84B" /> Espace admin
              </Link>
            </>
          )}
        </div>

        <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #1E1E1E" }}>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            style={{ width: "100%", background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontFamily: "Inter", fontSize: "13px", outline: "none", marginBottom: "12px" }}
          />
          {!dashboardLink && (
            <Link
              href="/elite#inscription"
              className="btn-cyan noTapHighlight"
              style={{ display: "block", textAlign: "center", padding: "10px 18px", fontSize: "13px", outline: "none" }}
            >
              S'inscrire
            </Link>
          )}
        </div>
      </div>

      <style jsx global>{`
        .noTapHighlight {
          -webkit-tap-highlight-color: transparent;
        }
        @media (max-width: 860px) {
          .desktopNav {
            display: none !important;
          }
          .mobileBurger {
            display: flex !important;
          }
        }
        .mobileDrawer {
          transform: translateX(100%);
          transition: transform 0.25s ease;
        }
        .mobileDrawer.open {
          transform: translateX(0);
        }
      `}</style>
    </>
  );
}