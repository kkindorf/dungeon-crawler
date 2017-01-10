import React from 'react';

const Row = (props) => {
  return (
    <div>
      <div className="rows">{props.squares}</div>
    </div>
  )
}

export default Row;
