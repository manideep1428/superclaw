"use client"

import {
  FileText,
  MoreHorizontal,
  Play,
  Power,
  Settings2,
  Trash2,
  UserRound,
  Wifi,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { buildExternalDocsUrl } from "@/lib/docs"

const RUNNING_CLAWS = [
  {
    id: "claw-alpha",
    name: "Support Claw",
    profile: "Customer Ops",
    status: "Idle",
  },
  {
    id: "claw-beta",
    name: "Sales Claw",
    profile: "Outbound",
    status: "Connected",
  },
  {
    id: "claw-gamma",
    name: "Research Claw",
    profile: "Analyst",
    status: "Starting",
  },
] as const

export function DashboardClient() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-6">
      <div className="rounded-[2rem] border bg-card p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">Running Claws</p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Live claw runtime dashboard
            </h1>
            <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
              Monitor active claws, attach profiles, and connect runtime sessions
              from one place.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-end">
              <a
                href={buildExternalDocsUrl(["dashboard", "running-claws"])}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition hover:bg-muted"
              >
                <FileText className="h-4 w-4" />
                Read docs
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border bg-background px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Total
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {RUNNING_CLAWS.length}
                </p>
              </div>
              <div className="rounded-3xl border bg-background px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Connected
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {
                    RUNNING_CLAWS.filter((claw) => claw.status === "Connected")
                      .length
                  }
                </p>
              </div>
              <div className="rounded-3xl border bg-background px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Profiles
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {new Set(RUNNING_CLAWS.map((claw) => claw.profile)).size}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {RUNNING_CLAWS.map((claw) => (
          <div
            key={claw.id}
            className="flex h-full flex-col rounded-[2rem] border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Wifi className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">{claw.name}</h2>
                  <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                    <UserRound className="h-3.5 w-3.5" />
                    Profile: {claw.profile}
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger
                  className="rounded-full border p-2 text-muted-foreground outline-none transition hover:bg-muted hover:text-foreground"
                  aria-label={`Open ${claw.name} actions`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem>
                    <Settings2 className="h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Power className="h-4 w-4" />
                    Turn off
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-6 rounded-3xl border bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Runtime state
              </p>
              <p className="mt-2 text-xl font-semibold">{claw.status}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Dummy claw data for the live runtime layout. Replace this list
                with your real claw source later.
              </p>
            </div>

            <div className="mt-auto pt-5">
              <Button className="w-full rounded-2xl">
                <Play className="h-4 w-4" />
                Connect
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
