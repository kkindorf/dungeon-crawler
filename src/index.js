import React from 'react';
import ReactDOM from 'react-dom';
import Square from './components/square';
import Row from './components/row';
import Health from './components/health';
import Player from './components/player';
import Enemy from './components/enemy';
import Weapon from './components/weapon';
import Door from './components/door';
import Mousetrap from 'mousetrap';

class Hello extends React.Component{
  constructor(props){
    super(props);
    this.state=({squareNum: 26, rowNum: 26, map: [], health: 0, weapon:'fists'});
    this.arr = [];
    this.movePlayer = this.movePlayer.bind(this);
    this.setMap = this.setMap.bind(this);
    this.randomWalk = this.randomWalk.bind(this);
  }
  componentWillMount(){
    /*** GENERATE INITIAL 2D ARRAY ***/
    let size = this.state.squareNum * this.state.rowNum;
    let squares = [];
    let rows = [];
    let middle  = size / 2;
    for(let i = 0; i < size; i++){
      squares.push(0)
      if(squares.length === this.state.squareNum){
        rows.push(squares);
        squares = [];
      }
      if(rows.length === this.state.rowNum){
        this.arr = rows;
        rows = [];
      }
    }
    this.randomWalk(this.arr);

    /***SET ALL PIECES AND PLAYER***/
    let healthCount = 0;
    while (healthCount < 8){
      let x = Math.floor(Math.random() * (0 + 23 - 1)) + 0;
      let y = Math.floor(Math.random() * (0 + 23 - 1)) + 0;
      if(this.arr[x][y]===1){
        this.arr[x][y]=3;
        healthCount++;
      }
    }
    let enemyCount = 0;
    while(enemyCount < 6){
      let x = Math.floor(Math.random() * (0 + 23 - 1)) + 0;
      let y = Math.floor(Math.random() * (0 + 23 - 1)) + 0;
      if(this.arr[x][y]===1){
        this.arr[x][y]=5;
        enemyCount++;
      }
    }
    let weapon = 0;
    while(weapon < 1){
      let x = Math.floor(Math.random() * (0 + 23 - 1)) + 0;
      let y = Math.floor(Math.random() * (0 + 23 - 1)) + 0;
      if(this.arr[x][y]===1){
        this.arr[x][y]=6;
        weapon++;
      }
    }
    let player = 0;
    while(player < 1){
      let x = Math.floor(Math.random() * (0 + 23 - 1)) + 0;
      let y = Math.floor(Math.random() * (0 + 23 - 1)) + 0;
      if(this.arr[x][y]===1){
        this.arr[x][y]=4;
        player++;
      }
    }
    let door = 0;
    while(door < 1){
      let x = Math.floor(Math.random() * (0 + 23 - 1)) + 0;
      let y = Math.floor(Math.random() * (0 + 23 - 1)) + 0;
      if(this.arr[x][y]===1){
        this.arr[x][y]=7;
        door++;
      }
    }
    this.setMap(this.arr);
  }
  componentDidMount(){
  Mousetrap.bind(['up', 'down', 'right', 'left'],  this.movePlayer);
  }
  componentWillUnmount() {
  Mousetrap.unbind(['up', 'down', 'right', 'left'], this.movePlayer);
}
randomWalk(arr){
  let x = this.state.squareNum / 2;
  let y = this.state.rowNum/ 2;
  let count = 0;

  /****USE RANDOM WALK ALGORITHM TO SET FLOOR****/
  while(count < 400){
    let choice = Math.floor(Math.random() * (0 + 5 - 1)) + 0;
    if(arr[x][y] === 0){
      arr[x][y] = 1;
      count++;
    }
    if(choice === 0 && x > 23){
      continue;
    }
    else if(choice === 0 && x <= 23 && arr[x++][y]===0){
      arr[x++][y] = 1;
      count++;
    }
    else if(choice === 1 && x < 2){
      continue;
    }
    else if(choice === 1 && x >= 2 && arr[x--][y]===0){
      arr[x--][y] = 1;
      count++;
    }

    else if(choice === 2 && y > 23){
      continue;
    }
    else if(choice === 2 && y <= 23 && arr[x][y++]===0){
      arr[x][y++] = 1;
      count++;
    }
    else if(choice === 3 && y<2){
      continue;
    }
    else if(choice === 3 && y>=2 && arr[x][y--]===0){
      arr[x][y--] = 1;
      count++;
    }
  }
}
  movePlayer(e) {
    e.preventDefault();
    let x;
    let y;
    for(let i =0; i < this.arr.length; i++){
      for (let j = 0; j < this.arr[i].length; j++){
        if(this.arr[i][j] === 4){
          x = i;
          y = j;
          console.log(x, y);
        }
      }
    }
    /***MOVING THE PLAYER!****/
    if(e.key === 'ArrowUp'){
      if(this.arr[x-1][y]===0){
        return;
      }
      if(this.arr[x][y]===4){
        this.arr[x][y]=1;
       if(this.arr[x-1][y]===1){
         this.arr[x-1][y]=4;
       }
       else if(this.arr[x-1][y]===3){
         this.setState({health: this.state.health+10})
         this.arr[x-1][y]=4;
       }
       else if(this.arr[x-1][y]===5){
         this.arr[x-1][y]=4;
       }
       else if(this.arr[x-1][y]===6){
         this.setState({weapon: 'sword'})
         this.arr[x-1][y]=4;
       }
       else if(this.arr[x-1][y]===7){
         this.arr[x-1][y]=4;
       }
     }
     this.setMap(this.arr);
   }
   if(e.key === 'ArrowDown'){
     if(this.arr[x+1][y]===0){
       return;
     }
     if(this.arr[x][y]===4){
       this.arr[x][y]=1;
      if(this.arr[x+1][y]===1){
        this.arr[x+1][y]=4;
      }
      else if(this.arr[x+1][y]===3){
        this.setState({health: this.state.health+10})
        this.arr[x+1][y]=4;
      }
      else if(this.arr[x+1][y]===5){
        this.arr[x+1][y]=4;
      }
      else if(this.arr[x+1][y]===6){
        this.setState({weapon: 'sword'})
        this.arr[x+1][y]=4;
      }
      else if(this.arr[x+1][y]===7){
        this.arr[x+1][y]=4;
      }
    }
    this.setMap(this.arr);
   }
   if(e.key === 'ArrowRight'){
     if(this.arr[x][y+1]===0){
       return;
     }
     if(this.arr[x][y]===4){
       this.arr[x][y]=1;
      if(this.arr[x][y+1]===1){
        this.arr[x][y+1]=4;
      }
      else if(this.arr[x][y+1]===3){
        this.setState({health: this.state.health+10})
        this.arr[x][y+1]=4;
      }
      else if(this.arr[x][y+1]===5){
        this.arr[x][y+1]=4;
      }
      else if(this.arr[x][y+1]===6){
        this.setState({weapon: 'sword'})
        this.arr[x][y+1]=4;
      }
      else if(this.arr[x][y+1]===7){
        this.arr[x][y+1]=4;
      }
    }
    this.setMap(this.arr);
   }
   if(e.key === 'ArrowLeft'){
     if(this.arr[x][y-1]===0){
       return;
     }
     if(this.arr[x][y]===4){
       this.arr[x][y]=1;
      if(this.arr[x][y-1]===1){
        this.arr[x][y-1]=4;
      }
      else if(this.arr[x][y-1]===3){
        this.setState({health: this.state.health+10})
        this.arr[x][y-1]=4;
      }
      else if(this.arr[x][y-1]===5){
        this.arr[x][y-1]=4;
      }
      else if(this.arr[x][y-1]===6){
        this.setState({weapon: 'sword'})
        this.arr[x][y-1]=4;
      }
      else if(this.arr[x][y-1]===7){
        this.arr[x][y-1]=4;
      }
    }
    this.setMap(this.arr);
   }
 }

setMap(arr){
    /**RESETTING MAP BASED ON PLAYER LOAD OR INITIAL RENDER**/
  let squares = [];
  let rows = [];
  let flatArr = [].concat.apply([], arr);
  for(let i = 0; i < flatArr.length; i++){
    if(flatArr[i] === 3){
      squares.push(<Health key = {i}/>);
    }
    else if(flatArr[i] === 4){
      squares.push(<Player key={i}/>);
    }
    else if(flatArr[i] === 5){
      squares.push(<Enemy key = {i}/>);
    }
    else if(flatArr[i]===6){
      squares.push(<Weapon key = {i}/>);
    }
    else if(flatArr[i] === 7){
      squares.push(<Door key = {i}/>);
    }
    else if(flatArr[i] === 0){
      squares.push(<Square key = {i} class ='wall'/>);
    }
    else if(flatArr[i] === 1){
      squares.push(<Square key = {i} class ='floor'/>);
    }
   if(squares.length === this.state.squareNum){
     rows.push(<Row key = {i} squares = {squares}/>);
     squares = [];
     if(rows.length === this.state.rowNum){
        this.setState({map: rows, hi: 'bye'})
      }
    }
  }
}
  render(){
    return(
      <div>
        <h3>{this.state.health}</h3>
        <h3>{this.state.weapon}</h3>
        {this.state.map}
      </div>
    )
  }
}
ReactDOM.render(<Hello/>, document.getElementById("app"));
