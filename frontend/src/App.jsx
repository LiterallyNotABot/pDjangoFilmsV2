import React from 'react';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import WelcomeCard from './components/WelcomeCard';
import LandingPage from './components/LandingPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className='bg-red-500'>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <WelcomeCard />
    </>


  )


}

export default App


{/*
import React from 'react';
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Search } from "lucide-react";
import { motion } from 'framer-motion';

export default function ElegantLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 font-sans">
      <header className="flex items-center justify-between px-8 py-4 shadow-md bg-white">
        <div className="text-2xl font-bold text-purple-600">DJANGOFILMS</div>
        <div className="flex space-x-4">
          <Button variant="outline">Sign In</Button>
          <Button>Create Account</Button>
          <Button variant="ghost">Films</Button>
          <Button variant="ghost">Lists</Button>
          <Button variant="ghost">Members</Button>
        </div>
        <div className="relative">
          <Input placeholder="Search..." className="pl-10" />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </header>

      <main className="p-10">
        <motion.div 
          className="flex justify-center items-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Card className="w-full max-w-3xl bg-white shadow-xl rounded-2xl">
            <CardContent className="text-center p-10">
              <div className="mb-4 text-lg font-medium">Si ergo illa tantum fastidium compesce contra naturalem usum</div>
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">Join now</Button>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-5 gap-6 mb-12">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="aspect-square bg-white rounded-xl shadow-md"></Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Popular reviews this week</h2>
            {[1, 2].map((id) => (
              <Card key={id} className="mb-4 p-4 bg-white rounded-xl shadow">
                <div className="flex items-center mb-2">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4" />
                  <div>
                    <div className="font-bold">{id === 1 ? "John Doe" : "Ana Banana"}</div>
                    <div className="text-sm text-gray-500">★★★★☆</div>
                  </div>
                </div>
                <p className="text-sm">Opus igitur est dicere possit dura omni specie, “Tu autem in specie, non videntur...”</p>
                <div className="text-xs text-gray-400 mt-2">{id === 1 ? "343 Likes" : "2401 Likes"}</div>
              </Card>
            ))}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Popular lists</h2>
            {["Ad Hoc Wireframing Films", "Random List"].map((title, i) => (
              <Card key={i} className="mb-4 p-4 bg-white rounded-xl shadow">
                <div className="font-semibold mb-2">{title}</div>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="aspect-square bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="text-xs text-gray-500">{i === 0 ? "99K ❤️ 3.2K" : "3K ❤️ 682"}</div>
              </Card>
            ))}
          </section>
        </div>
      </main>

      <footer className="bg-white p-6 mt-10 text-center text-sm text-gray-500">
        <div className="flex justify-center space-x-6">
          <span>About</span>
          <span>Contact</span>
          <span>
            <i className="fab fa-instagram"></i>
          </span>
        </div>
      </footer>
    </div>
  );
}
*/}