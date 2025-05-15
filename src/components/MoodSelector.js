import React, { useState, useEffect, useRef } from 'react'; // Importar useRef

const moods = [
  { emoji: '😢', name: 'Triste' },
  { emoji: '😴', name: 'Cansado' },
  { emoji: '😍', name: 'Enamorado' },
  { emoji: '🔥', name: 'Hot' },
  { emoji: '😠', name: 'Molesto' },
  { emoji: '😞', name: 'Decepcionado' }
];

const MoodSelector = ({ currentUser, onPublishMoodRef }) => { // Recibe la referencia
  const [currentMood, setCurrentMood] = useState('');
  const [showSelector, setShowSelector] = useState(false);
  const [otherUserMood, setOtherUserMood] = useState(null); // Estado para el estado de ánimo del otro usuario

  const otherUser = currentUser === 'Jazheel' ? 'Nicole' : 'Jazheel';

  useEffect(() => {
    const savedMood = localStorage.getItem(`userMood_${currentUser}`) || '';
    setCurrentMood(savedMood);

    // Simular la obtención del estado de ánimo del otro usuario
    const interval = setInterval(() => {
      const mood = localStorage.getItem(`userMood_${otherUser}`);
      if (mood) {
        const moodObj = moods.find(m => m.name === mood);
        setOtherUserMood({ user: otherUser, mood: moodObj });
      } else {
        setOtherUserMood(null);
      }
    }, 1000); // Actualizar cada segundo

    return () => clearInterval(interval);
  }, [currentUser, otherUser]);


  const handleMoodChange = (mood) => {
    setCurrentMood(mood);
    localStorage.setItem(`userMood_${currentUser}`, mood);
    // No cerrar el selector aquí para permitir publicar
  };

  const handlePublishMood = () => { // Nueva función para publicar el estado
    if (currentMood && onPublishMoodRef && onPublishMoodRef.current) {
      const moodObj = moods.find(m => m.name === currentMood);
      onPublishMoodRef.current(`${currentUser} se siente ${currentMood} ${moodObj?.emoji || ''}`);
      setShowSelector(false); // Cerrar selector después de publicar
    }
  };

  const displayMood = localStorage.getItem(`userMood_${currentUser}`);
  const displayEmoji = moods.find(m => m.name === displayMood)?.emoji || '😊';

  return (
    <div className="fixed top-4 left-4 bg-white p-2 rounded-lg shadow-md flex items-center z-10">
      {/* Tu estado de ánimo */}
      {displayMood ? (
        <button onClick={() => setShowSelector(!showSelector)} className="flex items-center">
          <span className="text-xl mr-2">{displayEmoji}</span>
          <span className="font-medium">{currentUser}: {displayMood}</span>
        </button>
      ) : (
        <button onClick={() => setShowSelector(!showSelector)} className="flex items-center">
           <span className="text-xl mr-2">😊</span>
           <span className="font-medium">{currentUser}: ¿Cómo te sientes?</span>
        </button>
      )}

      {/* Selector de estado de ánimo */}
      {showSelector && (
        <div className="absolute top-full left-0 mt-2 bg-white p-2 rounded-lg shadow-lg flex flex-col space-y-1">
          {moods.map((mood) => (
            <button
              key={mood.name}
              onClick={() => handleMoodChange(mood.name)}
              className="text-left text-sm p-1 rounded hover:bg-gray-100"
              title={mood.name}
            >
              {mood.emoji} {mood.name}
            </button>
          ))}
          {currentMood && ( // Mostrar botón de publicar si hay un estado seleccionado
            <button
              onClick={handlePublishMood}
              className="bg-purple-400 text-white text-sm py-1 rounded hover:bg-purple-500 mt-2"
            >
              Publicar en Feed
            </button>
          )}
        </div>
      )}

      {/* Estado de ánimo del otro usuario */}
      {otherUserMood && (
        <div className="ml-4 p-2 bg-pink-100 rounded-lg text-center">
          <p className="text-sm font-semibold text-pink-700">{otherUserMood.user}</p>
          <p className="text-xl mt-1">{otherUserMood.mood?.emoji || '😊'}</p>
          <p className="text-sm text-gray-600">{otherUserMood.mood?.name || 'Sin estado'}</p>
        </div>
      )}
    </div>
  );
};

export default MoodSelector;