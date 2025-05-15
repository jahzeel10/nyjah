import React, { useState } from 'react';

const LoveNav = ({ setCurrentSection }) => {
  const sections = ['Feed', 'Mensajes', 'Dibujos', 'Juegos'];
  
  return (
    <nav className="bg-blue-100 p-2 flex justify-around">
      {sections.map((section) => (
        <button
          key={section}
          onClick={() => setCurrentSection(section)}
          className="px-4 py-2 rounded-lg bg-purple-200 text-purple-800 hover:bg-purple-300 transition-colors"
        >
          {section}
        </button>
      ))}
    </nav>
  );
};

export default LoveNav;