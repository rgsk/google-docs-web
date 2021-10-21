import React from 'react';
import Loader from 'react-loader-spinner';
function MyLoader({ right }) {
  return (
    <Loader
      type="Puff"
      color="#00BFFF"
      height={50}
      width={50}
      style={{
        position: 'fixed',
        left: !right && 0,
        top: 0,
        right: right && 0,
        zIndex: 20,
      }}
    />
  );
}

export default MyLoader;
