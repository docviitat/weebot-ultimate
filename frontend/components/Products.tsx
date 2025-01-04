"use client"
import React, { useState } from 'react';
import { Search } from 'lucide-react';

// Sample data for anime figures
const figures = [
  {
    id: 101,
    name: "Nendoroid Chainsaw Man Denji",
    price: 54.99,
    image: "https://i.pinimg.com/736x/6c/5a/1b/6c5a1b579e17e8585c895c055a3b0c7c.jpg",
    description: "Detailed Nendoroid of Denji from Chainsaw Man. Includes multiple accessories and face plates.",
    series: "Chainsaw Man",
    manufacturer: "Good Smile Company",
    height: "10cm"
  },
  {
    id: 102,
    name: "Figma Demon Slayer Tanjiro",
    price: 89.99,
    image: "https://i.pinimg.com/736x/7e/53/27/7e5327df138e6b4a7a0bfdbbb9e4d312.jpg",
    description: "Highly articulated Figma figure of Tanjiro Kamado from Demon Slayer. Comes with his Nichirin sword and effect parts.",
    series: "Demon Slayer",
    manufacturer: "Max Factory",
    height: "15cm"
  },
  {
    id: 103,
    name: "Pop Up Parade Vocaloid Miku",
    price: 239.99,
    image: "https://i.pinimg.com/736x/62/c9/b1/62c9b1ace3d687d13854d490296ce06f.jpg",
    description: "Stylish Pop Up Parade Fresh figure of Miku-chan For Your Heart Content.",
    series: "Vocaloid",
    manufacturer: "Saiko Company",
    height: "17cm"
  },
  {
    id: 104,
    name: "Scale Figure Attack on Titan Eren",
    price: 189.99,
    image: "https://i.pinimg.com/736x/6b/74/bb/6b74bbe2c411facd5c9b40fe5de4a32a.jpg",
    description: "Premium scale figure of Eren Yeager from Attack on Titan. Showcases dynamic pose and detailed sculpting.",
    series: "Attack on Titan",
    manufacturer: "Kotobukiya",
    height: "25cm"
  },
  {
    id: 105,
    name: "Nendoroid Final Fantasy Cloud",
    price: 54.99,
    image: "https://i.pinimg.com/736x/65/53/b2/6553b22b8dd3090de9b7852437dc2617.jpg",
    description: "Cute Nendoroid of Cloud Strife from Final Fantasy. Comes with Buster Sword and interchangeable expressions.",
    series: "Final Fantasy",
    manufacturer: "Square Enix",
    height: "10cm"
  },
  {
    id: 106,
    name: "Nendoroid Rem",
    price: 359.99,
    image: "https://i.pinimg.com/736x/95/5b/6d/955b6deeba417df921a8fdbb3aa52fb3.jpg",
    description: "Charming Nendoroid of Rem from Re:Zero, Cause She The Best Girl Ever.",
    series: "Re:Zero",
    manufacturer: "Good Smile Company",
    height: "30cm"
  },
  {
    id: 107,
    name: "Figma Asuna Yuuki",
    price: 89.99,
    image: "https://i.pinimg.com/736x/3e/af/09/3eaf092a9c6b61b4f79269c23f25d091.jpg",
    description: "Articulated Figma figure of Asuna Yuuki from Sword Art Online. Includes weapons and effect parts.",
    series: "Sword Art Online",
    manufacturer: "Max Factory",
    height: "14cm"
  },
  {
    id: 108,
    name: "Scale Figure Mikasa Ackerman",
    price: 199.99,
    image: "https://i.pinimg.com/736x/36/fd/fc/36fdfcc332636a08a2abf049cfa777e2.jpg",
    description: "Dynamic scale figure of Mikasa Ackerman from Attack on Titan. Features her signature dual swords and detailed base.",
    series: "Attack on Titan",
    manufacturer: "Kotobukiya",
    height: "23cm"
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