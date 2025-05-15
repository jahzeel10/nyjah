import React, { useState, useEffect, useRef } from 'react'; // Importar useRef
import LoveHeader from './components/LoveHeader';
import LoveNav from './components/LoveNav';
import MessageSection from './components/MessageSection';
import DrawingSection from './components/DrawingSection';
import GameSection from './components/GameSection';
import AuthModal from './components/AuthModal';
import ModeToggle from './components/ModeToggle';
import MoodSelector from './components/MoodSelector';
import FeedSection from './components/FeedSection';

const App = () => {
  const [currentSection, setCurrentSection] = useState('Feed');
  const [currentUser, setCurrentUser] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [showAuth, setShowAuth] = useState(true);

  const publishMoodRef = useRef(null); // Crear una referencia para la función de publicar estado

  const handleLogin = (username, isPrivateMode) => {
    setCurrentUser(username);
    setIsPrivate(isPrivateMode);
    setShowAuth(false);
  };

  const togglePrivateMode = () => {
    setIsPrivate(!isPrivate);
  };

  const renderSection = () => {
    if (!currentUser) return null;
    
    switch (currentSection) {
      case 'Feed':
        return <FeedSection currentUser={currentUser} onPublishMoodRef={publishMoodRef} />; // Pasar la referencia
      case 'Mensajes':
        return <MessageSection currentUser={currentUser} />;
      case 'Dibujos':
        return <DrawingSection currentUser={currentUser} />;
      case 'Juegos':
        return <GameSection isPrivate={isPrivate} currentUser={currentUser} />;
      default:
        return <FeedSection currentUser={currentUser} onPublishMoodRef={publishMoodRef} />; // Pasar la referencia
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50">
      {showAuth && <AuthModal onLogin={handleLogin} />}
      
      {currentUser && (
        <>
          {/* Pasar la referencia a MoodSelector */}
          <MoodSelector currentUser={currentUser} onPublishMoodRef={publishMoodRef} /> 
          <ModeToggle isPrivate={isPrivate} togglePrivateMode={togglePrivateMode} />
          <LoveHeader />
          <LoveNav setCurrentSection={setCurrentSection} />
          <main className="max-w-2xl mx-auto p-4">
            {renderSection()}
          </main>
          <div className="text-center text-sm text-gray-500 mt-4">
            Conectado como: {currentUser} {isPrivate && '(Modo privado)'}
          </div>
        </>
      )}
    </div>
  );
};

export default App;

// DONE