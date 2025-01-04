"use client"
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Trophy, Tag } from 'lucide-react';

interface Recomendaciones {
  id: number;
  name: string;
  category: string;
  price: string;
}

interface Mensajes {
  rol: string;
  contenido: string;
  fecha: string;
  url?: string; 
}


const ChatbotFiguras = () => {
  const [estaAbierto, setEstaAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [mensajeEntrada, setMensajeEntrada] = useState('');
  const [estaCargando, setEstaCargando] = useState(false);
  const [idUsuario] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const finMensajesRef = useRef(null);

  // Mensaje de bienvenida cuando se abre el chat
  useEffect(() => {
    if (estaAbierto && mensajes.length === 0) {
      setMensajes([{
        contenido: `¡Hola! 👋 Soy tu asistente de figuras coleccionables. 

Puedo ayudarte a encontrar la figura perfecta para tu colección. Pregúntame sobre:

🎎 Nendoroids y Figmas
🏆 Figuras a escala y estatuas
🆕 Últimos lanzamientos y pre-órdenes
🏭 Diferentes fabricantes y sus especialidades
🎌 Figuras de anime, manga o videojuegos específicos

¿Qué tipo de figuras te interesan?

Ingresa cualquier texto para ver las recomendaciones y si ingresas la palabra "catálogo"
podrás ver algunas de nuestras figuras disponibles en orden de popularidad. 👩‍❤️‍👩`,
        rol: 'asistente',
        fecha: new Date().toISOString()
      }]);
    }
  }, [estaAbierto]);

  const scrollAlFinal = () => {
    finMensajesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollAlFinal();
  }, [mensajes]);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!mensajeEntrada.trim()) return;

    const mensajeUsuario = {
      contenido: mensajeEntrada,
      rol: 'usuario',
      fecha: new Date().toISOString()
    };

    setMensajes(prev => [...prev, mensajeUsuario]);
    setMensajeEntrada('');
    setEstaCargando(true);

    try {
      const respuesta = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: mensajeEntrada,
          userId: idUsuario
        }),
      });

      const datos = await respuesta.json();

      if (datos.status === 'success') {
        
        setRecomendaciones(datos.recommendations.slice(0, 2) || []);
        
        console.log(datos)

        const mensajeBot = {
          contenido: datos.content,
          rol: 'asistente',
          fecha: new Date().toISOString(),
          url: ''
        };

        if (datos.mentioned_products && datos.mentioned_products.length > 0) {
          const product = datos.mentioned_products[0];
          const productUrl = `/figura/${product.id}`;
          mensajeBot.contenido += `\n\n🔍 Puedes ver más detalles de la figura aquí: ${window.location.origin}${productUrl}`;
          mensajeBot.url = productUrl;
        }

        setMensajes(prev => [...prev, mensajeBot]);
      } else {
        throw new Error(datos.error);
      }
    } catch (error) {
      const mensajeError = {
        contenido: `Lo siento, tuve problemas procesando tu mensaje. ERROR: ${error} ¿Podrías intentarlo de nuevo?`,
        rol: 'error',
        fecha: new Date().toISOString()
      };
      setMensajes(prev => [...prev, mensajeError]);
    } finally {
      setEstaCargando(false);
    }
  };

  const formatearHora = (fecha: string) => {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`
        fixed bottom-24 right-4 w-96 h-[600px]
        bg-white rounded-2xl shadow-xl flex flex-col
        transform transition-all duration-300 ease-in-out
        ${estaAbierto ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
      `}>


        {/* Encabezado */}
        <div className="bg-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Trophy size={24} />
            <div>
              <h2 className="font-semibold">W33bo</h2>
            </div>
          </div>
          <button 
            onClick={() => setEstaAbierto(false)}
            className="hover:bg-purple-700 p-1 rounded-full transition-colors"
            aria-label="Cerrar chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Área de Mensajes */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {mensajes.map((mensaje: Mensajes, index) => (
            <div
              key={index}
              className={`flex ${mensaje.rol === 'usuario' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  mensaje.rol === 'usuario'
                    ? 'bg-purple-500 text-white rounded-br-none'
                    : mensaje.rol === 'error'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-white text-gray-800 shadow-md rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{mensaje.contenido}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {formatearHora(mensaje.fecha)}
                </span>
              </div>
            </div>
          ))}
          {estaCargando && (
            <div className="flex justify-start">
              <div className="bg-gray-200 rounded-lg p-4 max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={finMensajesRef} />
        </div>

        {recomendaciones.length > 0 && (
          <div className="p-4 bg-purple-50 border-t">
            <div className="flex items-center gap-2 mb-2">
              <Tag size={16} className="text-purple-600" />
              <h3 className="text-sm font-semibold text-purple-900">Recomendados</h3>
            </div>
            <div className="space-y-2">
              {recomendaciones.map((rec: Recomendaciones) => (
                <div key={rec.id} className="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{rec.name}</span>
                    <span className="text-xs text-gray-500">{rec.category}</span>
                  </div>
                  <span className="text-sm font-semibold text-purple-600">${rec.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Formulario de Entrada */}
        <form onSubmit={manejarEnvio} className="p-4 bg-white border-t rounded-b-2xl">
          <div className="flex space-x-2">
            <input
              type="text"
              value={mensajeEntrada}
              onChange={(e) => setMensajeEntrada(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              disabled={estaCargando}
            />
            <button
              type="submit"
              disabled={estaCargando || !mensajeEntrada.trim()}
              className="bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600 
                disabled:bg-purple-300 transition-colors duration-200"
              aria-label="Enviar mensaje"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* Botón de Apertura */}
      <button
        onClick={() => setEstaAbierto(!estaAbierto)}
        className={`
          p-4 rounded-full shadow-lg
          transition-all duration-300 ease-in-out
          ${estaAbierto
            ? 'bg-purple-600 hover:bg-purple-700 rotate-180'
            : 'bg-purple-500 hover:bg-purple-600'
          }
        `}
        aria-label={estaAbierto ? 'Cerrar chat' : 'Abrir chat'}
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default ChatbotFiguras;