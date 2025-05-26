"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Left */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} SecurePaste. All rights reserved.
        </div>

        {/* Center Navigation Links */}
        <div className="flex space-x-6">
          <Link
            href="/"
            className="hover:underline text-gray-600 dark:text-gray-300 text-sm"
          >
            CodeRadiant
          </Link>
          <a
            href="https://github.com/techenthusiastic/securepaste/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-gray-600 dark:text-gray-300 text-sm"
          >
            GitHub
          </a>
        </div>

        {/* Right */}
        <div className="text-sm text-gray-400">
          Built by{" "}
          <Link
            href="https://www.linkedin.com/in/sachin-kumar-1abc/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative border-b-2 border-transparent hover:border-white hover:pb-1 transition-all duration-300 font-medium text-blue-600 dark:text-blue-400"
          >
            Sachin Kumar
          </Link>
        </div>
      </div>
    </footer>
  );
}
