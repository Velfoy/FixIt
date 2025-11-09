import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Public Navbar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🔧</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">AutoService</h1>
          </Link>

          <Link
            href="/auth/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Войти
          </Link>
        </div>
      </header>

      {/* Content */}
      {children}

      {/* Footer */}
      <footer className="bg-white mt-20 py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2024 AutoService. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
