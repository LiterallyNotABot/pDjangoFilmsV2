// src/components/WelcomeCard.jsx
function WelcomeCard() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">¡Bienvenido a tu App React + Tailwind!</h1>
        <p className="text-gray-600">
          Tailwind está funcionando correctamente. ✨
        </p>
      </div>
    </div>
  );
}

export default WelcomeCard;
