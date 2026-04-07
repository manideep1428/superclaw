"use client"

import { useEffect, useState } from "react"

import { LLM_PROVIDERS } from "@/lib/llm-providers"

const CONNECTIONS_STORAGE_KEY = "superclaw.providers.connections.v1"
const PREFERENCES_STORAGE_KEY = "superclaw.providers.preferences.v1"

export interface StoredProviderConnection {
  slug: string
  connectionLabel: string
  config: Record<string, string | boolean>
  connectedAt: string
  updatedAt: string
}

export interface ProviderPreferences {
  openDocsInNewTab: boolean
}

export interface SaveProviderConnectionInput {
  slug: string
  connectionLabel: string
  config: Record<string, string | boolean>
}

const DEFAULT_PREFERENCES: ProviderPreferences = {
  openDocsInNewTab: true,
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function parseConnections(rawValue: string | null) {
  if (!rawValue) {
    return {} as Record<string, StoredProviderConnection>
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown

    if (!isRecord(parsed)) {
      return {} as Record<string, StoredProviderConnection>
    }

    const nextConnections: Record<string, StoredProviderConnection> = {}

    for (const [slug, value] of Object.entries(parsed)) {
      if (!isRecord(value)) {
        continue
      }

      nextConnections[slug] = {
        slug,
        connectionLabel:
          typeof value.connectionLabel === "string"
            ? value.connectionLabel
            : slug,
        config: isRecord(value.config)
          ? (Object.fromEntries(
              Object.entries(value.config).filter((entry) => {
                const fieldValue = entry[1]
                return (
                  typeof fieldValue === "string" ||
                  typeof fieldValue === "boolean"
                )
              })
            ) as Record<string, string | boolean>)
          : {},
        connectedAt:
          typeof value.connectedAt === "string"
            ? value.connectedAt
            : new Date().toISOString(),
        updatedAt:
          typeof value.updatedAt === "string"
            ? value.updatedAt
            : new Date().toISOString(),
      }
    }

    return nextConnections
  } catch {
    return {} as Record<string, StoredProviderConnection>
  }
}

function parsePreferences(rawValue: string | null): ProviderPreferences {
  if (!rawValue) {
    return DEFAULT_PREFERENCES
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown

    if (!isRecord(parsed)) {
      return DEFAULT_PREFERENCES
    }

    return {
      openDocsInNewTab:
        typeof parsed.openDocsInNewTab === "boolean"
          ? parsed.openDocsInNewTab
          : DEFAULT_PREFERENCES.openDocsInNewTab,
    }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

export function useProviderCatalog() {
  const [connections, setConnections] = useState<
    Record<string, StoredProviderConnection>
  >({})
  const [preferences, setPreferences] =
    useState<ProviderPreferences>(DEFAULT_PREFERENCES)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setConnections(
      parseConnections(window.localStorage.getItem(CONNECTIONS_STORAGE_KEY))
    )
    setPreferences(
      parsePreferences(window.localStorage.getItem(PREFERENCES_STORAGE_KEY))
    )
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    window.localStorage.setItem(
      CONNECTIONS_STORAGE_KEY,
      JSON.stringify(connections)
    )
  }, [connections, isHydrated])

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    window.localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify(preferences)
    )
  }, [preferences, isHydrated])

  function saveConnection(input: SaveProviderConnectionInput) {
    const now = new Date().toISOString()

    setConnections((currentConnections) => ({
      ...currentConnections,
      [input.slug]: {
        slug: input.slug,
        connectionLabel: input.connectionLabel,
        config: input.config,
        connectedAt: currentConnections[input.slug]?.connectedAt ?? now,
        updatedAt: now,
      },
    }))
  }

  function removeConnection(slug: string) {
    setConnections((currentConnections) => {
      const nextConnections = { ...currentConnections }
      delete nextConnections[slug]
      return nextConnections
    })
  }

  function updatePreferences(patch: Partial<ProviderPreferences>) {
    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      ...patch,
    }))
  }

  const configuredProviders = LLM_PROVIDERS.filter(
    (provider) => connections[provider.slug]
  )

  return {
    isHydrated,
    connections,
    preferences,
    configuredProviders,
    configuredCount: configuredProviders.length,
    hasConfiguredProviders: configuredProviders.length > 0,
    getConnection(slug: string) {
      return connections[slug]
    },
    isConfigured(slug: string) {
      return Boolean(connections[slug])
    },
    saveConnection,
    removeConnection,
    updatePreferences,
  }
}
