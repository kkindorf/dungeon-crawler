import React from 'react';
const Enemy = (props)=>{
  return(
    <div>
      <div className="enemy" onChange={props.onChange}></div>
    </div>
  )
}

export default Enemy;
