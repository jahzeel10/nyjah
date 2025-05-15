import React, { useState, useEffect } from 'react';

const PrivateQuestions = () => {
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
    
    const updatedAnswers = answers.filter(a => a.questionId !== id);
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
        <h2 className="text-xl font-bold text-purple-700 mb-2">Preguntas Personales</h2>
        <div className="flex mb-4">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Escribe una pregunta personal..."
            className="flex-1 p-2 rounded-l-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
          <button
            onClick={addQuestion}
            className="bg-purple-400 text-white px-4 rounded-r-lg hover:bg-purple-500 transition-colors"
          >
            Agregar
          </button>
        </div>
        
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="bg-pink-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-purple-700">{question.text}</p>
                  <p className="text-xs text-gray-500">{question.date}</p>
                </div>
                <button
                  onClick={() => deleteQuestion(question.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              </div>
              
              {answers.filter(a => a.questionId === question.id).map((answer) => (
                <div key={answer.id} className="mt-2 ml-4 bg-white p-2 rounded">
                  <p className="text-gray-800">{answer.text}</p>
                  <p className="text-xs text-gray-500">{answer.date}</p>
                </div>
              ))}
              
              {!showAnswerForm && (
                <button
                  onClick={() => showAnswerInput(question.id)}
                  className="mt-2 text-sm text-blue-500 hover:text-blue-700"
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
                    className="w-full p-2 border border-purple-300 rounded-lg mb-2"
                    rows="2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={submitAnswer}
                      className="bg-green-400 text-white px-3 py-1 rounded-lg hover:bg-green-500 transition-colors"
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
      
      <div>
        <h2 className="text-xl font-bold text-purple-700 mb-2">Confesiones</h2>
        <div className="bg-pink-50 p-4 rounded-lg">
          <p className="text-gray-700">Esta es tu área privada para confesiones. Todo lo que escribas aquí solo será visible en modo privado.</p>
          <textarea
            className="w-full mt-2 p-2 border border-purple-300 rounded-lg"
            rows="4"
            placeholder="Escribe tus confesiones aquí..."
          />
          <button className="mt-2 bg-purple-400 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors">
            Guardar Confesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivateQuestions;