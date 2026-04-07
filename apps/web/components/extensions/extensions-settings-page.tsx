"use client"

import { Trash2 } from "lucide-react"

import { useExtensionCatalog } from "@/hooks/use-extension-catalog"
import { buildDocsPath, PUBLIC_DOCS_BASE_URL } from "@/lib/docs"

export function ExtensionsSettingsPage() {
  const {
    configuredCount,
    connections,
    exportJson,
    preferences,
    clearAllConnections,
  } = useExtensionCatalog()

  function handleClearAll() {
    if (
      window.confirm(
        "Clear every locally saved extension configuration from this browser?"
      )
    ) {
      clearAllConnections()
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Settings</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Extension frontend settings
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
          These settings only control the frontend prototype. Saved extension
          configs live in browser local storage until backend endpoints are
          added.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Saved locally</p>
          <p className="mt-2 text-3xl font-semibold">{configuredCount}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Configured extensions currently stored in this browser.
          </p>
        </div>
        <div className="rounded-3xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Docs redirect target</p>
          <p className="mt-2 break-all text-sm font-medium">
            {PUBLIC_DOCS_BASE_URL}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Internal links such as <code>{buildDocsPath(["extensions", "discord"])}</code>{" "}
            redirect here.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border bg-card p-5">
        <h2 className="text-lg font-semibold">Docs behavior</h2>
        <div className="mt-4 rounded-2xl border p-4">
          <p className="font-medium">Docs links open in a new tab</p>
          <p className="text-sm text-muted-foreground">
            Extension and provider docs now resolve against the hosted docs URL
            and always open externally.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border bg-card p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Local data actions</h2>
            <p className="text-sm text-muted-foreground">
              Use this if you want to reset the prototype and remove all saved
              extension configs from this device.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-2 rounded-full border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            Clear all local configs
          </button>
        </div>
      </div>

      <div className="rounded-3xl border bg-card p-5">
        <h2 className="text-lg font-semibold">Stored JSON preview</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Useful while the backend does not exist yet. You can inspect exactly
          what the frontend is persisting.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-2xl border bg-muted/30 p-4 text-xs">
          {JSON.stringify(
            {
              preferences,
              configuredSlugs: Object.keys(connections),
              payload: JSON.parse(exportJson),
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  )
}
