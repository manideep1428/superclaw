import { redirect } from "next/navigation"

import { resolveServerDocsUrl } from "@/lib/docs"

export default async function DocsRedirectPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const resolvedParams = await params

  redirect(resolveServerDocsUrl(resolvedParams.slug || []))
}
