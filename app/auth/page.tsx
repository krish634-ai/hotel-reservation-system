'use client'

import React, { useState } from "react"
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError("")

  try {
    if (isLogin) {
      // LOGIN
      if (!email || !password) {
        setError("Please fill in all fields")
        return
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Login failed")
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      router.push("/bookings")
    } else {
      // REGISTER
      if (!name || !email || !password) {
        setError("Please fill in all fields")
        return
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Register failed")
        return
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          name,
          email,
        })
      )

      router.push("/bookings")
    }
  } catch (err) {
    console.error(err)
    setError("Something went wrong")
  }
}

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="border-2 border-foreground p-12 bg-background">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-black text-foreground mb-3 uppercase transition-all duration-300">
              {isLogin ? 'Sign In' : 'Join StayHub'}
            </h1>
            <p className="text-lg text-muted-foreground font-light">
              {isLogin ? 'Welcome back to your account' : 'Create a new account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="animate-fade-in">
                <label className="block text-lg font-black text-foreground mb-3 uppercase">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="John Doe"
                  className={`w-full border-2 px-5 py-3 text-lg text-foreground placeholder:text-muted-foreground bg-background transition-all duration-300 focus:outline-none font-light ${
                    focusedField === 'name'
                      ? 'border-foreground'
                      : 'border-foreground'
                  }`}
                />
              </div>
            )}

            <div className={isLogin ? 'animate-fade-in' : ''}>
              <label className="block text-lg font-black text-foreground mb-3 uppercase">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="you@example.com"
                className={`w-full border-2 px-5 py-3 text-lg text-foreground placeholder:text-muted-foreground bg-background transition-all duration-300 focus:outline-none font-light ${
                  focusedField === 'email'
                    ? 'border-foreground'
                    : 'border-foreground'
                }`}
              />
            </div>

            <div>
              <label className="block text-lg font-black text-foreground mb-3 uppercase">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                className={`w-full border-2 px-5 py-3 text-lg text-foreground placeholder:text-muted-foreground bg-background transition-all duration-300 focus:outline-none font-light ${
                  focusedField === 'password'
                    ? 'border-foreground'
                    : 'border-foreground'
                }`}
              />
            </div>

            {error && (
              <div className="border-2 border-foreground text-foreground px-5 py-3 font-black text-sm animate-fade-in bg-secondary">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-foreground text-background px-6 py-4 font-black text-lg hover:bg-background hover:text-foreground transition-all duration-300 border-2 border-foreground mt-8 uppercase"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-12 text-center border-t-2 border-foreground pt-12">
            <p className="text-lg text-muted-foreground mb-4 font-light">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setEmail('')
                setPassword('')
                setName('')
                setFocusedField(null)
              }}
              className="text-lg text-foreground font-black hover:underline transition-all duration-300 uppercase"
            >
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/" className="text-lg text-muted-foreground font-black hover:underline transition-all duration-300 inline-block uppercase">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
