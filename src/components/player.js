import React from 'react';
const Player = (props) =>{
  return(
    <div><div className="player" onChange={props.onChange} tabIndex="1" onKeyDown={props.onKeyDown}></div></div>
  )
}
export default Player;
