import { Loader2, Car } from "lucide-react"

export default function CarsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="bg-blue-100 p-3 rounded-full inline-flex items-center justify-center mb-4">
          <Car className="h-8 w-8 text-blue-600" />
        </div>
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Loading available cars...</h2>
        <p className="text-gray-500 mt-2">Please wait while we fetch the latest car listings</p>
      </div>
    </div>
  )
}
