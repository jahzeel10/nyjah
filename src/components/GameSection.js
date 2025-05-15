import React, { useState, useEffect } from 'react';

const HeartGame = () => {
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targetPosition, setTargetPosition] = useState({ x: 100, y: 100 });

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    moveTarget();
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const moveTarget = () => {
    if (!gameActive) return;
    const x = Math.random() * 300;
    const y = Math.random() * 200;
    setTargetPosition({ x, y });
  };

  const handleClick = () => {
    if (!gameActive) return;
    setScore(score + 1);
    moveTarget();
  };

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-purple-700">Toca el Corazón</h2>
        <p className="text-gray-600">Toca tantos corazones como puedas en 30 segundos</p>
        <div className="flex justify-center gap-8 my-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Puntuación</p>
            <p className="text-2xl font-bold text-pink-500">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Tiempo</p>
            <p className="text-2xl font-bold text-blue-500">{timeLeft}</p>
          </div>
        </div>
        {!gameActive && (
          <button
            onClick={startGame}
            className="bg-green-400 text-white px-6 py-2 rounded-lg hover:bg-green-500 transition-colors"
          >
            Comenzar Juego
          </button>
        )}
      </div>
      {gameActive && (
        <div 
          className="relative w-full h-64 bg-blue-50 rounded-lg border-2 border-purple-200 overflow-hidden"
          onClick={handleClick}
        >
          <div
            className="absolute w-12 h-12 cursor-pointer transition-all duration-300"
            style={{
              left: `${targetPosition.x}px`,
              top: `${targetPosition.y}px`,
            }}
          >
            <svg viewBox="0 0 24 24" fill={score % 2 === 0 ? '#FF6B6B' : '#FF9FF3'}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const emojis = ['💖', '💘', '💝', '💗', '💓', '💞'];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const pairs = [...emojis, ...emojis];
    const shuffled = pairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, flipped: false }));
    
    setCards(shuffled);
    setFlipped([]);
    setSolved([]);
  };

  const handleClick = (id) => {
    if (disabled || flipped.includes(id) || solved.includes(id)) return;
    
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    
    if (newFlipped.length === 2) {
      setDisabled(true);
      const [first, second] = newFlipped;
      const firstCard = cards.find(card => card.id === first);
      const secondCard = cards.find(card => card.id === second);
      
      if (firstCard.emoji === secondCard.emoji) {
        setSolved([...solved, first, second]);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-purple-700">Juego de Memoria</h2>
        <p className="text-gray-600">Encuentra todas las parejas de emojis</p>
        <button
          onClick={initializeGame}
          className="bg-green-400 text-white px-6 py-2 rounded-lg hover:bg-green-500 transition-colors mt-2"
          >
          Reiniciar Juego
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleClick(card.id)}
            className={`h-16 flex items-center justify-center text-2xl rounded-lg cursor-pointer transition-all duration-300 ${
              flipped.includes(card.id) || solved.includes(card.id)
                ? 'bg-pink-200'
                : 'bg-purple-200'
            }`}
          >
            {flipped.includes(card.id) || solved.includes(card.id) ? card.emoji : '?'}
          </div>
        ))}
      </div>
    </div>
  );
};

const LoveQuiz = ({ currentUser }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [customQuizzes, setCustomQuizzes] = useState({});
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newAnswer, setNewAnswer] = useState(0);
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const [selectedQuizKey, setSelectedQuizKey] = useState(null);

  useEffect(() => {
    const savedQuizzes = JSON.parse(localStorage.getItem('loveCustomQuizzes')) || {};
    setCustomQuizzes(savedQuizzes);
  }, []);

  const handleAnswer = (answerIndex) => {
    const currentQuizQuestions = selectedQuizKey && customQuizzes[selectedQuizKey] ? customQuizzes[selectedQuizKey].questions : defaultQuestions;
    if (answerIndex === currentQuizQuestions[currentQuestion].answer) {
      setScore(score + 1);
    }
    
    if (currentQuestion < currentQuizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedQuizKey(null);
  };

  const addCustomQuestion = () => {
    if (!newQuestionText.trim() || newOptions.some(opt => !opt.trim())) {
      alert('Por favor, completa todos los campos de la pregunta.');
      return;
    }

    const newQ = {
      question: newQuestionText,
      options: newOptions,
      answer: parseInt(newAnswer, 10)
    };

    const userQuizKey = `${currentUser}_quiz`;
    const currentUserQuiz = customQuizzes[userQuizKey] || { author: currentUser, questions: [] };
    currentUserQuiz.questions.push(newQ);

    const updatedQuizzes = { ...customQuizzes, [userQuizKey]: currentUserQuiz };
    setCustomQuizzes(updatedQuizzes);
    localStorage.setItem('loveCustomQuizzes', JSON.stringify(updatedQuizzes));
    
    setNewQuestionText('');
    setNewOptions(['', '', '', '']);
    setNewAnswer(0);
    alert(`Pregunta guardada en tu Quiz (${currentUser})!`);
  };

  const deleteQuestion = (quizKey, questionIndex) => {
    const updatedQuizzes = { ...customQuizzes };
    if (updatedQuizzes[quizKey]) {
      updatedQuizzes[quizKey].questions.splice(questionIndex, 1);
      setCustomQuizzes(updatedQuizzes);
      localStorage.setItem('loveCustomQuizzes', JSON.stringify(updatedQuizzes));
      // Si la pregunta borrada era la actual en el quiz, reiniciar
      if (selectedQuizKey === quizKey && currentQuestion === questionIndex) {
        restartQuiz();
      }
    }
  };

  const deleteQuiz = (quizKey) => {
    const updatedQuizzes = { ...customQuizzes };
    delete updatedQuizzes[quizKey];
    setCustomQuizzes(updatedQuizzes);
    localStorage.setItem('loveCustomQuizzes', JSON.stringify(updatedQuizzes));
    // Si el quiz borrado era el seleccionado, reiniciar
    if (selectedQuizKey === quizKey) {
      restartQuiz();
    }
  };


  const defaultQuestions = [
    {
      question: "¿Cuál es el símbolo universal del amor?",
      options: ["💔", "💖", "💣", "💩"],
      answer: 1
    },
    {
      question: "¿Qué color se asocia tradicionalmente con el amor?",
      options: ["Azul", "Verde", "Rojo", "Amarillo"],
      answer: 2
    },
    {
      question: "¿Qué pareja mítica representa el amor eterno?",
      options: ["Romeo y Julieta", "Bonnie y Clyde", "Mario y Luigi", "Batman y Robin"],
      answer: 0
    }
  ];

  const currentQuizQuestions = selectedQuizKey && customQuizzes[selectedQuizKey] ? customQuizzes[selectedQuizKey].questions : defaultQuestions;

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-purple-700">Quiz de Amor</h2>
        <p className="text-gray-600">Pon a prueba tus conocimientos sobre el amor</p>
      </div>
      
      {!selectedQuizKey && !isCreatingQuiz ? (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="text-lg font-semibold mb-2">Selecciona un Quiz</h3>
          <button
            onClick={() => setSelectedQuizKey('default')}
            className="w-full bg-pink-100 text-purple-800 py-2 rounded-lg mb-2 hover:bg-pink-200"
          >
            Quiz por Defecto
          </button>
          {Object.keys(customQuizzes).map(key => (
            <div key={key} className="flex items-center justify-between bg-blue-100 text-blue-800 py-2 px-4 rounded-lg mb-2">
              <button
                onClick={() => setSelectedQuizKey(key)}
                className="flex-1 text-left hover:underline"
              >
                Quiz de {customQuizzes[key].author} ({customQuizzes[key].questions.length} preguntas)
              </button>
              <button
                onClick={() => deleteQuiz(key)}
                className="text-red-500 hover:text-red-700 text-sm ml-2"
                >
                Eliminar
              </button>
            </div>
          ))}
          <button
            onClick={() => setIsCreatingQuiz(true)}
            className="w-full bg-green-400 text-white py-2 rounded-lg hover:bg-green-500 transition-colors mt-2"
          >
            Crear mi propio Quiz
          </button>
        </div>
      ) : selectedQuizKey && !showResult ? (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">{currentQuizQuestions[currentQuestion].question}</h3>
          <div className="grid grid-cols-2 gap-2">
            {currentQuizQuestions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="bg-pink-100 hover:bg-pink-200 text-purple-800 p-3 rounded-lg transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
          {selectedQuizKey !== 'default' && (
            <div className="mt-4 text-center">
              <button
                onClick={() => deleteQuestion(selectedQuizKey, currentQuestion)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Eliminar esta pregunta
              </button>
            </div>
          )}
        </div>
      ) : showResult ? (
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold mb-2">Resultados</h3>
          <p className="text-xl mb-4">Obtuviste {score} de {currentQuizQuestions.length} puntos</p>
          <button
            onClick={restartQuiz}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Volver a jugar
          </button>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Agregar Pregunta a tu Quiz</h3>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Pregunta:</label>
            <input
              type="text"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              className="w-full p-2 border border-purple-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Opciones:</label>
            {newOptions.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={(e) => {
                  const updatedOptions = [...newOptions];
                  updatedOptions[index] = e.target.value;
                  setNewOptions(updatedOptions);
                }}
                className="w-full p-2 border border-purple-300 rounded-lg mb-1"
                placeholder={`Opción ${index + 1}`}
              />
            ))}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Respuesta Correcta (Número de opción 1-4):</label>
            <select
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full p-2 border border-purple-300 rounded-lg"
            >
              <option value={0}>Opción 1</option>
              <option value={1}>Opción 2</option>
              <option value={2}>Opción 3</option>
              <option value={3}>Opción 4</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={addCustomQuestion}
              className="bg-green-400 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-colors"
            >
              Guardar Pregunta
            </button>
            <button
              onClick={() => setIsCreatingQuiz(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Terminar de agregar preguntas
            </button>
          </div>
        </div>
      )}

      {!isCreatingQuiz && !showResult && (
        <div className="text-center mt-4">
          <button
            onClick={() => setIsCreatingQuiz(true)}
            className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
          >
            Crear mi propio Quiz
          </button>
        </div>
      )}
    </div>
  );
};

const PrivateQuestions = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('questions');
  const [showConfessionLock, setShowConfessionLock] = useState(true);

  return (
    <div className="p-4">
      <div className="flex border-b border-pink-200 mb-4">
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 ${activeTab === 'questions' ? 'border-b-2 border-pink-500 text-pink-500' : 'text-gray-500'}`}
        >
          Preguntas
        </button>
        {/* Eliminamos el botón de Confesiones */}
        {/* <button
          onClick={() => setActiveTab('confession')}
          className={`px-4 py-2 ${activeTab === 'confession' ? 'border-b-2 border-pink-500 text-pink-500' : 'text-gray-500'}`}
        >
          Confesiones
        </button> */}
        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2 ${activeTab === 'gallery' ? 'border-b-2 border-pink-500 text-pink-500' : 'text-gray-500'}`}
        >
          Galería
        </button>
      </div>

      {activeTab === 'questions' && <QuestionSection />}
      {/* Eliminamos la sección de Confesiones */}
      {/* {activeTab === 'confession' && (
        <>
          {showConfessionLock && <ConfessionLock onUnlock={() => setShowConfessionLock(false)} />}
          {!showConfessionLock && <ConfessionSection currentUser={currentUser} />}
        </>
      )} */}
      {activeTab === 'gallery' && <PhotoGallery />}
    </div>
  );
};

const QuestionSection = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [answerText, setAnswerText] = useState('');

  useEffect(() => {
    const savedQuestions = JSON.parse(localStorage.getItem('privateQuestions')) || [];
    const savedAnswers = JSON.parse(localStorage.getItem('privateAnswers')) || [];
    setQuestions(savedQuestions);
    setAnswers(savedAnswers);
  }, []);

  const addQuestion = () => {
    if (!newQuestion.trim()) return;
    
    const question = {
      id: Date.now(),
      text: newQuestion,
      date: new Date().toLocaleString()
    };
    
    const updatedQuestions = [...questions, question];
    setQuestions(updatedQuestions);
    localStorage.setItem('privateQuestions', JSON.stringify(updatedQuestions));
    setNewQuestion('');
  };

  const deleteQuestion = (id) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
    localStorage.setItem('privateQuestions', JSON.stringify(updatedQuestions));
    
    const updatedAnswers = answers.filter(a => a.questionId === id);
    setAnswers(updatedAnswers);
    localStorage.setItem('privateAnswers', JSON.stringify(updatedAnswers));
  };

  const showAnswerInput = (questionId) => {
    setCurrentQuestionId(questionId);
    setShowAnswerForm(true);
  };

  const submitAnswer = () => {
    if (!answerText.trim() || !currentQuestionId) return;
    
    const answer = {
      id: Date.now(),
      questionId: currentQuestionId,
      text: answerText,
      date: new Date().toLocaleString()
    };
    
    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);
    localStorage.setItem('privateAnswers', JSON.stringify(updatedAnswers));
    setAnswerText('');
    setShowAnswerForm(false);
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-pink-700 mb-4">Preguntas Personales</h2>
        <div className="flex mb-4">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Escribe una pregunta personal..."
            className="flex-1 p-2 rounded-l-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
          <button
            onClick={addQuestion}
            className="bg-pink-400 text-white px-4 rounded-r-lg hover:bg-pink-500 transition-colors"
          >
            Agregar
          </button>
        </div>
        
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="bg-pink-50 p-4 rounded-lg border border-pink-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-pink-700">{question.text}</p>
                  <p className="text-xs text-pink-500">{question.date}</p>
                </div>
                <button
                  onClick={() => deleteQuestion(question.id)}
                  className="text-pink-500 hover:text-pink-700 text-sm"
                >
                  Eliminar
                </button>
              </div>
              
              {answers.filter(a => a.questionId === question.id).map((answer) => (
                <div key={answer.id} className="mt-2 ml-4 bg-white p-2 rounded border border-pink-100">
                  <p className="text-gray-800">{answer.text}</p>
                  <p className="text-xs text-pink-500">{answer.date}</p>
                </div>
              ))}
              
              {!showAnswerForm && (
                <button
                  onClick={() => showAnswerInput(question.id)}
                  className="mt-2 text-sm text-pink-600 hover:text-pink-800"
                >
                  Responder
                </button>
              )}
              
              {showAnswerForm && currentQuestionId === question.id && (
                <div className="mt-2">
                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Escribe tu respuesta..."
                    className="w-full p-2 border border-pink-300 rounded-lg mb-2"
                    rows="2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={submitAnswer}
                      className="bg-pink-400 text-white px-3 py-1 rounded-lg hover:bg-pink-500 transition-colors"
                    >
                      Enviar
                    </button>
                    <button
                      onClick={() => setShowAnswerForm(false)}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Eliminamos el componente ConfessionSection
/*
const ConfessionSection = ({ currentUser }) => {
  // ... código de ConfessionSection
};
*/

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [newPhoto, setNewPhoto] = useState(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const savedPhotos = JSON.parse(localStorage.getItem('lovePhotos')) || [];
    setPhotos(savedPhotos);
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const savePhoto = () => {
    if (!newPhoto) return;
    
    const photo = {
      id: Date.now(),
      image: newPhoto,
      rating: rating,
      date: new Date().toLocaleString()
    };
    
    const updatedPhotos = [...photos, photo];
    setPhotos(updatedPhotos);
    localStorage.setItem('lovePhotos', JSON.stringify(updatedPhotos));
    setNewPhoto(null);
    setRating(0);
  };

  const ratePhoto = (id, newRating) => {
    const updatedPhotos = photos.map(photo => 
      photo.id === id ? {...photo, rating: newRating} : photo
    );
    setPhotos(updatedPhotos);
    localStorage.setItem('lovePhotos', JSON.stringify(updatedPhotos));
  };

  const deletePhoto = (id) => {
    const updatedPhotos = photos.filter(photo => photo.id !== id);
    setPhotos(updatedPhotos);
    localStorage.setItem('lovePhotos', JSON.stringify(updatedPhotos));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-pink-700 mb-4">Galería de Fotos</h2>
      
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
          id="photo-upload"
        />
        <label
          htmlFor="photo-upload"
          className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-lg mb-2 cursor-pointer hover:bg-blue-200"
        >
          Subir Foto
        </label>
        
        {newPhoto && (
          <div className="mt-4">
            <img src={newPhoto} alt="Nueva foto" className="max-w-full h-auto rounded-lg mb-2"/>
            <div className="flex items-center mb-2">
              <span className="mr-2">Calificación:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
            <button
              onClick={savePhoto}
              className="bg-green-400 text-white px-4 py-2 rounded-lg hover:bg-green-500"
            >
              Guardar Foto
            </button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-white p-2 rounded-lg shadow relative">
            <img src={photo.image} alt="Foto compartida" className="w-full h-auto rounded"/>
            <div className="mt-2 flex justify-between items-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => ratePhoto(photo.id, star)}
                    className={`text-xl ${star <= photo.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <span className="text-xs text-gray-500">{photo.date}</span>
            </div>
            <button
              onClick={() => deletePhoto(photo.id)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Eliminamos el componente ConfessionLock
/*
const ConfessionLock = ({ onUnlock }) => {
  // ... código de ConfessionLock
};
*/


const GameSection = ({ isPrivate, currentUser }) => {
  const [currentGame, setCurrentGame] = useState('heart');

  return (
    <div className="p-4">
      <div className="flex justify-center gap-4 mb-6 overflow-x-auto">
        <button
          onClick={() => setCurrentGame('heart')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap ${currentGame === 'heart' ? 'bg-purple-500 text-white' : 'bg-purple-200 text-purple-800'}`}
        >
          Toca el Corazón
        </button>
        <button
          onClick={() => setCurrentGame('memory')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap ${currentGame === 'memory' ? 'bg-purple-500 text-white' : 'bg-purple-200 text-purple-800'}`}
        >
          Memoria
        </button>
        <button
          onClick={() => setCurrentGame('quiz')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap ${currentGame === 'quiz' ? 'bg-purple-500 text-white' : 'bg-purple-200 text-purple-800'}`}
        >
          Quiz de Amor
        </button>
        {isPrivate && (
          <button
            onClick={() => setCurrentGame('private')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${currentGame === 'private' ? 'bg-pink-500 text-white' : 'bg-pink-200 text-pink-800'}`}
          >
            Sección Privada
          </button>
        )}
      </div>
      
      {currentGame === 'heart' && <HeartGame />}
      {currentGame === 'memory' && <MemoryGame />}
      {currentGame === 'quiz' && <LoveQuiz currentUser={currentUser} />}
      {currentGame === 'private' && <PrivateQuestions currentUser={currentUser} />}
    </div>
  );
};

export default GameSection;

// DONE