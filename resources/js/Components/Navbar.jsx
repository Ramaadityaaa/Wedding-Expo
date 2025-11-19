import { useState } from 'react'  
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { Link } from '@inertiajs/react'

export default function Navbar() {
  const favorites = []
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const handleNavClick = () => setIsMobileMenuOpen(false)

  return (
    <nav
      className="
        fixed top-0 left-0 right-0 w-full z-50
        backdrop-blur-2xl 
        bg-white/35 
        shadow-[0_4px_25px_rgba(255,200,80,0.35)]
        border-b border-yellow-400/40
        gold-glow
      "
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <div className="flex items-center space-x-2">
            <button
              className="md:hidden p-2 rounded-lg bg-white/70 shadow hover:bg-yellow-100 transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link href="/" className="flex items-center group">

              <div
                className="
                  px-4 py-2 rounded-xl shadow-lg relative overflow-hidden
                  transition-all duration-300
                  group-hover:shadow-[0_0_35px_rgba(255,210,100,1)]
                "
                style={{
                  background:
                    'linear-gradient(135deg,#f4c95d,#ffb300,#ff8f00,#f4c95d,#ffb300)',
                  backgroundSize: '200% 200%',
                  animation: 'goldPulse 4s ease-in-out infinite',
                  boxShadow: '0 0 18px rgba(255,185,60,0.8)'
                }}
              >
                <div className="absolute inset-0 pointer-events-none shineSweep"></div>

                <div className="relative text-xl md:text-2xl font-serif tracking-wide text-white font-bold drop-shadow-[0_0_6px_white]">
                  Wedding <span className="font-black">Expo</span>
                </div>
              </div>
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-8">
            <Link className="navLink" href="/">Beranda</Link>
            <Link className="navLink" href="/#vendors">Vendor</Link>

            <Link className="flex items-center navLink" href="/favorites">
              Favorit
              {favorites.length > 0 && (
                <span className="ml-1 bg-gold-pill text-white text-xs px-2 py-0.5 rounded-full shadow">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link className="navLink" href="/#inspiration">Inspirasi</Link>
            <Link className="navLink" href="/#about">Tentang</Link>
          </div>

          {/* CTA BUTTONS */}
          <div className="hidden md:flex items-center space-x-4">

            {/* LOGIN BUTTON GLOSSY GOLD */}
            <Link href="/login">
              <Button
                className="
                  btn-login
                  rounded-xl px-5 py-2 text-white font-semibold
                "
              >
                Login
              </Button>
            </Link>

            {/* REGISTER BUTTON — SAMA PERSIS DENGAN LOGIN */}
            <Link href="/register/vendor">
              <Button
                className="
                  btn-login
                  rounded-xl px-5 py-2 text-white font-semibold
                "
              >
                Register
              </Button>
            </Link>

          </div>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-xl border-t border-yellow-300 shadow-xl animate-fadeIn">
            <div className="px-4 py-4 space-y-3">

              <Link className="mobileLink" href="/" onClick={handleNavClick}>Beranda</Link>
              <Link className="mobileLink" href="/#vendors" onClick={handleNavClick}>Vendor</Link>
              <Link className="mobileLink" href="/favorites" onClick={handleNavClick}>Favorit</Link>
              <Link className="mobileLink" href="/#inspiration" onClick={handleNavClick}>Inspirasi</Link>
              <Link className="mobileLink" href="/#about" onClick={handleNavClick}>Tentang</Link>

              {/* MOBILE REGISTER */}
              <Link href="/register/vendor" onClick={handleNavClick}>
                <Button className="btn-login w-full mt-2">
                  Register
                </Button>
              </Link>

              {/* MOBILE LOGIN */}
              <Link href="/login" onClick={handleNavClick}>
                <Button className="btn-login w-full">
                  Login
                </Button>
              </Link>

            </div>
          </div>
        )}

      </div>

      {/* EXTRA CSS */}
      <style>{`

        /* GOLD PULSE BG */
        @keyframes goldPulse {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }

        /* GOLD SHINE ANIMATION */
        .shineSweep {
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255,255,255,0.9) 50%,
            transparent 100%
          );
          transform: skewX(-20deg);
          animation: shineSweepMove 3s infinite linear;
        }

        @keyframes shineSweepMove {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }

        /* SUPER GLOSSY GOLD BUTTON (LOGIN & REGISTER) */
        .btn-login {
          position: relative;
          background: linear-gradient(135deg,#d4af37,#f8d778,#b8860b);
          border: none;
          color: white;
          font-weight: 600;
          padding: 10px 22px;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 15px rgba(255,200,80,0.5);
          transition: 0.3s;
        }

        .btn-login::after {
          content: "";
          position: absolute;
          top: 0;
          left: -120%;
          width: 70%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255,255,255,0.8),
            transparent
          );
          transform: skewX(-25deg);
          animation: shineLogin 2.6s infinite;
        }

        @keyframes shineLogin {
          0% { left: -120%; }
          60% { left: 130%; }
          100% { left: 130%; }
        }

        .btn-login:hover {
          transform: scale(1.05);
          box-shadow: 0 0 22px rgba(255,210,100,0.85);
        }

        /* NAV LINKS */
        .navLink {
          font-weight: 600;
          color: #000;
          position: relative;
          transition: all 0.25s ease-in-out;
        }

        .navLink:hover {
          color: #c48000;
          text-shadow: 0 0 4px rgba(255,200,100,0.7);
        }

        .navLink::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -3px;
          width: 0%;
          height: 2px;
          background: linear-gradient(to right,#facc15,#fb923c,#fbbf24);
          transition: 0.25s;
          border-radius: 8px;
        }

        .navLink:hover::after {
          width: 100%;
        }

        /* MOBILE LINKS */
        .mobileLink {
          padding: 10px 0;
          font-weight: 600;
          color: #000;
          border-bottom: 1px solid #f4d68a;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  )
}
