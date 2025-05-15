import React, { useState, useEffect } from 'react';

const moods = [
  { emoji: '😢', name: 'Triste' },
  { emoji: '😴', name: 'Cansado' },
  { emoji: '😍', name: 'Enamorado' },
  { emoji: '🔥', name: 'Hot' },
  { emoji: '😠', name: 'Molesto' },
  { emoji: '😞', name: 'Decepcionado' }
];

const FeedSidebar = ({ currentUser, onPublishPost }) => { // Recibe la función para publicar post
  // Eliminamos el estado otherUserMood
  // const [otherUserMood, setOtherUserMood] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [nextDates, setNextDates] = useState([]); // Múltiples citas
  const [newNextDate, setNewNextDate] = useState('');
  const [favoriteSongs, setFavoriteSongs] = useState([]); // Múltiples canciones
  const [newFavoriteSong, setNewFavoriteSong] = useState('');
  const [location, setLocation] = useState(''); // Estado para la ubicación

  const [otherUserProfile, setOtherUserProfile] = useState(null); // Estado para el perfil del otro usuario

  const otherUser = currentUser === 'Jazheel' ? 'Nicole' : 'Jazheel';

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem(`userNotes_${currentUser}`)) || [];
    setNotes(savedNotes);

    const savedProfilePhoto = localStorage.getItem(`profilePhoto_${currentUser}`);
    setProfilePhoto(savedProfilePhoto);

    const savedNextDates = JSON.parse(localStorage.getItem(`nextDates_${currentUser}`)) || []; // Cargar múltiples citas
    setNextDates(savedNextDates);

    const savedFavoriteSongs = JSON.parse(localStorage.getItem(`favoriteSongs_${currentUser}`)) || []; // Cargar múltiples canciones
    setFavoriteSongs(savedFavoriteSongs);

    const savedLocation = localStorage.getItem(`location_${currentUser}`) || ''; // Cargar ubicación
    setLocation(savedLocation);


    // Eliminamos la lógica de sincronización del otro usuario aquí
    /*
    const interval = setInterval(() => {
      const mood = localStorage.getItem(`userMood_${otherUser}`);
      const otherUserSavedDates = JSON.parse(localStorage.getItem(`nextDates_${otherUser}`)) || [];
      const otherUserSavedSongs = JSON.parse(localStorage.getItem(`favoriteSongs_${otherUser}`)) || [];
      const otherUserSavedLocation = localStorage.getItem(`location_${otherUser}`) || '';


      if (mood) {
        const moodObj = moods.find(m => m.name === mood);
        setOtherUserMood({ user: otherUser, mood: moodObj });
      } else {
        setOtherUserMood(null);
      }

      setOtherUserProfile({
        user: otherUser,
        dates: otherUserSavedDates,
        songs: otherUserSavedSongs,
        location: otherUserSavedLocation
      });

    }, 1000); // Actualizar cada segundo

    return () => clearInterval(interval);
    */
  }, [currentUser, otherUser]);

  const addNote = () => {
    if (!newNote.trim()) return;
    const note = {
      id: Date.now(),
      text: newNote,
      date: new Date().toLocaleDateString()
    };
    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    localStorage.setItem(`userNotes_${currentUser}`, JSON.stringify(updatedNotes));
    setNewNote('');
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem(`userNotes_${currentUser}`, JSON.stringify(updatedNotes));
  };

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
        localStorage.setItem(`profilePhoto_${currentUser}`, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addNextDate = () => { // Agregar nueva cita
    if (!newNextDate) return;
    const date = {
      id: Date.now(),
      date: newNextDate
    };
    const updatedDates = [...nextDates, date];
    setNextDates(updatedDates);
    localStorage.setItem(`nextDates_${currentUser}`, JSON.stringify(updatedDates));
    setNewNextDate('');
  };

  const deleteNextDate = (id) => { // Eliminar cita
    const updatedDates = nextDates.filter(date => date.id !== id);
    setNextDates(updatedDates);
    localStorage.setItem(`nextDates_${currentUser}`, JSON.stringify(updatedDates));
  };

  const publishNextDate = (date) => { // Publicar cita en el feed
    if (onPublishPost) {
      onPublishPost({
        id: `date-${date.id}`, // ID único para citas fijas
        author: currentUser,
        text: `¡Próxima cita el ${date.date}! 💖`,
        isFixed: true, // Marcar como fijo
        type: 'date', // Tipo de publicación
        date: new Date().toLocaleString(),
        reactions: {}
      });
    }
  };


  const addFavoriteSong = () => { // Agregar nueva canción
    if (!newFavoriteSong.trim()) return;
    const song = {
      id: Date.now(),
      url: newFavoriteSong
    };
    const updatedSongs = [...favoriteSongs, song];
    setFavoriteSongs(updatedSongs);
    localStorage.setItem(`favoriteSongs_${currentUser}`, JSON.stringify(updatedSongs));
    setNewFavoriteSong('');
  };

  const deleteFavoriteSong = (id) => { // Eliminar canción
    const updatedSongs = favoriteSongs.filter(song => song.id !== id);
    setFavoriteSongs(updatedSongs);
    localStorage.setItem(`favoriteSongs_${currentUser}`, JSON.stringify(updatedSongs));
  };

  const publishFavoriteSong = (song) => { // Publicar canción en el feed
     if (onPublishPost) {
      onPublishPost({
        id: `song-${song.id}`, // ID único para canciones fijas
        author: currentUser,
        text: `¡Nuestra canción favorita! 🎶 ${song.url}`,
        isFixed: true, // Marcar como fijo
        type: 'song', // Tipo de publicación
        date: new Date().toLocaleString(),
        reactions: {}
      });
    }
  };


  const handleLocationChange = (e) => { // Manejar cambio de ubicación
    setLocation(e.target.value);
    localStorage.setItem(`location_${currentUser}`, e.target.value);
  };


  return (
    <div className="w-64 p-4 bg-white rounded-lg shadow-md border border-purple-100 flex-shrink-0">
      {/* User Info */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-purple-200 mx-auto flex items-center justify-center text-3xl mb-2 overflow-hidden">
          {profilePhoto ? (
            <img src={profilePhoto} alt="Foto de perfil" className="w-full h-full object-cover"/>
          ) : (
            currentUser === 'Jazheel' ? '🌸' : '✨'
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePhotoUpload}
          className="hidden"
          id={`profile-photo-upload-${currentUser}`}
        />
        <label htmlFor={`profile-photo-upload-${currentUser}`} className="text-sm text-blue-500 hover:underline cursor-pointer">
          Cambiar foto
        </label>
        <h3 className="text-lg font-bold text-purple-700 mt-2">{currentUser}</h3>
        
        {/* Ubicación */}
        <div className="mt-2">
          <label className="block text-sm text-gray-700 mb-1">Ubicación:</label>
          <input
            type="text"
            value={location}
            onChange={handleLocationChange}
            placeholder="¿Dónde estás?"
            className="w-full p-1 text-sm border border-purple-300 rounded"
          />
        </div>
      </div>

      {/* Eliminamos la sección Other User Profile Info */}
      {/*
      {otherUserProfile && (
        <div className="mb-6 p-3 bg-blue-100 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Estado de {otherUserProfile.user}</h3>
          <div className="text-sm text-gray-700">
            <p className="mb-1">Ubicación: {otherUserProfile.location || 'No especificada'}</p>
            <p className="mb-1">Próximas citas:</p>
            <ul className="ml-2 list-disc list-inside">
              {otherUserProfile.dates.length > 0 ? (
                otherUserProfile.dates.map(date => <li key={date.id}>{date.date}</li>)
              ) : (
                <li>Ninguna</li>
              )}
            </ul>
            <p className="mb-1 mt-2">Canciones favoritas:</p>
             <ul className="ml-2 list-disc list-inside">
              {otherUserProfile.songs.length > 0 ? (
                otherUserProfile.songs.map(song => (
                  <li key={song.id}>
                    <a href={song.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate">{song.url}</a>
                  </li>
                ))
              ) : (
                <li>Ninguna</li>
              )}
            </ul>
          </div>
        </div>
      )}
      */}


      {/* Mini Calendar (Notes) */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-purple-700 mb-2">Notas del Calendario</h3>
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <div className="mb-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Añadir nota..."
              className="w-full p-1 text-sm border border-blue-200 rounded mb-1"
            />
            <button
              onClick={addNote}
              className="w-full bg-blue-400 text-white text-sm py-1 rounded hover:bg-blue-500"
            >
              Guardar Nota
            </button>
          </div>
          <ul className="text-sm text-gray-700 max-h-20 overflow-y-auto">
            {notes.map(note => (
              <li key={note.id} className="flex justify-between items-center border-b border-blue-100 py-1">
                <span>{note.date}: {note.text}</span>
                <button onClick={() => deleteNote(note.id)} className="text-red-500 hover:text-red-700 text-xs ml-2">×</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Additional Info (Your Info) */}
      <div>
        <h3 className="text-lg font-semibold text-purple-700 mb-2">Tu Información Adicional</h3>
        {/* Próxima cita */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Próximas citas:</label>
          <div className="flex gap-2 mb-2">
            <input
              type="date"
              value={newNextDate}
              onChange={(e) => setNewNextDate(e.target.value)}
              className="flex-1 p-1 text-sm border border-purple-300 rounded"
            />
            <button onClick={addNextDate} className="bg-green-400 text-white text-sm px-2 rounded hover:bg-green-500">Agregar</button>
          </div>
          <ul className="text-sm text-gray-700 max-h-20 overflow-y-auto">
            {nextDates.map(date => (
              <li key={date.id} className="flex justify-between items-center border-b border-purple-100 py-1">
                <span>{date.date}</span>
                <button onClick={() => deleteNextDate(date.id)} className="text-red-500 hover:text-red-700 text-xs ml-2">×</button>
                <button onClick={() => publishNextDate(date)} className="text-blue-500 hover:text-blue-700 text-xs ml-2">Publicar</button>
              </li>
            ))}
          </ul>
        </div>
        {/* Canción favorita */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Canciones favoritas (Enlaces YouTube):</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newFavoriteSong}
              onChange={(e) => setNewFavoriteSong(e.target.value)}
              placeholder="Enlace de YouTube"
              className="flex-1 p-1 text-sm border border-purple-300 rounded"
            />
            <button onClick={addFavoriteSong} className="bg-green-400 text-white text-sm px-2 rounded hover:bg-green-500">Agregar</button>
          </div>
          <ul className="text-sm text-gray-700 max-h-20 overflow-y-auto">
            {favoriteSongs.map(song => (
              <li key={song.id} className="flex justify-between items-center border-b border-purple-100 py-1">
                <a href={song.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate">{song.url}</a>
                <button onClick={() => deleteFavoriteSong(song.id)} className="text-red-500 hover:text-red-700 text-xs ml-2">×</button>
                 <button onClick={() => publishFavoriteSong(song)} className="text-blue-500 hover:text-blue-700 text-xs ml-2">Publicar</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeedSidebar;