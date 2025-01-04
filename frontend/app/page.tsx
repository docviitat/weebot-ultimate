"use client"
import Chat from "@/components/Chat";
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { figures } from '@/app/data/figures';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFigures = figures.filter(figure =>
    figure.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Chat />
      <div className="min-h-screen bg-pink-50">
        <header className="bg-pink-200 p-6 shadow-md">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-pink-800 mb-4">Kawaii Figure Shop 𐙚🧸ྀི</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search figures..."
                className="w-full p-3 rounded-lg border-2 border-pink-300 focus:outline-none focus:border-pink-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-3 text-pink-400" />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFigures.map(figure => (
              <Link
                key={figure.id}
                href={`/figura/${figure.id}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform cursor-pointer"
              >
                <img
                  src={figure.image}
                  alt={figure.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-pink-800 mb-2">{figure.name}</h3>
                  <p className="text-pink-600 font-bold">${figure.price}</p>
                  <button className="mt-3 w-full bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors">
                    Purchase
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
