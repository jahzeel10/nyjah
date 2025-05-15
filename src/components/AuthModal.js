import React, { useState } from 'react';

const AuthModal = ({ onLogin, onPrivateAccess }) => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar nombres de usuario permitidos
    if (username !== 'Jazheel' && username !== 'Nicole') {
      alert('Nombre de usuario inválido.'); // Mensaje de error simplificado
      return;
    }

    if (isPrivate && pin !== '1078') {
      alert('PIN incorrecto');
      return;
    }
    onLogin(username, isPrivate);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">Bienvenido a AmorApp</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Tu nombre</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-purple-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="mr-2"
              />
              <span>Acceso privado</span>
            </label>
          </div>
          {isPrivate && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">PIN</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full p-2 border border-purple-300 rounded-lg"
                required
                placeholder="Ingresa el PIN"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;