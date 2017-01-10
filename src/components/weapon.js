import React from 'react';
const Weapon = (props) =>{
  return(
    <div>
      <div className="weapon" onChange={props.onChange}></div>
    </div>
  )
}
export default Weapon;
