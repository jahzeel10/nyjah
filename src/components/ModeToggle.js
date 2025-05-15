import React, { useState } from 'react';

const ModeToggle = ({ isPrivate, togglePrivateMode }) => {
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');

  const handleToggle = () => {
    if (!isPrivate) {
      setShowPinInput(true);
    } else {
      togglePrivateMode();
    }
  };

  const handleSubmitPin = () => {
    if (pin === '1078') {
      togglePrivateMode();
      setShowPinInput(false);
      setPin('');
    } else {
      alert('PIN incorrecto');
    }
  };

  return (
    <div className="fixed top-4 right-4 z-10">
      {showPinInput ? (
        <div className="bg-white p-3 rounded-lg shadow-lg">
          <p className="text-sm mb-2">Ingresa el PIN (1078)</p>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full p-1 border border-purple-300 rounded mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmitPin}
              className="bg-purple-500 text-white px-2 py-1 rounded text-sm"
            >
              Confirmar
            </button>
            <button
              onClick={() => setShowPinInput(false)}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleToggle}
          className={`px-3 py-1 rounded-full shadow ${isPrivate ? 'bg-pink-500 text-white' : 'bg-white text-purple-700'}`}
        >
          {isPrivate ? 'Modo Privado 🔒' : 'Modo Normal 🔓'}
        </button>
      )}
    </div>
  );
};

export default ModeToggle;