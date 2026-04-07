"use client"

import { useAuth } from "@workos-inc/authkit-nextjs/components"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sun, Moon, Menu, X } from "lucide-react"

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="h-9 w-9" />

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/20 active:scale-95 dark:border-white/15 dark:bg-white/10 dark:hover:bg-white/20"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4 text-amber-300" />
      ) : (
        <Moon className="h-4 w-4 text-neutral-700" />
      )}
    </button>
  )
}

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, loading } = useAuth()

  const ctaHref = user ? "/dashboard" : "/signup"
  const ctaLabel = user ? "Go to Dashboard" : "Get Started"

  return (
    <nav className="liquid-glass-nav fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 overflow-hidden rounded-2xl transition-all duration-500">
      {/* Refraction highlight */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-2xl">
        <div className="nav-highlight-line absolute top-0 right-0 left-0 h-px bg-linear-to-r from-transparent via-white/80 to-transparent" />
        <div className="nav-highlight-orb absolute -top-[40%] -left-[20%] h-[200%] w-[60%] rounded-full bg-linear-to-br from-white/30 to-transparent blur-2xl" />
      </div>

      <div className="relative z-10 flex h-16 items-center justify-between px-5">
        {/* Logo */}
        <a href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/logo-light.png"
            alt="Superclaw"
            width={140}
            height={40}
            className="h-9 w-auto rounded-lg dark:brightness-100 dark:contrast-110"
            priority
          />
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-1 md:flex">
          <a
            href="#features"
            className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-600 transition-all duration-200 hover:bg-white/40 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            Features
          </a>
          <a
            href="#compare"
            className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-600 transition-all duration-200 hover:bg-white/40 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            Compare
          </a>
          <a
            href="#testimonials"
            className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-600 transition-all duration-200 hover:bg-white/40 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            Testimonials
          </a>
        </div>

        {/* Right Side Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {loading ? (
            <div className="h-11 w-40 animate-pulse rounded-xl border border-white/20 bg-white/15 dark:border-white/10 dark:bg-white/5" />
          ) : (
            <Link
              href={ctaHref}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-200 hover:scale-105 hover:from-red-600 hover:to-orange-600 hover:shadow-red-500/30 active:scale-95"
            >
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 transition-all hover:bg-white/20"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex flex-col gap-1 px-5 pb-4 md:hidden"
        >
          <a
            href="#features"
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-600 transition-all hover:bg-white/30 dark:text-neutral-300 dark:hover:bg-white/10"
          >
            Features
          </a>
          <a
            href="#compare"
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-600 transition-all hover:bg-white/30 dark:text-neutral-300 dark:hover:bg-white/10"
          >
            Compare
          </a>
          <a
            href="#testimonials"
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-600 transition-all hover:bg-white/30 dark:text-neutral-300 dark:hover:bg-white/10"
          >
            Testimonials
          </a>
          {loading ? (
            <div className="mt-1 h-10 animate-pulse rounded-xl border border-white/20 bg-white/15 dark:border-white/10 dark:bg-white/5" />
          ) : (
            <Link
              href={ctaHref}
              onClick={() => setMobileMenuOpen(false)}
              className="mt-1 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              {ctaLabel}
            </Link>
          )}
        </motion.div>
      )}
    </nav>
  )
}

