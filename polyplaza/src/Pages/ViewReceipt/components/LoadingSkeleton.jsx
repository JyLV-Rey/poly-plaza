export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex justify-center items-center">
      <div className="bg-white rounded-3xl shadow-sm p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    </div>
  )
}
