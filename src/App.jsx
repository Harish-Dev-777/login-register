import React, { useState } from "react"
import LoginForm from "@/components/web/LoginForm"
import RegisterForm from "@/components/web/RegisterForm"
import BackButton from "@/components/web/BackButton"
import { Toaster } from "sonner"
import Hero from "./components/blocks/Hero"
import Nav from "./components/blocks/Nav"
import LightRays from "./components/LightRays"
import { Blog7 } from "./components/blocks/blog7"
import StatsCounter from "./components/web/StatsCounter"
import BrandMarquee from "./components/web/BrandMarquee"
import ServicesSection from "./components/blocks/ServicesSection"
import AboutSection from "./components/blocks/AboutSection"
import TestimonialsSection from "./components/blocks/TestimonialsSection"
import FaqSection from "./components/blocks/FaqSection"
import Footer from "./components/blocks/Footer"


const App = () => {
  const [view, setView] = useState("login") // "login", "register", or "home"
  const [user, setUser] = useState(null)

  const toggleView = () => {
    setView(view === "login" ? "register" : "login")
  }

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setView("home")
  }

  const handleLogout = () => {
    setUser(null)
    setView("login")
  }

  const handleBack = () => {
    if (view === "register") {
      setView("login")
    } else if (view === "login") {
      window.history.back()
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      <Toaster position="bottom-right" theme="dark" richColors />

      {/* Navbar — only visible after login */}
      {view === "home" && <Nav user={user} onLogout={handleLogout} />}

      {/* Global Back Button for Auth Views */}
      {view !== "home" && <BackButton onClick={handleBack} />}
      
      {/* Global Light Rays Background — fixed for full page coverage */}
      {view === "home" && (
        <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
          <LightRays
            raysOrigin="top-center"
            raysColor="#a3e635"
            raysSpeed={0.8}
            lightSpread={1.2}
            rayLength={1.5}
            pulsating={true}
          />
        </div>
      )}

      {/* Home content — Hero + other sections after login */}
      {view === "home" && (
        <div className="flex-1 z-10 relative">
          <Hero />
          <StatsCounter />
          <BrandMarquee />
          <ServicesSection />
          <AboutSection />
          <Blog7 />
          <TestimonialsSection />
          <FaqSection />
          <Footer />
        </div>
      )}

      {/* Subtle background gradient — only on home */}
      {view === "home" && (
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none z-[1]" />
      )}

      {/* Auth forms — only show on login/register */}
      {view !== "home" && (
        <div className="flex-1 flex items-center justify-center p-6 z-10">
          <div className="w-full max-w-md transition-all duration-700 ease-in-out transform">
            {view === "login" ? (
              <LoginForm onToggleView={toggleView} onLoginSuccess={handleLoginSuccess} />
            ) : (
              <RegisterForm onToggleView={toggleView} />
            )}
          </div>
        </div>
      )}

    </div>
  )
}

export default App