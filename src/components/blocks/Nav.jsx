import React from "react";
import { LogOut, User } from "lucide-react";

const Nav = ({ user, onLogout }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    {
      title: "Home",
      href: "#hero",
    },
    {
      title: "Services",
      href: "#services",
    },
    {
      title: "About",
      href: "#about",
    },
    {
      title: "Testimonials",
      href: "#testimonials",
    },
    {
      title: "Contact",
      href: "#contact",
    },
  ];

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-[100] flex items-center justify-between px-6 py-4 transition-all duration-500 ${scrolled ? "glass-card border-b border-white/10 py-3 shadow-xl" : "bg-transparent border-b border-transparent"}`}
    >
      {/* logo  */}
      <div>
        <a href="#hero">
          <h1 className="text-xl font-bold">
            Better<span className="text-primary">Web</span>
          </h1>
        </a>
      </div>
      {/* Desktop Navlinks */}
      <div className="hidden md:block">
        <ul className="flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-2"
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Toggle Button */}
      <div className="md:hidden z-[110]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-8 h-8 flex flex-col justify-center items-start gap-2 transition-all duration-500 bg-black/20 p-1 rounded-sm"
          style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
        >
          <div
            className={`h-[3px] bg-primary rounded-full transition-all duration-500 ${isOpen ? "w-full absolute rotate-45" : "w-1/2"}`}
          />
          <div
            className={`h-[3px] bg-primary rounded-full transition-all duration-300 ${isOpen ? "scale-x-0" : "w-3/4"}`}
          />
          <div
            className={`h-[3px] bg-primary rounded-full transition-all duration-500 ${isOpen ? "w-full absolute -rotate-45" : "w-full"}`}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 h-screen w-screen bg-black z-[105] flex flex-col items-center justify-center transition-all duration-700 md:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {/* Background Glow for Mobile Menu */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 blur-[100px] rounded-full transition-opacity duration-1000 ${isOpen ? "opacity-100" : "opacity-0"}`}
        />

        <ul className="flex flex-col items-center gap-6 relative z-10">
          {navLinks.map((link, i) => (
            <li
              key={link.href}
              style={{
                transitionDelay: isOpen ? `${150 + i * 80}ms` : "0ms",
                transform: isOpen ? "translateY(0)" : "translateY(40px)",
                opacity: isOpen ? 1 : 0,
              }}
              className="transition-all duration-700 ease-out"
            >
              <a
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-4xl font-black hover:text-primary transition-all duration-300 uppercase tracking-tighter hover:tracking-normal active:scale-95 block"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile User Profile */}
        {user && (
          <div
            className={`mt-12 flex flex-col items-center gap-4 relative z-10 transition-all duration-700 delay-[600ms] ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="w-20 h-20 rounded-none overflow-hidden border border-primary/40 bg-secondary flex items-center justify-center">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <div className="text-center">
              <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1">
                Signed in as
              </p>
              <span className="text-xl font-bold font-heading uppercase">
                {user.name}
              </span>
            </div>
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="mt-4 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors uppercase text-xs font-bold tracking-[0.3em] border border-white/10 px-6 py-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </div>
      {/* logined user profile and name */}
      {/* Desktop User Profile */}
      <div className="hidden md:flex items-center gap-3">
        {user ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30 bg-secondary flex items-center justify-center">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
};

export default Nav;
