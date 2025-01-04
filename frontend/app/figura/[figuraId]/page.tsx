"use client"
import React, { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { figures } from '@/app/data/figures';
import Chat from '@/components/Chat';

interface FigureParams {
    params: Promise<{
        figuraId: string;
    }>
}

export default function FiguraPage({ params }: FigureParams) {
    const { figuraId } = use(params);
    const figure = figures.find(fig => fig.id === parseInt(figuraId));

    if (!figure) {
        notFound();
    }

    return (
        <>
            <Chat />

            <div className="min-h-screen bg-pink-50">
                <header className="bg-pink-200 p-6 shadow-md">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-pink-800">Kawaii Figure Shop 𐙚🧸ྀི</h1>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto p-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <Link
                            href="/"
                            className="inline-block mb-4 text-pink-600 hover:text-pink-800"
                        >
                            ← Back to all figures
                        </Link>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <img
                                src={figure.image}
                                alt={figure.name}
                                className="w-full rounded-lg shadow-md"
                            />
                            <div>
                                <h2 className="text-2xl font-bold text-pink-800 mb-4">{figure.name}</h2>
                                <p className="text-xl font-bold text-pink-600 mb-4">${figure.price}</p>
                                <p className="text-gray-700 mb-4">{figure.description}</p>
                                <div className="space-y-2 text-gray-600">
                                    <p><strong>Series:</strong> {figure.series}</p>
                                    <p><strong>Manufacturer:</strong> {figure.manufacturer}</p>
                                    <p><strong>Height:</strong> {figure.height}</p>
                                </div>
                                <button className="mt-6 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}