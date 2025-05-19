export default function Footer() {
  return (
    <footer className="bg-black text-green-500 border-t border-zinc-800 py-6 mt-auto w-full">
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm">
        <span>© {new Date().getFullYear()} DjangoFilms</span>
        <a href="/about" className="text-green-400 hover:text-green-300 underline">About</a>
        <a href="/terms" className="text-green-400 hover:text-green-300 underline">Our terms</a>
        <a href="/privacy" className="text-green-400 hover:text-green-300 underline">Privacy</a>
      </div>
    </footer>
  );
}
