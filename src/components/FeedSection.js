import React, { useState, useEffect, useRef } from 'react'; // Importar useRef
import FeedSidebar from './FeedSidebar'; // Importar el nuevo sidebar

const FeedSection = ({ currentUser, onPublishMoodRef }) => { // Recibe la referencia
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [stories, setStories] = useState([]);
  const [newStoryImage, setNewStoryImage] = useState(null); // Historias ahora son solo imágenes
  const [showFullImage, setShowFullImage] = useState(null); // Para mostrar imagen completa
  const [activeStory, setActiveStory] = useState(null); // Para mostrar historia completa

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('loveFeedPosts')) || [];
    // Separar posts fijos de los normales
    const fixedPosts = savedPosts.filter(post => post.isFixed);
    const normalPosts = savedPosts.filter(post => !post.isFixed);
    setPosts([...fixedPosts, ...normalPosts]); // Colocar fijos al inicio

    const savedStories = JSON.parse(localStorage.getItem('loveFeedStories')) || [];
    setStories(savedStories);
  }, []);

  const handlePostTextChange = (e) => {
    setNewPostText(e.target.value);
  };

  const handlePostImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPost = (text = newPostText, image = newPostImage, isFixed = false, type = 'normal') => { // Permite agregar post con texto e imagen opcionales, si es fijo y tipo
    // Asegurarse de que text sea una cadena antes de usar trim
    const postText = typeof text === 'string' ? text : ''; 

    if (!postText.trim() && !image) return;

    const newPost = {
      id: Date.now(),
      author: currentUser,
      text: postText, // Usar postText asegurando que es string
      image: image,
      date: new Date().toLocaleString(),
      reactions: {},
      isFixed: isFixed, // Marcar si es fijo
      type: type // Tipo de publicación (normal, date, song)
    };

    const updatedPosts = isFixed ? [newPost, ...posts] : [...posts, newPost]; // Agregar al inicio si es fijo
    setPosts(updatedPosts);
    localStorage.setItem('loveFeedPosts', JSON.stringify(updatedPosts));
    setNewPostText('');
    setNewPostImage(null);
  };

  const deletePost = (id) => {
    const updatedPosts = posts.filter(post => post.id !== id);
    setPosts(updatedPosts);
    localStorage.setItem('loveFeedPosts', JSON.stringify(updatedPosts));
  };

  const addPostReaction = (id, emoji) => {
    const updatedPosts = posts.map(post => {
      if (post.id === id) {
        const newReactions = { ...post.reactions };
        newReactions[emoji] = (newReactions[emoji] || 0) + 1;
        return { ...post, reactions: newReactions };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('loveFeedPosts', JSON.stringify(updatedPosts));
  };

  const handleStoryImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStoryImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addStory = () => {
    if (!newStoryImage) return;

    const newStory = {
      id: Date.now(),
      author: currentUser,
      image: newStoryImage,
      date: new Date().toLocaleString()
    };

    const updatedStories = [newStory, ...stories];
    setStories(updatedStories);
    localStorage.setItem('loveFeedStories', JSON.stringify(updatedStories));
    setNewStoryImage(null);
  };

  const deleteStory = (id) => {
    const updatedStories = stories.filter(story => story.id !== id);
    setStories(updatedStories);
    localStorage.setItem('loveFeedStories', JSON.stringify(updatedStories));
  };

  const viewStory = (story) => {
    setActiveStory(story);
    setTimeout(() => {
      setActiveStory(null);
    }, 7000); // Cerrar historia después de 7 segundos
  };


  const reactionEmojis = ['👍', '❤️', '😂', '😢', '🔥'];

  // Asignar la función addPost a la referencia recibida
  useEffect(() => {
    if (onPublishMoodRef) {
      onPublishMoodRef.current = addPost;
    }
  }, [onPublishMoodRef, addPost]);


  return (
    <div className="flex"> {/* Contenedor flex para sidebar y contenido */}
      {/* Pasar la función addPost a FeedSidebar */}
      <FeedSidebar currentUser={currentUser} onPublishPost={addPost} /> 

      <div className="flex-1 p-4"> {/* Contenido principal del feed */}
        <h2 className="text-xl font-bold text-purple-700 mb-4">Feed de Amor</h2>

        {/* Stories Section (Circular Images) */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">Historias</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {/* Add Story Button */}
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-purple-200 flex items-center justify-center cursor-pointer hover:bg-purple-300 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleStoryImageUpload}
                className="hidden"
                id="story-image-upload"
              />
              <label htmlFor="story-image-upload" className="text-4xl text-purple-800">+</label>
            </div>
            {/* New Story Preview */}
            {newStoryImage && (
               <div className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden border-2 border-green-400 relative">
                 <img src={newStoryImage} alt="Nueva historia" className="w-full h-full object-cover"/>
                 <button onClick={addStory} className="absolute bottom-0 left-0 right-0 bg-green-400 text-white text-xs text-center">Guardar</button>
               </div>
            )}
            {/* Existing Stories */}
            {stories.map(story => (
              <div key={story.id} className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden border-2 border-pink-400 relative group cursor-pointer" onClick={() => viewStory(story)}>
                <img src={story.image} alt={`Historia de ${story.author}`} className="w-full h-full object-cover"/>
                {/* Botón de eliminar que aparece al pasar el mouse */}
                <button
                  onClick={(e) => { e.stopPropagation(); deleteStory(story.id); }} // Evitar que el clic en eliminar abra la historia
                  className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Create Post Section (Twitter Style) */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 border border-purple-100">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">Crear Publicación</h3>
          <textarea
            value={newPostText}
            onChange={handlePostTextChange}
            placeholder="¿Qué estás pensando?"
            className="w-full p-2 border border-purple-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
            rows="3"
          />
          <div className="flex items-center justify-between">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePostImageUpload}
                className="hidden"
                id="post-image-upload"
              />
              <label
                htmlFor="post-image-upload"
                className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-lg mr-2 cursor-pointer hover:bg-blue-200 text-sm"
              >
                Subir Foto
              </label>
              {newPostImage && (
                <span className="text-sm text-green-600">Foto lista!</span>
              )}
            </div>
            <button
              onClick={() => addPost()} // Llama a addPost sin argumentos para usar los estados locales
              className="bg-purple-400 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors text-sm"
            >
              Publicar
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className={`bg-white p-4 rounded-lg shadow border border-purple-100 relative animate-fadeIn ${post.isFixed ? 'border-2 border-pink-500' : ''}`}>
              <div className="flex items-center mb-2">
                 <div className="w-10 h-10 rounded-full bg-purple-200 mr-3 flex items-center justify-center text-xl">
                   {post.author === 'Jazheel' ? '🌸' : '✨'}
                 </div>
                 <div>
                   <p className="font-semibold text-purple-700">{post.author}</p>
                   <p className="text-xs text-gray-500">{post.date}</p>
                 </div>
              </div>
              {post.text && <p className="text-gray-800 mt-1 mb-2">{post.text}</p>}
              {post.image && (
                <img
                  src={post.image}
                  alt="Publicación"
                  className="max-w-full h-auto rounded-lg mb-2 cursor-pointer"
                  onClick={() => setShowFullImage(post.image)}
                />
              )}

              <div className="flex gap-1 mt-2">
                {reactionEmojis.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => addPostReaction(post.id, emoji)}
                    className="text-sm p-1 rounded-full hover:bg-pink-200"
                  >
                    {emoji} {post.reactions && post.reactions[emoji] ? post.reactions[emoji] : ''}
                  </button>
                ))}
              </div>

              <button
                onClick={() => deletePost(post.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Full Image Modal (for Posts) */}
      {showFullImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setShowFullImage(null)}>
          <img src={showFullImage} alt="Imagen completa" className="max-w-full max-h-full"/>
        </div>
      )}

      {/* Full Story Modal */}
      {activeStory && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setActiveStory(null)}>
          <div className="relative w-64 h-96 bg-white rounded-lg overflow-hidden">
            <img src={activeStory.image} alt={`Historia de ${activeStory.author}`} className="w-full h-full object-cover"/>
            <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black to-transparent text-white text-sm">
              <p className="font-semibold">{activeStory.author}</p>
              <p className="text-xs">{activeStory.date}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedSection;

// DONE