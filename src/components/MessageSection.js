import React, { useState, useEffect } from 'react';

const MessageSection = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem('loveMessages')) || [];
    // Asegurarse de que cada mensaje tenga un objeto reactions al cargar
    const messagesWithReactions = savedMessages.map(msg => ({
      ...msg,
      reactions: msg.reactions || {}
    }));
    setMessages(messagesWithReactions);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim() && !image) return;
    
    const message = {
      id: Date.now(),
      text: newMessage,
      date: new Date().toLocaleString(),
      sender: currentUser,
      image: image,
      reactions: {} // Aseguramos que reactions siempre sea un objeto vacío al crear
    };
    
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem('loveMessages', JSON.stringify(updatedMessages));
    setNewMessage('');
    setImage(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteMessage = (id) => {
    const updatedMessages = messages.filter(msg => msg.id !== id);
    setMessages(updatedMessages);
    localStorage.setItem('loveMessages', JSON.stringify(updatedMessages));
  };

  const addReaction = (id, emoji) => {
    const updatedMessages = messages.map(msg => {
      if (msg.id === id) {
        const newReactions = { ...msg.reactions };
        newReactions[emoji] = (newReactions[emoji] || 0) + 1;
        return { ...msg, reactions: newReactions };
      }
      return msg;
    });
    setMessages(updatedMessages);
    localStorage.setItem('loveMessages', JSON.stringify(updatedMessages));
  };

  const reactionEmojis = ['👍', '❤️', '😂', '😢', '🔥'];

  return (
    <div className="p-4">
      <div className="h-64 overflow-y-auto mb-4 bg-white rounded-lg p-4 shadow-inner">
        {messages.map((msg, index) => (
          <div key={msg.id} className="mb-4 p-3 bg-pink-100 rounded-lg relative">
            <p className="font-semibold text-purple-700">{msg.sender}</p>
            {msg.text && <p className="text-gray-800 mb-2">{msg.text}</p>}
            {msg.image && (
              <img 
                src={msg.image} 
                alt="Mensaje" 
                className="max-w-full h-auto rounded-lg mb-2"
              />
            )}
            <p className="text-xs text-gray-500">{msg.date}</p>
            
            <div className="flex gap-1 mt-2">
              {reactionEmojis.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => addReaction(msg.id, emoji)}
                  className="text-sm p-1 rounded-full hover:bg-pink-200"
                >
                  {emoji} {msg.reactions && msg.reactions[emoji] ? msg.reactions[emoji] : ''}
                </button>
              ))}
            </div>

            <button
              onClick={() => deleteMessage(msg.id)}
              className="absolute top-1 right-1 text-red-500 hover:text-red-700 text-sm"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
      <div className="mb-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <label 
          htmlFor="image-upload"
          className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-lg mr-2 cursor-pointer hover:bg-blue-200"
        >
          Subir foto
        </label>
        {image && (
          <span className="text-sm text-green-600">Foto lista!</span>
        )}
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje de amor..."
          className="flex-1 p-2 rounded-l-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-200"
        />
        <button
          onClick={handleSendMessage}
          className="bg-purple-400 text-white px-4 rounded-r-lg hover:bg-purple-500 transition-colors"
        >
          Enviar 💌
        </button>
      </div>
    </div>
  );
};

export default MessageSection;

// DONE