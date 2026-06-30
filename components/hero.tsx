'use client'

import React from 'react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="min-h-screen bg-background flex items-center justify-center border-b-2 border-foreground">
      <div className="max-w-5xl mx-auto px-4 py-32 text-center space-y-16">
        {/* Main Headline */}
        <div className="space-y-8 animate-fade-in">
          <h1 className="text-9xl md:text-10xl font-black leading-tight tracking-tighter">
            STAY
          </h1>
          <h2 className="text-6xl md:text-8xl font-light tracking-wide">
            beautiful places
          </h2>
          <p className="text-2xl md:text-3xl font-light max-w-3xl mx-auto leading-relaxed pt-8">
            Find and book the world's best hotels. No frills. Just honest accommodation.
          </p>
        </div>

        {/* CTA Button */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Link href="/hotels">
            <button className="px-12 py-6 bg-foreground text-background text-2xl font-black border-2 border-foreground hover:bg-background hover:text-foreground transition-all duration-300 active:scale-95">
              EXPLORE NOW
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
