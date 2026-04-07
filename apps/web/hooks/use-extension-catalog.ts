"use client"

import { useEffect, useState } from "react"

import { EXTENSIONS } from "@/lib/extensions"

const CONNECTIONS_STORAGE_KEY = "superclaw.extensions.connections.v1"
const PREFERENCES_STORAGE_KEY = "superclaw.extensions.preferences.v1"

export interface StoredExtensionConnection {
  slug: string
  connectionLabel: string
  config: Record<string, string | boolean>
  connectedAt: string
  updatedAt: string
}

export interface ExtensionPreferences {
  openDocsInNewTab: boolean
}

export interface SaveExtensionConnectionInput {
  slug: string
  connectionLabel: string
  config: Record<string, string | boolean>
}

const DEFAULT_PREFERENCES: ExtensionPreferences = {
  openDocsInNewTab: true,
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function parseConnections(rawValue: string | null) {
  if (!rawValue) {
    return {} as Record<string, StoredExtensionConnection>
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown

    if (!isRecord(parsed)) {
      return {} as Record<string, StoredExtensionConnection>
    }

    const nextConnections: Record<string, StoredExtensionConnection> = {}

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
    return {} as Record<string, StoredExtensionConnection>
  }
}

function parsePreferences(rawValue: string | null): ExtensionPreferences {
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

export function useExtensionCatalog() {
  const [connections, setConnections] = useState<
    Record<string, StoredExtensionConnection>
  >({})
  const [preferences, setPreferences] =
    useState<ExtensionPreferences>(DEFAULT_PREFERENCES)
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

  function saveConnection(input: SaveExtensionConnectionInput) {
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

  function clearAllConnections() {
    setConnections({})
  }

  function updatePreferences(patch: Partial<ExtensionPreferences>) {
    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      ...patch,
    }))
  }

  const configuredExtensions = EXTENSIONS.filter(
    (extension) => connections[extension.slug]
  )

  return {
    isHydrated,
    connections,
    preferences,
    configuredExtensions,
    configuredCount: configuredExtensions.length,
    hasConfiguredExtensions: configuredExtensions.length > 0,
    exportJson: JSON.stringify(
      {
        preferences,
        connections,
      },
      null,
      2
    ),
    getConnection(slug: string) {
      return connections[slug]
    },
    isConfigured(slug: string) {
      return Boolean(connections[slug])
    },
    saveConnection,
    removeConnection,
    clearAllConnections,
    updatePreferences,
  }
}
