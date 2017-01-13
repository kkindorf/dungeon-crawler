import React from 'react';
import ReactDOM from 'react-dom';
import Square from './components/square';
import Row from './components/row';
import Mousetrap from 'mousetrap';

/*** DECLARE INITIALSTATE FOR EASY RESET ***/

const initialState = {squareNum: 26, rowNum: 26, map: [], health: 200, weapons:[{weapon: 'nun-chucks', damage: 10}, {weapon: 'sword', damage: 20}, {weapon: 'AK-47', damage: 40}, {weapon: 'Bazooka', damage: 60}], playerLevel: 1, gameLevel: 1, enemyHealth: 150, enemyDamage: Math.floor(Math.random()*(9-6+1))+6, playerXP: 0, weaponLevel: 0};

class Hello extends React.Component{
  constructor(props){
    super(props);
    this.state = initialState;
    this.arr = [];
    this.set2DArray = this.set2DArray.bind(this);
    this.movePlayer = this.movePlayer.bind(this);
    this.setMap = this.setMap.bind(this);
    this.randomWalk = this.randomWalk.bind(this);
    this.combat = this.combat.bind(this);
    this.enemyAttack = this.enemyAttack.bind(this);
    this.playerAttack = this.playerAttack.bind(this);
    this.resetEnemyHealth = this.resetEnemyHealth.bind(this);
  }

  /*** GENERATE INITIAL 2D ARRAY ***/

  componentWillMount(){
    this.set2DArray();
  }
  /*** USE MOUSETRAP LIBRARY FOR EASY KEYBOARD ACCESS ***/

  componentDidMount(){
    Mousetrap.bind(['up', 'down', 'right', 'left'],  this.movePlayer);
  }
  componentWillUnmount() {
    Mousetrap.unbind(['up', 'down', 'right', 'left'], this.movePlayer);
  }
  set2DArray(){
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

    /*** SET ALL PIECES AND PLAYER ON MAP ***/

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

  /*** USE RANDOM WALK ALGORITHM TO SET FLOOR ***/

  randomWalk(arr){
    let x = this.state.squareNum / 2;
    let y = this.state.rowNum/ 2;
    let count = 0;
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

  /*** MOVING THE PLAYER! TODO: BREAK THIS UP INTO SMALLER FUNCTIONS? ***/

  movePlayer(e) {
    e.preventDefault();
    let x;
    let y;
    for(let i =0; i < this.arr.length; i++){
      for (let j = 0; j < this.arr[i].length; j++){
        if(this.arr[i][j] === 4){
          x = i;
          y = j;
        }
      }
    }
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
         this.setState({health: this.state.health+25})
         this.arr[x-1][y]=4;
       }
       else if(this.arr[x-1][y]===5){
         this.combat();
         if(this.state.enemyHealth <=0 && this.state.health > 0){
           this.arr[x-1][y]=4;
           this.resetEnemyHealth();
         }
       }
       else if(this.arr[x-1][y]===6){
         this.setState({weaponLevel: this.state.weaponLevel+1})
         this.arr[x-1][y]=4;
       }
       else if(this.arr[x-1][y]===7){
         if(this.state.gameLevel < 5){
           this.arr[x-1][y]=7;
           this.arr = [];
           this.setState({gameLevel: this.state.gameLevel+1})
           this.set2DArray();
         }
         else{
           this.setState(initialState)
           this.set2DArray();
         }
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
        this.setState({health: this.state.health+25})
        this.arr[x+1][y]=4;
      }
      else if(this.arr[x+1][y]===5){
        this.combat();
        if(this.state.enemyHealth <=0 && this.state.health >0){
          this.arr[x+1][y]=4;
          this.resetEnemyHealth();
        }
      }
      else if(this.arr[x+1][y]===6){
        this.setState({weaponLevel: this.state.weaponLevel+1})
        this.arr[x+1][y]=4;
      }
      else if(this.arr[x+1][y]===7){
        if(this.state.gameLevel < 5){
          this.arr[x-1][y]=7;
          this.arr = [];
          this.setState({gameLevel: this.state.gameLevel+1})
          this.set2DArray();
        }
        else{
          this.setState(initialState)
          this.set2DArray();
        }
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
        this.setState({health: this.state.health+25})
        this.arr[x][y+1]=4;
      }
      else if(this.arr[x][y+1]===5){
        this.combat();
        if(this.state.enemyHealth <=0 && this.state.health > 0){
          this.arr[x][y+1]=4;
          this.resetEnemyHealth();
        }
      }
      else if(this.arr[x][y+1]===6){
        this.setState({weaponLevel: this.state.weaponLevel+1})
        this.arr[x][y+1]=4;
      }
      else if(this.arr[x][y+1]===7){
        if(this.state.gameLevel < 5){
          this.arr[x-1][y]=7;
          this.arr = [];
          this.setState({gameLevel: this.state.gameLevel+1})
          this.set2DArray();
        }
        else{
          this.setState(initialState)
          this.set2DArray();
        }
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
        this.setState({health: this.state.health+25})
        this.arr[x][y-1]=4;
      }
      else if(this.arr[x][y-1]===5){
        this.combat();
        if(this.state.enemyHealth <=0 && this.state.health > 0){
          this.arr[x][y-1]=4;
          this.resetEnemyHealth();
        }
      }
      else if(this.arr[x][y-1]===6){
        this.setState({weaponLevel: this.state.weaponLevel+1})
        this.arr[x][y-1]=4;
      }
      else if(this.arr[x][y-1]===7){
        if(this.state.gameLevel < 5){
          this.arr[x-1][y]=7;
          this.arr = [];
          this.setState({gameLevel: this.state.gameLevel+1})
          this.set2DArray();
        }
        else{
          this.setState(initialState)
          this.set2DArray();
        }
      }
    }
    this.setMap(this.arr);
   }
 }
 combat(){
   let playerTurn = 1;
   let enemyTurn = 0;
   while(this.state.enemyHealth > 0 && this.state.health > 0){
     if(playerTurn > enemyTurn){
       this.playerAttack();
       enemyTurn++;
     }
     else if(enemyTurn === playerTurn){
       this.enemyAttack();
       this.setState({enemyDamage: Math.floor(Math.random()*(8-6+1))+6})
       playerTurn++;
     }
   }

 }
  enemyAttack(){
   this.setState({health: this.state.health - this.state.enemyDamage})
  }
  playerAttack(){
   this.setState({enemyHealth: this.state.enemyHealth - this.state.weapons[this.state.weaponLevel].damage})
  }
  resetEnemyHealth(){
    this.setState({enemyHealth: 150})
  }

  /*** SETTING MAP BASED ON PLAYER MOVEMENT/ACTIONS AND INITIAL GAME RENDER ***/

  setMap(arr){
    let squares = [];
    let rows = [];
    let flatArr = [].concat.apply([], arr);
    for(let i = 0; i < flatArr.length; i++){
      if(flatArr[i] === 3){
        squares.push(<Square key = {i} class = "health"/>);
      }
      else if(flatArr[i] === 4){
        squares.push(<Square key={i} class = "player"/>);
      }
      else if(flatArr[i] === 5){
        squares.push(<Square key = {i} class = "enemy"/>);
      }
      else if(flatArr[i]===6){
        squares.push(<Square key = {i} class = "weapon"/>);
      }
      else if(flatArr[i] === 7){
        squares.push(<Square key = {i} class = "door"/>);
      }
      else if(flatArr[i] === 0){
        squares.push(<Square key = {i} class = "wall"/>);
      }
      else if(flatArr[i] === 1){
        squares.push(<Square key = {i} class = "floor"/>);
      }
     if(squares.length === this.state.squareNum){
       rows.push(<Row key = {i} squares = {squares}/>);
       squares = [];
       if(rows.length === this.state.rowNum){
          this.setState({map: rows})
        }
      }
    }
  }
  render(){
    return(
      <div>
        <h3>Game Level:{this.state.gameLevel}</h3>
        <h3>Player Experience: {this.state.playerXP}</h3>
        <h3>Player Level: {this.state.playerLevel}</h3>
        <h3>Player Health: {this.state.health}</h3>
        <h3>Weapon: {this.state.weapons[this.state.weaponLevel].weapon}</h3>
        <h3>Attack: {this.state.weapons[this.state.weaponLevel].damage}</h3>
        {this.state.map}
      </div>
    )
  }
}
ReactDOM.render(<Hello/>, document.getElementById("app"));
