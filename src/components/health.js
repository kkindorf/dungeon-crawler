import React from 'react';
const Health = (props) =>{
  return(
    <div>
      <div className="health" onChange={props.onChange}></div>
    </div>
  )
}

export default Health;
