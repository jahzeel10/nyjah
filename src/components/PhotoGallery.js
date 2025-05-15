import React, { useState, useEffect } from 'react';

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [newPhoto, setNewPhoto] = useState(null);
  const [rating, setRating] = useState(0);
  const [showFullImage, setShowFullImage] = useState(null); // Para mostrar imagen completa

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
            <img
              src={photo.image}
              alt="Foto compartida"
              className="w-full h-auto rounded cursor-pointer"
              onClick={() => setShowFullImage(photo.image)} // Abrir imagen completa al hacer clic
            />
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

      {/* Full Image Modal (for Gallery) */}
      {showFullImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setShowFullImage(null)}>
          <img src={showFullImage} alt="Imagen completa" className="max-w-full max-h-full"/>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;

// DONE