"use client"
import React, { useState } from 'react';
import { Search } from 'lucide-react';

// Sample data for anime figures
const figures = [
  {
    id: 1,
    name: "Sailor Moon Crystal Figure",
    price: 129.99,
    image: "/api/placeholder/200/300",
    description: "Beautiful 1/7 scale figure of Sailor Moon from the Crystal series. Features detailed sculpting and comes with a decorative base.",
    series: "Sailor Moon Crystal",
    manufacturer: "Good Smile Company",
    height: "24cm"
  },
  {
    id: 2,
    name: "Rem Premium Figure",
    price: 159.99,
    image: "/api/placeholder/200/300",
    description: "High-quality Rem figure from Re:Zero. Showcases her maid outfit with incredible detail and includes removable accessories.",
    series: "Re:Zero",
    manufacturer: "Kotobukiya",
    height: "25cm"
  },
  {
    id: 3,
    name: "Miku Hatsune Nendoroid",
    price: 49.99,
    image: "/api/placeholder/200/300",
    description: "Adorable Nendoroid of the virtual idol Miku Hatsune. Comes with multiple face plates and accessories.",
    series: "Vocaloid",
    manufacturer: "Good Smile Company",
    height: "10cm"
  },
  {
    id: 4,
    name: "Goku Ultra Instinct",
    price: 199.99,
    image: "/api/placeholder/200/300",
    description: "Dynamic figure of Goku in Ultra Instinct form. Features LED effects and detailed musculature.",
    series: "Dragon Ball Super",
    manufacturer: "Bandai",
    height: "30cm"
  }
];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFigure, setSelectedFigure] = useState(null);

  // Filter figures based on search term
  const filteredFigures = figures.filter(figure =>
    figure.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle figure selection
  const handleFigureClick = (figure) => {
    setSelectedFigure(figure);
  };

  // Handle back button
  const handleBack = () => {
    setSelectedFigure(null);
  };

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <header className="bg-pink-200 p-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-pink-800 mb-4">Kawaii Figure Shop 𐙚🧸ྀི</h1>
          {!selectedFigure && (
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
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {selectedFigure ? (
          // Figure Detail View
          <div className="bg-white rounded-lg shadow-lg p-6">
            <button
              onClick={handleBack}
              className="mb-4 text-pink-600 hover:text-pink-800"
            >
              ← Back to all figures
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <img
                src={selectedFigure.image}
                alt={selectedFigure.name}
                className="w-full rounded-lg shadow-md"
              />
              <div>
                <h2 className="text-2xl font-bold text-pink-800 mb-4">{selectedFigure.name}</h2>
                <p className="text-xl font-bold text-pink-600 mb-4">${selectedFigure.price}</p>
                <p className="text-gray-700 mb-4">{selectedFigure.description}</p>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Series:</strong> {selectedFigure.series}</p>
                  <p><strong>Manufacturer:</strong> {selectedFigure.manufacturer}</p>
                  <p><strong>Height:</strong> {selectedFigure.height}</p>
                </div>
                <button className="mt-6 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFigures.map(figure => (
              <div
                key={figure.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform cursor-pointer"
                onClick={() => handleFigureClick(figure)}
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
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;