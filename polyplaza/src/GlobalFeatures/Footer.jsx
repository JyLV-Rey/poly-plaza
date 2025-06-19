function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Logo */}
          <div>
            <img src="/logo.png" alt="PolyPlaza" className="h-10 w-auto mx-auto" />
          </div>

          {/* Description */}
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            Your trusted marketplace for quality products from verified sellers worldwide.
          </p>

          {/* Copyright */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-500">© 2024 PolyPlaza. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
