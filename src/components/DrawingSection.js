import React, { useState, useRef, useEffect } from 'react';

const DrawingSection = ({ currentUser }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FF9FF3');
  const [drawings, setDrawings] = useState([]);
  const [isErasing, setIsErasing] = useState(false);
  const colors = ['#FF9FF3', '#FECA57', '#FF6B6B', '#48DBFB', '#1DD1A1'];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const savedDrawings = JSON.parse(localStorage.getItem('loveDrawings')) || [];
    setDrawings(savedDrawings);
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = isErasing ? 'white' : color;
    ctx.lineWidth = isErasing ? 10 : 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    ctx.stroke();
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    const newDrawing = {
      image: dataUrl,
      author: currentUser,
      date: new Date().toLocaleString()
    };
    
    const updatedDrawings = [...drawings, newDrawing];
    setDrawings(updatedDrawings);
    localStorage.setItem('loveDrawings', JSON.stringify(updatedDrawings));
    clearCanvas();
  };

  const deleteDrawing = (index) => {
    const updatedDrawings = drawings.filter((_, i) => i !== index);
    setDrawings(updatedDrawings);
    localStorage.setItem('loveDrawings', JSON.stringify(updatedDrawings));
  };

  return (
    <div className="p-4">
      <div className="flex justify-center mb-4 gap-2">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => {
              setColor(c);
              setIsErasing(false);
            }}
            className={`w-8 h-8 rounded-full mx-1 ${color === c && !isErasing ? 'ring-2 ring-purple-500' : ''}`}
            style={{ backgroundColor: c }}
          />
        ))}
        <button
          onClick={() => setIsErasing(!isErasing)}
          className={`w-8 h-8 rounded-full mx-1 flex items-center justify-center ${isErasing ? 'bg-gray-300 ring-2 ring-purple-500' : 'bg-white border border-gray-300'}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border-2 border-purple-200 rounded-lg bg-white shadow-md mx-auto block"
      />
      <div className="flex justify-center mt-4 gap-4">
        <button
          onClick={clearCanvas}
          className="bg-red-200 text-red-700 px-4 py-2 rounded-lg hover:bg-red-300 transition-colors"
        >
          Limpiar
        </button>
        <button
          onClick={saveDrawing}
          className="bg-green-200 text-green-700 px-4 py-2 rounded-lg hover:bg-green-300 transition-colors"
        >
          Guardar Dibujo
        </button>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-purple-700 mb-2">Dibujos guardados</h3>
        <div className="grid grid-cols-2 gap-2">
          {drawings.map((drawing, index) => (
            <div key={index} className="bg-white p-2 rounded-lg shadow relative">
              <img 
                src={drawing.image} 
                alt={`Dibujo de ${drawing.author}`} 
                className="w-full h-auto rounded"
              />
              <p className="text-sm text-gray-600 mt-1">{drawing.author} - {drawing.date}</p>
              <button
                onClick={() => deleteDrawing(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrawingSection;