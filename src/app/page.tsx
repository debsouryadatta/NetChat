'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Globe, MessageSquare, Menu, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Component() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [url, setUrl] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push(`/${url}`)
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      {/* Sidebar for larger screens */}
      <aside className="hidden w-64 border-r border-gray-800 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={toggleSidebar}></div>
          <aside className="fixed inset-y-0 left-0 w-64 border-r border-gray-800 bg-gray-900 z-30 lg:hidden">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center border-b border-gray-800 px-4 lg:hidden">
          <Button variant="ghost" size="icon" className="mr-2 text-gray-300 hover:text-white" onClick={toggleSidebar}>
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <h1 className="font-semibold">NetChat</h1>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 mt-32">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Chat with Any Website</h1>
              <p className="mx-auto max-w-[600px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Enter a website URL below to start chatting with its content.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-2">
              <div className="w-full max-w-lg">
                <Input 
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  placeholder="Paste a website URL here"
                  type="url"
                />
              </div>
              <Button className="w-full max-w-lg bg-blue-600 hover:bg-blue-700 text-white">
                Start Chat
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

function SidebarContent() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b border-gray-800 px-4">
        <Link className="flex items-center gap-2 font-semibold" href="#">
          <Globe className="h-6 w-6" />
          <span>NetChat</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 text-lg font-semibold tracking-tight">Recent Chats</h2>
          {/* <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
              <MessageSquare className="mr-2 h-4 w-4" />
              example.com
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
              <MessageSquare className="mr-2 h-4 w-4" />
              another-site.org
            </Button>
          </div> */}
        </div>
      </nav>
    </div>
  )
}