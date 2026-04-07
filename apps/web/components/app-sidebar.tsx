"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { UserNav } from "@/components/user-nav"
import { PUBLIC_DOCS_BASE_URL } from "@/lib/docs"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  RiBookOpenLine,
  RiCommandLine,
  RiCropLine,
  RiFolderUserLine,
  RiLifebuoyLine,
  RiRobotLine,
  RiTerminalBoxLine,
} from "@remixicon/react"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <RiTerminalBoxLine />
      ),
    },
    {
      title: "LLM Providers",
      url: "/dashboard/llm-setup",
      icon: (
        <RiRobotLine />
      ),
    },
    {
      title: "Profiles",
      url: "/dashboard/profiles",
      icon: (
        <RiFolderUserLine />
      ),
    },
    {
      title: "Extensions",
      url: "/dashboard/extensions",
      icon: (
        <RiCropLine />
      ),
    },
  ],
  navSecondary: [
    {
      title: "Documentation",
      url: PUBLIC_DOCS_BASE_URL,
      external: true,
      icon: (
        <RiBookOpenLine />
      ),
    },
    {
      title: "Support",
      url: "/support",
      icon: (
        <RiLifebuoyLine />
      ),
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="/dashboard" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <RiCommandLine className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Superclaw</span>
                <span className="truncate text-xs">AI Gateway</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <UserNav />
      </SidebarFooter>
    </Sidebar>
  )
}

