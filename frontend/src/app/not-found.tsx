import Link from 'next/link';

// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-lg w-full px-4">
      <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100">
        404
      </h1>
      <p className="text-lg mt-2 text-gray-600 dark:text-gray-300">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go back home
      </Link>
    </div>
  );
}
