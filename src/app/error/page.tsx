export default function AuthErrorPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Erreur d'authentification</h1>
      <p className="text-gray-600 mb-8">
        Une erreur s'est produite lors de votre tentative de connexion. Veuillez vérifier vos identifiants ou réessayer plus tard.
      </p>
      <a 
        href="/login" 
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Retour à la connexion
      </a>
    </div>
  );
}
