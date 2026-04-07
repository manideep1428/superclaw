import { Bot, TerminalSquare } from "lucide-react"

const CLAW_LABELS: Record<string, string> = {
  main: "Main Claw",
  work: "Work Claw",
  personal: "Personal Claw",
}

export default async function DashboardAgentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const clawName = CLAW_LABELS[slug] ?? "Running Claw"

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Running Claws</p>
        <h1 className="text-3xl font-semibold tracking-tight">{clawName}</h1>
        <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
          This route is reserved for live claw runtime details once the backend
          claw manager is connected.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Bot className="h-5 w-5" />
          </div>
          <h2 className="mt-4 font-semibold">Runtime status</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No live claw runtime data is connected in the web app yet.
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <TerminalSquare className="h-5 w-5" />
          </div>
          <h2 className="mt-4 font-semibold">Attached profile</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Profile assignment will appear here after the runtime and profile
            flows are wired together.
          </p>
        </div>
      </div>
    </div>
  )
}
