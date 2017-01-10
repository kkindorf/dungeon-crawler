import React from 'react';
const Door = (props)=>{
  return(
    <div>
      <div className="door" onChange={props.onChange}></div>
    </div>
  )
}
export default Door;
