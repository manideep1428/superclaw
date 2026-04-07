"use client"

import React, { useRef } from "react"
import { motion, useScroll } from "framer-motion"
import { LandingHeader } from "@/components/landing-header"
import { LandingFooter } from "@/components/landing-footer"
import {
  Layers,
  MousePointerClick,
  UserCircle,
  Settings2,
  Rocket,
  PlugZap,
  ArrowRight,
  Github,
  CheckCircle2,
  Copy,
  Zap,
  Eye,
} from "lucide-react"

const TWEETS = [
  {
    name: "jonahships_",
    handle: "@jonahships_",
    avatar:
      "https://ui-avatars.com/api/?name=jonahships_&background=FF4D4D&color=fff&size=88",
    content:
      "Setup @openclaw yesterday. All I have to say is, wow. First I was using my Claude Max sub and I used all of my limit quickly, so today I had my claw bot setup a proxy to route my CoPilot subscription as an API endpoint... The future is already here.",
  },
  {
    name: "AryehDubois",
    handle: "@AryehDubois",
    avatar:
      "https://ui-avatars.com/api/?name=AryehDubois&background=FF4D4D&color=fff&size=88",
    content:
      "Tried Claw. I tried to build my own AI assistant bots before, and I am very impressed how many hard things Claw gets right. Persistent memory, persona onboarding, comms integration, heartbeats. The end result is AWESOME.",
  },
  {
    name: "danpeguine",
    handle: "@danpeguine",
    avatar:
      "https://ui-avatars.com/api/?name=danpeguine&background=FF4D4D&color=fff&size=88",
    content:
      "Why @openclaw is nuts: your context and skills live on YOUR computer, not a walled garden. It's open source. Proactive AF: cron jobs, reminders, background tasks. Memory is amazing, context persists 24/7.",
  },
  {
    name: "nateliason",
    handle: "@nateliason",
    avatar:
      "https://ui-avatars.com/api/?name=nateliason&background=FF4D4D&color=fff&size=88",
    content:
      "Yeah this was 1,000% worth it. Managing Claude Code / Codex sessions I can kick off anywhere, autonomously running tests on my app and capturing errors through a sentry webhook then resolving them... The future is here.",
  },
  {
    name: "nathanclark_",
    handle: "@nathanclark_",
    avatar:
      "https://ui-avatars.com/api/?name=nathanclark_&background=FF4D4D&color=fff&size=88",
    content:
      "A smart model with eyes and hands at a desk with keyboard and mouse. You message it like a coworker and it does everything a person could do with that Mac mini. That's what you have now.",
  },
  {
    name: "davemorin",
    handle: "@davemorin",
    avatar:
      "https://ui-avatars.com/api/?name=davemorin&background=FF4D4D&color=fff&size=88",
    content:
      "At this point I don't even know what to call @openclaw. It is something new. After a few weeks in with it, this is the first time I have felt like I am living in the future since the launch of ChatGPT.",
  },
  {
    name: "lycfyi",
    handle: "@lycfyi",
    avatar:
      "https://ui-avatars.com/api/?name=lycfyi&background=FF4D4D&color=fff&size=88",
    content:
      "After years of AI hype, I thought nothing could faze me. Then I installed @openclaw. From nervous 'hi what can you do?' to full throttle - design, code review, taxes, PM, content pipelines... The endgame of digital employees is here.",
  },
  {
    name: "rovensky",
    handle: "@rovensky",
    avatar:
      "https://ui-avatars.com/api/?name=rovensky&background=FF4D4D&color=fff&size=88",
    content:
      "It will actually be the thing that nukes a ton of startups, not ChatGPT as people meme about. The fact that it's hackable and hostable on-prem will make sure tech like this DOMINATES conventional SaaS imo",
  },
]

const FEATURES = [
  {
    title: "Profile-Based Management",
    description:
      "Create profiles to group extensions together. Social, Productivity, DevOps - organize however you want and deploy in one click.",
    icon: UserCircle,
  },
  {
    title: "One-Click Extensions",
    description:
      "Browse the extension marketplace, enable anything with a single click. No manual installs, no dependency headaches.",
    icon: MousePointerClick,
  },
  {
    title: "Visual Configuration",
    description:
      "Configure every extension through simple forms. No JSON editing, no YAML files, no config syntax to memorize.",
    icon: Settings2,
  },
  {
    title: "Instant Deploy",
    description:
      "Hit deploy and your entire profile goes live. All extensions, all configs - running in seconds.",
    icon: Rocket,
  },
  {
    title: "Build & Publish Extensions",
    description:
      "Developers can build extensions using defined rules and publish them publicly or keep them private.",
    icon: PlugZap,
  },
  {
    title: "Clone & Remix Profiles",
    description:
      "Found a great profile? Clone it, tweak it, make it yours. Share your setups with the community.",
    icon: Copy,
  },
]

const COMPARISON = [
  { feature: "Setup", openclaw: "CLI", superclaw: "Website" },
  {
    feature: "Configuration",
    openclaw: "JSON files",
    superclaw: "Visual forms",
  },
  { feature: "Extensions", openclaw: "Manual install", superclaw: "One click" },
  { feature: "Usage", openclaw: "Complex", superclaw: "Simple" },
]

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  return (
    <div
      className="min-h-screen bg-white font-sans text-neutral-900 transition-colors duration-300 selection:bg-red-500/30 dark:bg-neutral-950 dark:text-neutral-50"
      ref={containerRef}
    >
      <LandingHeader />

      {/* HERO SECTION */}
      <section className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pt-36 pb-20 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute top-1/3 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-[120px] dark:bg-red-500/20" />
        <div className="pointer-events-none absolute top-1/4 left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-orange-400/10 blur-[100px] dark:bg-orange-400/10" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
            Built on OpenClaw - Beta Now Available
          </div>

          <h1 className="mb-8 text-5xl font-extrabold tracking-tight md:text-7xl">
            Superclaw -{" "}
            <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
              OpenClaw, simplified
            </span>
            .
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-neutral-500 md:text-2xl dark:text-neutral-400">
            Use all OpenClaw-style extensions without CLI or complex setup.
            Create profiles, connect extensions, and deploy - everything works
            from the browser.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/dashboard"
              className="flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-4 text-lg font-bold text-white shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] transition-all hover:scale-105 hover:bg-neutral-800 active:scale-95 dark:bg-white dark:text-black dark:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] dark:hover:bg-neutral-200"
            >
              Get Started Free
            </a>
            <a
              href="https://github.com/openclaw/openclaw"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100 px-8 py-4 text-lg font-bold text-neutral-900 transition-all hover:scale-105 hover:bg-neutral-200 active:scale-95 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
            >
              <Github className="h-5 w-5" /> View on GitHub
            </a>
          </div>

          {/* How It Works Steps */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-5">
            {[
              { step: "1", label: "Sign Up" },
              { step: "2", label: "Create Profile" },
              { step: "3", label: "Add Extensions" },
              { step: "4", label: "Configure" },
              { step: "5", label: "Deploy" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + idx * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-sm font-bold text-red-500">
                  {item.step}
                </div>
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section
        id="features"
        className="relative z-10 border-y border-neutral-200 bg-neutral-50/80 py-24 dark:border-neutral-800 dark:bg-neutral-900/50"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              Everything Visual, Nothing Manual
            </h2>
            <p className="text-lg text-neutral-500 dark:text-neutral-400">
              Profiles, extensions, and deployments - managed through a clean web
              interface.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm transition-colors hover:border-red-500/30 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none dark:hover:bg-neutral-800/80"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-xl font-bold text-red-500 transition-transform group-hover:scale-110">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                <p className="leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON SECTION */}
      <section id="compare" className="relative z-10 py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              Superclaw vs OpenClaw
            </h2>
            <p className="text-lg text-neutral-500 dark:text-neutral-400">
              Same power, radically simpler experience.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-2xl"
          >
            <div className="grid grid-cols-3 border-b border-neutral-200 px-6 py-4 text-sm font-bold tracking-wider text-neutral-400 uppercase dark:border-neutral-800 dark:text-neutral-500">
              <span>Feature</span>
              <span className="text-center">OpenClaw</span>
              <span className="text-center text-red-500">Superclaw</span>
            </div>
            {COMPARISON.map((row, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-3 px-6 py-5 text-sm ${idx !== COMPARISON.length - 1 ? "border-b border-neutral-100 dark:border-neutral-800/50" : ""} transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/30`}
              >
                <span className="font-medium text-neutral-700 dark:text-neutral-200">
                  {row.feature}
                </span>
                <span className="text-center text-neutral-400 dark:text-neutral-500">
                  {row.openclaw}
                </span>
                <span className="flex items-center justify-center gap-1.5 text-center font-semibold text-red-500 dark:text-red-400">
                  <CheckCircle2 className="h-4 w-4" /> {row.superclaw}
                </span>
              </div>
            ))}
          </motion.div>

          <div className="mt-8 grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
            {[
              {
                icon: Eye,
                label: "No CLI Needed",
                desc: "Everything is visual",
              },
              { icon: Zap, label: "Built in Rust", desc: "Lightweight & fast" },
              {
                icon: Layers,
                label: "Profile System",
                desc: "Group & manage easily",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/50"
              >
                <item.icon className="mx-auto mb-2 h-5 w-5 text-red-500" />
                <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100">
                  {item.label}
                </p>
                <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS / TWEETS CAROUSEL */}
      <section id="testimonials" className="relative overflow-hidden py-32">
        <div className="mx-auto mb-16 max-w-7xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">
            What People Say
          </h2>
          <p className="text-lg text-neutral-500 dark:text-neutral-400">
            Don't just take our word for it. Join thousands giving up their
            legacy SaaS.
          </p>
        </div>

        {/* Infinite Carousel */}
        <div className="relative flex w-full overflow-x-hidden">
          {/* Fading Edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-white to-transparent dark:from-neutral-950" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-white to-transparent dark:from-neutral-950" />

          <motion.div
            className="flex w-max gap-6 pr-6"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 40,
            }}
          >
            {[...TWEETS, ...TWEETS].map((tweet, idx) => (
              <div
                key={idx}
                className="flex w-[400px] shrink-0 flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none dark:hover:border-neutral-700"
              >
                <div className="mb-4 flex items-center gap-4">
                  <img
                    src={tweet.avatar}
                    alt={tweet.name}
                    className="h-12 w-12 rounded-full ring-2 ring-neutral-200 dark:ring-neutral-800"
                  />
                  <div>
                    <h4 className="font-bold text-neutral-800 dark:text-neutral-100">
                      {tweet.name}
                    </h4>
                    <p className="text-sm text-neutral-400 dark:text-neutral-500">
                      {tweet.handle}
                    </p>
                  </div>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  &quot;{tweet.content}&quot;
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative border-t border-neutral-200 py-32 dark:border-neutral-900">
        <div className="absolute top-0 left-1/2 h-px w-full max-w-4xl -translate-x-1/2 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-8 text-4xl font-bold md:text-6xl">
            Ready to simplify OpenClaw?
          </h2>
          <p className="mb-10 text-xl text-neutral-500 dark:text-neutral-400">
            Superclaw takes the power of OpenClaw and makes it simple, fast, and
            easy to use - all through a clean web interface.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-neutral-800 dark:bg-white dark:text-black dark:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] dark:hover:bg-neutral-200"
          >
            Start Building Profiles <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}

