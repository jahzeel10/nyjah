import React, { useState } from 'react';

const ConfessionLock = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [showLock, setShowLock] = useState(true);

  const handleUnlock = () => {
    if (pin === '8998') {
      setShowLock(false);
      onUnlock();
    } else {
      alert('PIN incorrecto');
    }
  };

  return showLock ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="text-xl font-bold mb-2">Confesiones Secretas</h3>
        <p className="mb-4">Ingresa el PIN para acceder</p>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="PIN"
        />
        <button
          onClick={handleUnlock}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg w-full hover:bg-pink-600"
        >
          Desbloquear
        </button>
      </div>
    </div>
  ) : null;
};

export default ConfessionLock;