"use client"

import { MockYoutube } from "@/components/checkmate/mock-youtube"
import { SidePanel } from "@/components/checkmate/side-panel"
import { FloatingButton } from "@/components/checkmate/floating-button"
import { WarningPopup } from "@/components/checkmate/warning-popup"

export default function Page() {
  return (
    <div className="relative min-h-screen">
      {/* Mock YouTube Background */}
      <MockYoutube />

      {/* Checkmate Extension Components */}
      <SidePanel />
      <WarningPopup />
    </div>
  )
}
