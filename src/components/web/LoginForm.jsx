import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/schemas/authSchemas"
import { getAllUsers } from "@/services/authApi"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Phone, Lock, Loader2 } from "lucide-react"


const LoginForm = ({ onToggleView, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mobile: "",
      password: ""
    }
  })

  const onSubmit = async (data) => {
    setApiError(null)
    console.log("[Login] Attempting login with mobile:", data.mobile)

    try {
      const users = await getAllUsers()
      console.log(`[Login] Total registered users: ${users.length}`)

      const user = users.find(u => u.mobile === data.mobile && u.password === data.password)
      console.log("[Login] Matching user found:", !!user)

      if (user) {
        console.log("[Login] Login success — user:", { name: user.name, mobile: user.mobile, email: user.email })
        toast.success(`Access Granted: ${user.name}`, {
          className: "glass-card border-primary/20 text-white font-heading",
        })
        onLoginSuccess(user)
      } else {
        console.warn("[Login] Authentication failed — no matching credentials.")
        setApiError("Invalid mobile number or security key.")
        toast.error("Authentication Failed", {
          description: "Credential mismatch detected.",
        })
      }
    } catch (err) {
      console.error("[Login] Error during login:", err)
      setApiError("Terminal connection error. Please try again.")
      toast.error("System Error", {
        description: "Unable to reach authentication server.",
      })
    }
  }

  return (
    <Card className="glass-card border-none w-full max-w-md mx-auto overflow-hidden">
      <CardHeader className="space-y-1 pb-8">
        <CardTitle className="text-4xl font-black tracking-tighter text-white font-heading">
          Log <span className="text-primary">In</span>
        </CardTitle>
        <CardDescription className="text-gray-400 font-medium">
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="mobile" className="text-xs uppercase tracking-widest font-bold text-gray-500 font-heading">
                Mobile Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="mobile"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className={`input-dark pl-10 h-12 ${errors.mobile ? 'border-red-500/50' : ''}`}
                  {...register("mobile")}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                />
              </div>
              {errors.mobile && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter mt-1">{errors.mobile.message}</p>}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs uppercase tracking-widest font-bold text-gray-500 font-heading">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`input-dark pl-10 h-12 ${errors.password ? 'border-red-500/50' : ''}`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full btn-neon h-14 mt-4"
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-black" />
            ) : (
              <>Login</>
            )}
          </Button>

          {apiError && (
            <p className="text-[10px] font-bold text-red-500 text-center uppercase tracking-widest mt-2 animate-pulse">
              {apiError}
            </p>
          )}
        </form>
      </CardContent>
      
      <CardFooter className="pb-8 justify-center border-t border-white/5 pt-6 mt-4">
        <p className="text-sm text-gray-500">
          New here? <button onClick={onToggleView} className="text-primary font-black hover:underline ml-1">Create an account</button>
        </p>
      </CardFooter>
    </Card>
  )
}

export default LoginForm
