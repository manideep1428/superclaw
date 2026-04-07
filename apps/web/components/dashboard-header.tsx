"use client"

import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  extensions: "Extensions",
  installed: "Installed",
  settings: "Settings",
  overview: "Overview",
}

function formatSegment(segment: string) {
  const mappedSegment = SEGMENT_LABELS[segment]

  if (mappedSegment) {
    return mappedSegment
  }

  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function DashboardHeader() {
  const pathname = usePathname()
  const dashboardSegments = pathname.split("/").filter(Boolean).slice(1)
  const breadcrumbSegments =
    dashboardSegments.length > 0 ? dashboardSegments : ["overview"]

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-vertical:h-4 data-vertical:self-auto"
      />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbSegments.map((segment, index) => {
            const href = `/dashboard/${breadcrumbSegments
              .slice(0, index + 1)
              .filter((entry) => entry !== "overview")
              .join("/")}`.replace(/\/$/, "")
            const isLast = index === breadcrumbSegments.length - 1
            const label = formatSegment(segment)

            return (
              <BreadcrumbItem key={`${segment}-${index}`}>
                <BreadcrumbSeparator className="hidden md:block" />
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href || "/dashboard"}>
                    {label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
