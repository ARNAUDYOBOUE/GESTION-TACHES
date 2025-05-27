import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Bienvenue sur <span className="text-blue-600">Ma Todo List</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Organisez vos tâches, restez productif et atteignez vos objectifs facilement.<br />
          Créez un compte ou connectez-vous pour commencer à gérer vos tâches au quotidien.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            S'inscrire
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 rounded-md border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition"
          >
            Se connecter
          </Link>
        </div>
        <div className="mt-8 text-gray-400 text-sm">
          © {new Date().getFullYear()} Ma Todo List. Tous droits réservés.
        </div>
      </div>
    </div>
  );
}