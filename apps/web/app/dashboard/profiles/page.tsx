import { FileText } from "lucide-react"
import { buildExternalDocsUrl } from "@/lib/docs"

export default function DashboardProfilesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex justify-end">
        <a
          href={buildExternalDocsUrl(["dashboard", "profiles"])}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition hover:bg-muted"
        >
          <FileText className="h-4 w-4" />
          Read docs
        </a>
      </div>

      <div className="rounded-3xl border border-dashed p-6 text-sm text-muted-foreground">
        No profiles have been created in the web UI yet.
      </div>
    </div>
  )
}
