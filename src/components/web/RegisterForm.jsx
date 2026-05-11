import React, { useState, useEffect } from "react"
import { getAllUsers, registerUser } from "@/services/authApi"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "@/schemas/authSchemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Camera, Loader2 } from "lucide-react"


const RegisterForm = ({ onToggleView }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [apiError, setApiError] = useState(null)
  const [allUsers, setAllUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers()
        setAllUsers(users)
        window.allUsers = users // Expose to console as a "command"
        console.log("All users in database (accessible via 'window.allUsers'):")
        console.table(users)
      } catch (err) {
        console.error("Failed to fetch users:", err)
      }
    }
    fetchUsers()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: ""
    }
  })

  const onSubmit = async (data) => {
    setApiError(null)
    console.log("[Register] Full submitted user object:", data)

    try {
      // Check if mobile number already exists
      const existingUsers = await getAllUsers()
      console.log("All registered users fetched during submission:")
      console.table(existingUsers)
      const alreadyExists = existingUsers.some(u => u.mobile === data.mobile)
      console.log(`[Register] Mobile ${data.mobile} already exists:`, alreadyExists)

      if (alreadyExists) {
        console.warn("[Register] Blocked — mobile number already registered.")
        setApiError('This mobile number is already registered. Please login instead.')
        toast.error("Mobile Already Registered", {
          description: "Use a different number or login to your existing account.",
          className: "glass-card border-red-500/20 text-white font-heading",
        })
        return
      }

      console.log("[Register] Submitting new user to API...")
      await registerUser({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        image: imagePreview
      })
      console.log("[Register] Registration successful!")

      toast.success("Registration successful!", {
        description: "Redirecting to login...",
        className: "glass-card border-primary/20 text-white font-heading",
      })

      reset()
      setImagePreview(null)
      setTimeout(() => onToggleView(), 1500)
    } catch (err) {
      console.error("[Register] Error during registration:", err)
      setApiError('Unable to process registration. Please check your connection or try again later.')
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card className="glass-card border-none w-full max-w-md mx-auto overflow-hidden">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-4xl font-black tracking-tighter text-white font-heading">
          Sign <span className="text-primary">Up</span>
        </CardTitle>
        <CardDescription className="text-gray-400 font-medium">
          Create an account to join the elite infrastructure.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center justify-center space-y-2 mb-2">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden bg-secondary group-hover:border-primary transition-all duration-300">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <Label 
                htmlFor="image-upload" 
                className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full cursor-pointer text-black shadow-lg hover:scale-110 transition-transform"
              >
                <Camera className="w-3.5 h-3.5" />
              </Label>
              <input 
                id="image-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Name</Label>
              <Input
                placeholder="Full Name"
                className={`input-dark h-11 ${errors.name ? 'border-red-500/50' : ''}`}
                {...register("name")}
              />
              {errors.name && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid gap-1.5">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Email</Label>
              <Input
                placeholder="name@example.com"
                className={`input-dark h-11 ${errors.email ? 'border-red-500/50' : ''}`}
                {...register("email")}
              />
              {errors.email && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div className="grid gap-1.5">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Mobile</Label>
              <Input
                placeholder="10-digit number"
                maxLength={10}
                className={`input-dark h-11 ${errors.mobile ? 'border-red-500/50' : ''}`}
                {...register("mobile")}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
              />
              {errors.mobile && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.mobile.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className={`input-dark h-11 pr-10 ${errors.password ? 'border-red-500/50' : ''}`}
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
              </div>

              <div className="grid gap-1.5">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Confirm</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className={`input-dark h-11 pr-10 ${errors.confirmPassword ? 'border-red-500/50' : ''}`}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            {errors.password && <p className="text-[10px] font-bold text-red-500">{errors.password.message}</p>}
            {errors.confirmPassword && <p className="text-[10px] font-bold text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full btn-neon h-14 mt-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-black" />
            ) : (
              <>Create Account</>
            )}
          </Button>

          {apiError && (
            <p className="text-[10px] font-bold text-red-500 text-center uppercase tracking-widest mt-4 animate-pulse">
              {apiError}
            </p>
          )}
        </form>
      </CardContent>
      
      <CardFooter className="pb-8 justify-center border-t border-white/5 pt-6 mt-4">
        <p className="text-sm text-gray-500">
          Already have an account? <button onClick={onToggleView} className="text-primary font-black hover:underline ml-1">Log in</button>
        </p>
      </CardFooter>
    </Card>
  )
}

export default RegisterForm