"use client"

import { useDeferredValue, useState } from "react"
import { Bot, Cloud, FileText, Route, Search } from "lucide-react"

import { ProviderCard } from "@/components/providers/provider-card"
import { Input } from "@/components/ui/input"
import { useProviderCatalog } from "@/hooks/use-provider-catalog"
import { buildExternalDocsUrl } from "@/lib/docs"
import {
  LLM_PROVIDERS,
  LLM_PROVIDER_CATEGORIES,
  type ProviderCategoryId,
} from "@/lib/llm-providers"

const CATEGORY_ICONS = {
  api: Bot,
  gateway: Route,
  platform: Cloud,
  specialized: Search,
} satisfies Record<
  ProviderCategoryId,
  React.ComponentType<{ className?: string }>
>

export function ProvidersPage() {
  const [query, setQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<
    ProviderCategoryId | "all"
  >("all")
  const deferredQuery = useDeferredValue(query)
  const normalizedQuery = deferredQuery.trim().toLowerCase()

  const {
    connections,
    saveConnection,
    removeConnection,
  } = useProviderCatalog()

  const filteredProviders = LLM_PROVIDERS.filter((provider) => {
    if (selectedCategory !== "all" && provider.category !== selectedCategory) {
      return false
    }

    if (!normalizedQuery) {
      return true
    }

    const haystack = [
      provider.title,
      provider.description,
      provider.category,
      ...provider.tags,
    ]
      .join(" ")
      .toLowerCase()

    return haystack.includes(normalizedQuery)
  }).sort((left, right) => left.title.localeCompare(right.title))

  const groupedProviders = LLM_PROVIDER_CATEGORIES.map((category) => ({
    ...category,
    items: filteredProviders.filter((provider) => provider.category === category.id),
  })).filter((category) => category.items.length > 0)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 rounded-3xl border bg-card p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search providers, tags, or categories"
            className="h-11 rounded-2xl pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-3 py-1.5 text-sm transition ${
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "border bg-background hover:bg-muted"
            }`}
          >
            All
          </button>
          {LLM_PROVIDER_CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.id]

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "border bg-background hover:bg-muted"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {category.label}
              </button>
            )
          })}
        </div>
        <div className="flex justify-end">
          <a
            href={buildExternalDocsUrl(["providers"])}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            <FileText className="h-4 w-4" />
            Read docs
          </a>
        </div>
      </div>

      {groupedProviders.length === 0 ? (
        <div className="rounded-3xl border border-dashed p-10 text-center">
          <h2 className="text-xl font-semibold">No providers match this filter</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different search term or switch the category filter.
          </p>
        </div>
      ) : (
        groupedProviders.map((category) => {
          const Icon = CATEGORY_ICONS[category.id]

          return (
            <section key={category.id} className="space-y-4">
              <div className="flex items-start justify-between gap-4 border-b pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-muted">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h2 className="text-xl font-semibold">{category.label}</h2>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {category.items.length}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                {category.items.map((provider) => (
                  <ProviderCard
                    key={provider.slug}
                    provider={provider}
                    connection={connections[provider.slug]}
                    onSave={saveConnection}
                    onDisconnect={removeConnection}
                  />
                ))}
              </div>
            </section>
          )
        })
      )}
    </div>
  )
}
