export function LandingFooter() {
  return (
    <footer className="border-t border-neutral-200 py-12 text-center text-sm text-neutral-400 dark:border-neutral-900 dark:text-neutral-500">
      <p className="mb-4">
        Superclaw - The power of OpenClaw, simplified for everyone.
      </p>
      <div className="flex justify-center gap-6">
        <a
          href="#"
          className="transition-colors hover:text-neutral-900 dark:hover:text-white"
        >
          Twitter
        </a>
        <a
          href="#"
          className="transition-colors hover:text-neutral-900 dark:hover:text-white"
        >
          GitHub
        </a>
        <a
          href="#"
          className="transition-colors hover:text-neutral-900 dark:hover:text-white"
        >
          Discord
        </a>
      </div>
    </footer>
  )
}

