// src/pages/LandingPage.jsx
function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          DjangoFilms
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-8">
          Descubre, guarda y comparte tus películas favoritas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition">
            Explorar películas
          </button>
          <button className="border border-gray-500 text-gray-300 px-6 py-3 rounded-lg text-lg hover:bg-gray-800 transition">
            Iniciar sesión
          </button>
        </div>
      </div>
      <div className="mt-12 w-full max-w-4xl">
        <img
          src="https://images.unsplash.com/photo-1601933470928-c9b20b2dbcd4?auto=format&fit=crop&w=1200&q=80"
          alt="Cine"
          className="rounded-2xl shadow-xl w-full object-cover max-h-[400px]"
        />
      </div>
    </div>
  );
}

export default LandingPage;
