import React from 'react';
const Map = (props) => {
  return (
    <div>
      <div className="board" onKeyDown={props.onKeyDown}>{props.rows}</div>
    </div>
  )
}
export default Map;
