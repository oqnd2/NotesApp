import React from 'react';

const FloatingButton = ({ onClick }) => {
  return (
    <button className="floating-button" onClick={onClick}>
      Agregar nota
    </button>
  );
};

export default FloatingButton;
