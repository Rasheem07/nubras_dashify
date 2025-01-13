import { Ghost } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <div className="mt-24 mx-auto max-w-lg flex flex-col items-center gap-4 px-4">
      {/* Icon */}
      <Ghost className="h-24 w-24 text-teal-600 animate-pulse" />
      
      {/* Main Heading */}
      <h1 className="text-3xl font-semibold text-gray-800 ">
        Oops! Page Not Found.
      </h1>
      
      {/* Description */}
      <p className="text-lg text-gray-600  text-center">
        We couldn&apos;t find the page you were looking for. 
        But don&apos;t worry, you can easily go back to the <span className="font-medium text-teal-500">Home Page</span>.
      </p>

      {/* Go Home Button */}
        <Link href={'/'} className="px-6 py-3 text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
          Go to Home
        </Link>
    </div>
  )
}
