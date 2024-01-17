import React from 'react';

function ItemEndIcon({ color = '#000' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" id="align-bottom">
      <path
        fill={color}
        opacity={0.5}
        d="M 5.8 44.2 h 38.4 V 5.8 H 5.8 v 38.4 z M 7.4 7.4 h 35.2 v 35.2 H 7.4 V 7.4 z"
      ></path>
      <path
        fill={color}
        d="M 10.4 37.6 h 28.8 v 1.6 H 10.4 z M 13.6 32.8 h 22.4 v 1.6 H 13.6 z M 10.4 28 h 28.8 v 1.6 H 10.4 z"
      ></path>
    </svg>
  );
}

export default ItemEndIcon;
