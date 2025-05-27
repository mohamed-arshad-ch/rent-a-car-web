import { Loader2 } from "lucide-react"
import AdminHeader from "@/components/admin/header"

export default function Loading() {
  return (
    <>
      <AdminHeader title="User Management" />
      <main className="flex-1 overflow-auto pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Loading users...</h3>
            <p className="text-gray-500">Please wait while we fetch the user data.</p>
          </div>
        </div>
      </main>
    </>
  )
}
