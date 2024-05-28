import React from 'react';
import './TitleBox.css';

function TitleBox({ title, subtitle }) {
  return (
    <div className="title-box">
      <div className="title-content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}

export default TitleBox;