"use client"

import { useEffect } from "react"
import { ArrowUpRight, QrCode, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { StoredExtensionConnection } from "@/hooks/use-extension-catalog"
import type { ExtensionDefinition } from "@/lib/extensions"
import { ExtensionIcon } from "@/components/extensions/extension-icon"

interface ExtensionConfigModalProps {
  extension: ExtensionDefinition
  connection?: StoredExtensionConnection
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (input: {
    connectionLabel: string
    config: Record<string, string | boolean>
  }) => void
}

export function ExtensionConfigModal({
  extension,
  connection,
  open,
  onOpenChange,
  onSave,
}: ExtensionConfigModalProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false)
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [open, onOpenChange])

  if (!open) {
    return null
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const nextConfig: Record<string, string | boolean> = {}

    for (const field of extension.configFields) {
      if (field.type === "toggle") {
        nextConfig[field.key] = formData.get(field.key) === "on"
        continue
      }

      nextConfig[field.key] = String(formData.get(field.key) || "")
    }

    onSave({
      connectionLabel:
        String(formData.get("connectionLabel") || "").trim() || extension.title,
      config: nextConfig,
    })
    onOpenChange(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: `${extension.accent}18`,
                  color: extension.accent,
                }}
              >
                <ExtensionIcon slug={extension.slug} className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold">{extension.title}</h2>
                  <span className="rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {extension.setupMode}
                  </span>
                  {connection ? (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      Configured
                    </span>
                  ) : null}
                </div>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  {extension.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  Frontend-only for now. Saving here stores data in this
                  browser only and does not call any backend yet.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>

        <form
          className="flex flex-1 flex-col overflow-hidden"
          onSubmit={handleSubmit}
        >
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
            <div className="grid gap-3 rounded-2xl border bg-muted/30 p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-sm font-medium">Need setup instructions?</p>
                <p className="text-sm text-muted-foreground">
                  Open the matching documentation page for the credential and
                  webhook steps, then paste the values back here.
                </p>
              </div>
              <a
                href={extension.docsPath}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition hover:bg-background"
              >
                Open docs
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            {extension.setupMode === "qr" ? (
              <div className="rounded-2xl border border-dashed p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">QR flow placeholder</p>
                    <p className="text-sm text-muted-foreground">
                      The live QR session handshake needs backend support. For
                      now you can save a local placeholder session config so the
                      frontend flow is wired end to end.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium">Connection label</span>
                <input
                  name="connectionLabel"
                  defaultValue={connection?.connectionLabel || extension.title}
                  placeholder={extension.title}
                  className="w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                />
                <p className="text-xs text-muted-foreground">
                  Local display name used only inside Superclaw.
                </p>
              </label>

              {extension.configFields.map((field) => {
                const currentValue = connection?.config[field.key]
                const baseClasses =
                  "w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"

                return (
                  <label
                    key={field.key}
                    className={field.type === "textarea" ? "space-y-2 md:col-span-2" : "space-y-2"}
                  >
                    <span className="text-sm font-medium">
                      {field.label}
                      {field.required ? (
                        <span className="ml-1 text-destructive">*</span>
                      ) : null}
                    </span>
                    {field.type === "select" ? (
                      <select
                        name={field.key}
                        defaultValue={String(currentValue ?? field.defaultValue ?? "")}
                        className={baseClasses}
                      >
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        name={field.key}
                        required={field.required}
                        defaultValue={String(currentValue ?? field.defaultValue ?? "")}
                        placeholder={field.placeholder}
                        rows={5}
                        className={`${baseClasses} resize-y`}
                      />
                    ) : field.type === "toggle" ? (
                      <div className="flex items-center justify-between rounded-2xl border bg-background px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">{field.label}</p>
                          {field.helperText ? (
                            <p className="text-xs text-muted-foreground">
                              {field.helperText}
                            </p>
                          ) : null}
                        </div>
                        <input
                          type="checkbox"
                          name={field.key}
                          defaultChecked={Boolean(currentValue ?? field.defaultValue)}
                          className="h-4 w-4 rounded border-border"
                        />
                      </div>
                    ) : (
                      <input
                        type={field.type === "password" ? "password" : field.type}
                        name={field.key}
                        required={field.required}
                        defaultValue={String(currentValue ?? field.defaultValue ?? "")}
                        placeholder={field.placeholder}
                        className={baseClasses}
                      />
                    )}
                    {field.type !== "toggle" && field.helperText ? (
                      <p className="text-xs text-muted-foreground">
                        {field.helperText}
                      </p>
                    ) : null}
                  </label>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t px-6 py-4">
            <p className="text-xs text-muted-foreground">
              {connection
                ? `Last updated ${new Date(connection.updatedAt).toLocaleString()}`
                : "Nothing is sent to the gateway yet."}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {connection ? "Update local config" : "Save local config"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

