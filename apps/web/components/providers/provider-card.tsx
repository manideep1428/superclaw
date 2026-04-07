"use client"

import { useState } from "react"
import { ArrowUpRight, Trash2 } from "lucide-react"

import { ProviderConfigModal } from "@/components/providers/provider-config-modal"
import { ProviderIcon } from "@/components/providers/provider-icon"
import { Button } from "@/components/ui/button"
import type {
  SaveProviderConnectionInput,
  StoredProviderConnection,
} from "@/hooks/use-provider-catalog"
import type { ProviderDefinition } from "@/lib/llm-providers"

interface ProviderCardProps {
  provider: ProviderDefinition
  connection?: StoredProviderConnection
  onSave: (input: SaveProviderConnectionInput) => void
  onDisconnect: (slug: string) => void
}

export function ProviderCard({
  provider,
  connection,
  onSave,
  onDisconnect,
}: ProviderCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="flex h-full flex-col rounded-3xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: `${provider.accent}18`,
                color: provider.accent,
              }}
            >
              <ProviderIcon slug={provider.slug} className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{provider.title}</h3>
                <span className="shrink-0 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {provider.category}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {provider.description}
              </p>
            </div>
          </div>
          <span
            className={`shrink-0 whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-medium ${
              connection
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {connection ? "Configured" : "Not configured"}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {provider.tags.map((tag) => (
            <span
              key={tag}
              className="shrink-0 whitespace-nowrap rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {connection ? (
          <div className="mt-4 rounded-2xl border bg-muted/30 p-3 text-sm">
            <p className="font-medium">{connection.connectionLabel}</p>
            <p className="text-xs text-muted-foreground">
              Updated {new Date(connection.updatedAt).toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed p-3 text-sm text-muted-foreground">
            OpenClaw docs are linked and a local provider config can be saved
            now. Gateway wiring can be added later.
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          <Button onClick={() => setIsModalOpen(true)}>
            {connection ? "Configure" : "Connect"}
          </Button>
          <a
            href={provider.docsPath}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-7 items-center gap-1 rounded-md border px-2 text-xs font-medium transition hover:bg-muted"
          >
            Docs
            <ArrowUpRight className="h-3 w-3" />
          </a>
          {connection ? (
            <Button
              variant="ghost"
              onClick={() => onDisconnect(provider.slug)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Disconnect
            </Button>
          ) : null}
        </div>
      </div>

      <ProviderConfigModal
        provider={provider}
        connection={connection}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={(input) =>
          onSave({
            slug: provider.slug,
            connectionLabel: input.connectionLabel,
            config: input.config,
          })
        }
      />
    </>
  )
}
