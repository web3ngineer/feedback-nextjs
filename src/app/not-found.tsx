import Link from 'next/link'

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="max-w-5xl mt-3 text-3xl sm:text-6xl font-medium text-gray-500 dark:text-gray-400">404</h1>
      </div>
      <h2 className="mt-3 max-w-5xl text-sm sm:text-lg font-medium text-gray-500 dark:text-gray-400">
        We are sorry, page not found!
      </h2>
      <p className="max-w-5xl mt-3 text-sm sm:text-base text-center p-2">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/" className="px-2 mt-4 text-sm bg-white border-2 rounded-full hover:border-purple-800">
        Back to HomePage
      </Link>
    </div>
  )
}
export default NotFound;
