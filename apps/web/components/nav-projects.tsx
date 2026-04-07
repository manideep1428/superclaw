"use client"

import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: React.ReactNode
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarMenu>
          <SidebarMenuItem>
            <CollapsibleTrigger
              className="w-full"
              render={
                <SidebarMenuButton
                  tooltip="Running Claws"
                  className="group/collapsible font-medium"
                />
              }
            >
                <ChevronRight className="transition-transform duration-200 group-data-[panel-open]/collapsible:rotate-90" />
                <span>Running Claws</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="data-[ending-style]:overflow-hidden data-[starting-style]:overflow-hidden">
              <SidebarGroupContent>
                {projects.length > 0 ? (
                  <SidebarMenu className="mt-1">
                    {projects.map((item) => {
                      const isActive =
                        pathname === item.url || pathname.startsWith(item.url + "/")

                      return (
                        <SidebarMenuItem key={item.name}>
                          <SidebarMenuButton
                            isActive={isActive}
                            render={<a href={item.url} />}
                            className="pl-8"
                          >
                            {item.icon}
                            <span>{item.name}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                ) : null}
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarMenuItem>
        </SidebarMenu>
      </Collapsible>
    </SidebarGroup>
  )
}
