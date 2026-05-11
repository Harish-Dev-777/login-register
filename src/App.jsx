import React, { useState } from "react"
import LoginForm from "@/components/web/LoginForm"
import RegisterForm from "@/components/web/RegisterForm"
import BackButton from "@/components/web/BackButton"
import { Toaster } from "sonner"
import { LogOut, User } from "lucide-react"

const Home = ({ user, onLogout }) => {
  return (
    <div className="w-full min-h-screen flex flex-col animate-in fade-in duration-700">
      {/* Top-right Logout button */}
      <div className="absolute top-6 right-8 z-20">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-red-500 transition-all hover:tracking-[0.3em]"
        >
          Logout <LogOut className="w-3 h-3" />
        </button>
      </div>

      {/* Centered welcome message */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6">
          {/* Profile Image */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-primary/30 overflow-hidden animate-in zoom-in duration-700 shadow-[0_0_20px_rgba(163,230,53,0.15)] bg-secondary flex items-center justify-center">
              {user?.image ? (
                <img 
                  src={user.image} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-600" />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase font-heading leading-none">
              Welcome
            </h2>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase font-heading leading-none text-primary neon-text-glow">
              {user?.name || "Operator"}
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}

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
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Toaster position="bottom-right" theme="dark" richColors />
      
      {/* Global Back Button for Auth Views */}
      {view !== "home" && <BackButton onClick={handleBack} />}
      
      {/* Subtle background gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="w-full max-w-4xl z-10 flex flex-col items-center">
        {view !== "home" && (
          <div className="w-full max-w-md transition-all duration-700 ease-in-out transform">
            {view === "login" ? (
              <LoginForm onToggleView={toggleView} onLoginSuccess={handleLoginSuccess} />
            ) : (
              <RegisterForm onToggleView={toggleView} />
            )}
          </div>
        )}

        {view === "home" && (
          <Home user={user} onLogout={handleLogout} />
        )}
      </div>

    </div>
  )
}

export default App