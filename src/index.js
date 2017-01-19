import React from 'react';
import ReactDOM from 'react-dom';
import Square from './components/square';
import Row from './components/row';
import Mousetrap from 'mousetrap';

/*** DECLARE INITIALSTATE FOR EASY RESET ***/

const initialState = {squareNum: 26, rowNum: 26, map: [], health: 200, weapons:[{weapon: 'nunchucks', damage: 10}, {weapon: 'sword', damage: 20}, {weapon: 'AK-47', damage: 40}, {weapon: 'Bazooka', damage: 60}, {weapon: 'BFG', damage: 100}], playerLevel: 1, gameLevel: 1, enemyHealth: 150, bossHealth: 450,  enemyDamage: Math.floor(Math.random()*(9-6+1))+6, playerXP: 0, bossDamage: Math.floor(Math.random()*(30-25+1))+25,  weaponLevel: 0, lightsOn: false};

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
    this.bossAttack = this.bossAttack.bind(this);
    this.playerAttackBoss = this.playerAttackBoss.bind(this);
    this.bossCombat = this.bossCombat.bind(this);
    this.turnOnLight = this.turnOnLight.bind(this);
    this.swap = this.swap.bind(this);

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

    if(this.state.gameLevel < 4){
      let door = 0;
      while(door < 1){
        let x = Math.floor(Math.random() * (0 + 23 - 1)) + 0;
        let y = Math.floor(Math.random() * (0 + 23 - 1)) + 0;
        if(this.arr[x][y]===1){
          this.arr[x][y]=7;
          door++;
        }
      }
    }

    if(this.state.gameLevel === 4){
      let boss = 0;
      while(boss < 1){
        let x = Math.floor(Math.random() * (0 + 23 - 1)) + 0;
        let y = Math.floor(Math.random() * (0 + 23 - 1)) + 0;
        if(this.arr[x][y]===1){
          this.arr[x][y]=8;
          boss++;
        }
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
      if(choice === 0 && x > 22){
        continue;
      }
      else if(choice === 0 && x <= 22 && arr[x++][y]===0){
        arr[x++][y] = 1;
        count++;
      }
      else if(choice === 1 && x < 3){
        continue;
      }
      else if(choice === 1 && x >= 3 && arr[x--][y]===0){
        arr[x--][y] = 1;
        count++;
      }

      else if(choice === 2 && y > 22){
        continue;
      }
      else if(choice === 2 && y <= 22 && arr[x][y++]===0){
        arr[x][y++] = 1;
        count++;
      }
      else if(choice === 3 && y<3){
        continue;
      }
      else if(choice === 3 && y>=3 && arr[x][y--]===0){
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
         if(this.state.gameLevel < 4){
           this.arr[x-1][y]=7;
           this.arr = [];
           this.setState({gameLevel: this.state.gameLevel+1})
           this.set2DArray();
         }
       }
       else if(this.arr[x-1][y]===8){
         this.bossCombat();
         console.log(this.state.bossHealth);
         console.log(this.state.health);
         if(this.state.bossHealth <= 0 && this.state.health > 0){
           this.setState(initialState)
           this.set2DArray();
         }
        else if(this.state.bossHealth > 0 && this.state.health <= 0){
          this.setState(initialState)
          this.set2DArray();
        }
       }
     }
     if(this.state.lightsOn){
       this.turnOnLight();
     }
     else{
       this.setMap(this.arr);
     }
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
        if(this.state.gameLevel < 4){
          this.arr[x+1][y]=7;
          this.arr = [];
          this.setState({gameLevel: this.state.gameLevel+1})
          this.set2DArray();
        }
      }
      else if(this.arr[x+1][y]===8){
        this.bossCombat();
        console.log(this.state.bossHealth);
        console.log(this.state.health);
        if(this.state.bossHealth <= 0 && this.state.health > 0){
          this.setState(initialState)
          this.set2DArray();
        }
       else if(this.state.bossHealth > 0 && this.state.health <= 0){
         this.setState(initialState)
         this.set2DArray();
       }
      }
    }
    if(this.state.lightsOn){
      this.turnOnLight();
    }
    else{
      this.setMap(this.arr);
    }
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
        if(this.state.gameLevel < 4){
          this.arr[x][y+1]=7;
          this.arr = [];
          this.setState({gameLevel: this.state.gameLevel+1})
          this.set2DArray();
        }
      }
      else if(this.arr[x][y+1]===8){
        this.bossCombat();
        console.log(this.state.bossHealth);
        console.log(this.state.health);
        if(this.state.bossHealth <= 0 && this.state.health > 0){
          this.setState(initialState)
          this.set2DArray();
        }
       else if(this.state.bossHealth > 0 && this.state.health <= 0){
         this.setState(initialState)
         this.set2DArray();
       }
      }
    }
    if(this.state.lightsOn){
      this.turnOnLight();
    }
    else{
      this.setMap(this.arr);
    }
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
        if(this.state.gameLevel < 4){
          this.arr[x][y-1]=7;
          this.arr = [];
          this.setState({gameLevel: this.state.gameLevel+1})
          this.set2DArray();
        }
      }
      else if(this.arr[x][y-1]===8){
        this.bossCombat();
        console.log(this.state.bossHealth);
        console.log(this.state.health);
        if(this.state.bossHealth <= 0 && this.state.health > 0){
          this.setState(initialState)
          this.set2DArray();
        }
       else if(this.state.bossHealth > 0 && this.state.health <= 0){
         this.setState(initialState)
         this.set2DArray();
       }
      }
    }
    if(this.state.lightsOn){
      this.turnOnLight();
    }
    else{
      this.setMap(this.arr);
    }
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
   if(this.state.enemyHealth <=0){
       this.setState({playerXP: this.state.playerXP+20})
     }
   if(this.state.health <= 0){
     this.setState(initialState)
     this.set2DArray(this.arr);
   }
   if(this.state.playerXP === 40){
       this.setState({playerLevel: 2})
     }
   if(this.state.playerXP === 80){
       this.setState({playerLevel: 3})
     }
   if(this.state.playerXP === 100){
       this.setState({playerLevel: 4})
     }
   }
   bossCombat(){
     let playerTurn = 1;
     let bossTurn = 0;
     while(this.state.health > 0 && this.state.bossHealth > 0){
       if(playerTurn > bossTurn){
         this.playerAttackBoss();
         bossTurn++;
       }
       if(bossTurn === playerTurn){
         this.bossAttack();
         this.setState({bossDamage: Math.floor(Math.random()*(20-15+1))+15})
         playerTurn++;
       }
     }
   }
  enemyAttack(){
   this.setState({health: this.state.health - this.state.enemyDamage})
  }
  playerAttack(){
   if(this.state.playerLevel === 1){
        this.setState({enemyHealth: this.state.enemyHealth - this.state.weapons[this.state.weaponLevel].damage})
        console.log(this.state.enemyHealth)
   }
   else if(this.state.playerLevel === 2){
             this.setState({enemyHealth: this.state.enemyHealth -  (this.state.weapons[this.state.weaponLevel].damage + 10)})
   }
   else if(this.state.playerLevel === 3){
             this.setState({enemyHealth: this.state.enemyHealth - (this.state.weapons[this.state.weaponLevel].damage+20)})
   }
   else if(this.state.playerLevel === 4){
             this.setState({enemyHealth: this.state.enemyHealth - (this.state.weapons[this.state.weaponLevel].damage+30)})
   }
  }
  resetEnemyHealth(){
    this.setState({enemyHealth: 150})
  }
  bossAttack(){
    this.setState({health: this.state.health - this.state.bossDamage})
  }
  playerAttackBoss(){
    if(this.state.playerLevel === 1){
         this.setState({bossHealth: this.state.bossHealth - this.state.weapons[this.state.weaponLevel].damage})
    }
    else if(this.state.playerLevel === 2){
              this.setState({bossHealth: this.state.bossHealth -  (this.state.weapons[this.state.weaponLevel].damage + 10)})
    }
    else if(this.state.playerLevel === 3){
              this.setState({bossHealth: this.state.bossHealth - (this.state.weapons[this.state.weaponLevel].damage+20)})
    }
    else if(this.state.playerLevel === 4){
              this.setState({bossHealth: this.state.bossHealth - (this.state.weapons[this.state.weaponLevel].damage+30)})
    }
  }
  /*** SETTING MAP BASED ON PLAYER MOVEMENT/ACTIONS AND INITIAL GAME RENDER ***/

  setMap(arr){
    this.setState({lightsOn: false})
    let squares = [];
    let rows = [];
    let size = this.state.squareNum * this.state.rowNum;
    for(let i = 0; i < arr.length; i++){
      for(let j = 0; j < arr[i].length; j++){
        if(arr[i][j] === 3){
          if(arr[i-1][j]===4 || arr[i+1][j]===4 || arr[i][j-1]===4 || arr[i][j+1] === 4 || arr[i-1][j-1] === 4 || arr[i+1][j+1] === 4 || arr[i+1][j-1] === 4 || arr[i-1][j+1] === 4 || arr[i-2][j] === 4 || arr[i+2][j]===4 || arr[i][j-2] === 4 || arr[i][j+2]===4 ||arr[i-2][j-2] === 4 || arr[i+2][j+2] === 4 || arr[i+2][j-2] === 4 || arr[i-2][j+2] === 4 || arr[i-1][j-2] === 4 || arr[i+1][j-2]===4 || arr[i+2][j-1]===4 || arr[i-2][j-1]===4 || arr[i+1][j+2]===4 || arr[i+2][j+1]===4 || arr[i-1][j+2]===4 || arr[i-2][j+1]===4){
            squares.push(<Square key = {size} class = "health"/>);
            size--;
          }
          else {
            squares.push(<Square key = {size} class = "health dark"/>);
            size--;
          }
        }
        else if(arr[i][j] === 4){
          squares.push(<Square  key = {size} class = "player"/>);
          size--;
        }
        else if(arr[i][j] === 5){
          if(arr[i-1][j]===4 || arr[i+1][j]===4 || arr[i][j-1]===4 || arr[i][j+1] === 4 || arr[i-1][j-1] === 4 || arr[i+1][j+1] === 4 || arr[i+1][j-1] === 4 || arr[i-1][j+1] === 4 || arr[i-2][j] === 4 || arr[i+2][j]===4 || arr[i][j-2] === 4 || arr[i][j+2]===4 ||arr[i-2][j-2] === 4 || arr[i+2][j+2] === 4 || arr[i+2][j-2] === 4 || arr[i-2][j+2] === 4 || arr[i-1][j-2] === 4 || arr[i+1][j-2]===4 || arr[i+2][j-1]===4 || arr[i-2][j-1]===4 || arr[i+1][j+2]===4 || arr[i+2][j+1]===4 || arr[i-1][j+2]===4 || arr[i-2][j+1]===4){
            squares.push(<Square  key = {size} class = "enemy"/>);
            size--;
          }
          else{
            squares.push(<Square  key = {size} class = "enemy dark"/>);
            size--;
          }
        }
        else if(arr[i][j] === 6){
          if(arr[i-1][j]===4 || arr[i+1][j]===4 || arr[i][j-1]===4 || arr[i][j+1] === 4 || arr[i-1][j-1] === 4 || arr[i+1][j+1] === 4 || arr[i+1][j-1] === 4 || arr[i-1][j+1] === 4 || arr[i-2][j] === 4 || arr[i+2][j]===4 || arr[i][j-2] === 4 || arr[i][j+2]===4 ||arr[i-2][j-2] === 4 || arr[i+2][j+2] === 4 || arr[i+2][j-2] === 4 || arr[i-2][j+2] === 4 || arr[i-1][j-2] === 4 || arr[i+1][j-2]===4 || arr[i+2][j-1]===4 || arr[i-2][j-1]===4 || arr[i+1][j+2]===4 || arr[i+2][j+1]===4 || arr[i-1][j+2]===4 || arr[i-2][j+1]===4){
            squares.push(<Square  key = {size} class = "weapon"/>);
            size--;
          }
          else{
            squares.push(<Square  key = {size} class = "weapon dark"/>);
            size--;
          }
        }
        else if(arr[i][j] === 7 && this.state.gameLevel <= 3){
          if(arr[i-1][j]===4 || arr[i+1][j]===4 || arr[i][j-1]===4 || arr[i][j+1] === 4 || arr[i-1][j-1] === 4 || arr[i+1][j+1] === 4 || arr[i+1][j-1] === 4 || arr[i-1][j+1] === 4 || arr[i-2][j] === 4 || arr[i+2][j]===4 || arr[i][j-2] === 4 || arr[i][j+2]===4 ||arr[i-2][j-2] === 4 || arr[i+2][j+2] === 4 || arr[i+2][j-2] === 4 || arr[i-2][j+2] === 4 || arr[i-1][j-2] === 4 || arr[i+1][j-2]===4 || arr[i+2][j-1]===4 || arr[i-2][j-1]===4 || arr[i+1][j+2]===4 || arr[i+2][j+1]===4 || arr[i-1][j+2]===4 || arr[i-2][j+1]===4){
            squares.push(<Square  key = {size} class = "door"/>);
            size--;
          }
          else{
            squares.push(<Square  key = {size} class = "door dark"/>);
            size--;
          }
        }
        else if(arr[i][j] === 8 && this.state.gameLevel === 4){
          if(arr[i-1][j]===4 || arr[i+1][j]===4 || arr[i][j-1]===4 || arr[i][j+1] === 4 || arr[i-1][j-1] === 4 || arr[i+1][j+1] === 4 || arr[i+1][j-1] === 4 || arr[i-1][j+1] === 4 || arr[i-2][j] === 4 || arr[i+2][j]===4 || arr[i][j-2] === 4 || arr[i][j+2]===4 ||arr[i-2][j-2] === 4 || arr[i+2][j+2] === 4 || arr[i+2][j-2] === 4 || arr[i-2][j+2] === 4 || arr[i-1][j-2] === 4 || arr[i+1][j-2]===4 || arr[i+2][j-1]===4 || arr[i-2][j-1]===4 || arr[i+1][j+2]===4 || arr[i+2][j+1]===4 || arr[i-1][j+2]===4 || arr[i-2][j+1]===4){
            squares.push(<Square key = {size} class = "boss"/>);
            size--;
          }
          else{
            squares.push(<Square  key = {size} class = "boss dark"/>);
            size--;
          }

        }
        else if(arr[i][j] === 0){
          if(i == 0 || j== 0 || i ==25 || j ==25 || i == 1 || j == 1|| i == 24 || j == 24){
            squares.push(<Square key = {size} class = "border"/>);
            size--;
          }
         else{
             if(arr[i-1][j]===4 || arr[i+1][j]===4 || arr[i][j-1]===4 || arr[i][j+1] === 4 || arr[i-1][j-1] === 4 || arr[i+1][j+1] === 4 || arr[i+1][j-1] === 4 || arr[i-1][j+1] === 4 || arr[i-2][j] === 4 || arr[i+2][j]===4 || arr[i][j-2] === 4 || arr[i][j+2]===4 ||arr[i-2][j-2] === 4 || arr[i+2][j+2] === 4 || arr[i+2][j-2] === 4 || arr[i-2][j+2] === 4 || arr[i-1][j-2] === 4 || arr[i+1][j-2]===4 || arr[i+2][j-1]===4 || arr[i-2][j-1]===4 || arr[i+1][j+2]===4 || arr[i+2][j+1]===4 || arr[i-1][j+2]===4 || arr[i-2][j+1]===4){
               squares.push(<Square key = {size} class = "wall"/>);
               size--;
             }
             else{
               squares.push(<Square key = {size} class = "wall dark"/>);
               size--;
             }

            }
        }

        else if(arr[i][j] === 1){
            if(arr[i-1][j]===4 || arr[i+1][j]===4 || arr[i][j-1]===4 || arr[i][j+1] === 4 || arr[i-1][j-1] === 4 || arr[i+1][j+1] === 4 || arr[i+1][j-1] === 4 || arr[i-1][j+1] === 4 || arr[i-2][j] === 4 || arr[i+2][j]===4 || arr[i][j-2] === 4 || arr[i][j+2]===4 ||arr[i-2][j-2] === 4 || arr[i+2][j+2] === 4 || arr[i+2][j-2] === 4 || arr[i-2][j+2] === 4 || arr[i-1][j-2] === 4 || arr[i+1][j-2]===4 || arr[i+2][j-1]===4 || arr[i-2][j-1]===4 || arr[i+1][j+2]===4 || arr[i+2][j+1]===4 || arr[i-1][j+2]===4 || arr[i-2][j+1]===4) {
              squares.push(<Square  key={size} class = "floor"/>);
              size--;
            }
            else {
              squares.push(<Square  key={size} class = "floor dark"/>);
              size--;
            }


        }
        if(squares.length === this.state.squareNum){
          rows.push(<Row  key = {size} squares = {squares}/>);
          squares = [];
          if(rows.length === this.state.rowNum){
             this.setState({map: rows})
           }
         }
      }
    }
  }
  turnOnLight(){
    this.setState({lightsOn: true})
    let squares = [];
    let rows = [];
    let size = this.state.squareNum * this.state.rowNum;
    for(let i =0; i < this.arr.length; i++){
      for(let j = 0; j < this.arr[i].length; j++){
        if(this.arr[i][j] === 3){
          squares.push(<Square key = {size} class = "health"/>);
          size--;
        }
        else if(this.arr[i][j] === 4){
          squares.push(<Square  key = {size} class = "player"/>);
          size--;
      }
      else if(this.arr[i][j] === 5){
        squares.push(<Square  key = {size} class = "enemy"/>);
        size--;
      }
      else if(this.arr[i][j] === 6){
        squares.push(<Square  key = {size} class = "weapon"/>);
        size--;
      }
      else if(this.arr[i][j] === 7){
        squares.push(<Square  key = {size} class = "door"/>);
        size--;
      }
      else if(this.arr[i][j] === 8){
        squares.push(<Square  key = {size} class = "boss"/>);
        size--;
      }
      else if(this.arr[i][j] === 0){
        if(i == 0 || j== 0 || i ==25 || j ==25 || i == 1 || j == 1|| i == 24 || j == 24){
          squares.push(<Square key = {size} class = "border"/>);
          size--;
        }
        else{
          squares.push(<Square key = {size} class = "wall"/>);
          size--;
        }
      }
      else if(this.arr[i][j] === 1){
        squares.push(<Square  key = {size} class = "floor"/>);
        size--;
      }
      if(squares.length === this.state.squareNum){
        rows.push(<Row  key = {size} squares = {squares}/>);
        squares = [];
        if(rows.length === this.state.rowNum){
           this.setState({map: rows})
         }
       }
    }
  }
}
swap(){
  if(!this.state.lightsOn){
    this.turnOnLight();
  }
  else{
    this.setMap(this.arr);
  }
}
  render(){
    return(
      <div>
      <h3>Game Level: {this.state.gameLevel}</h3>
      <h3>Player Experience: {this.state.playerXP}</h3>
      <h3>Player Level: {this.state.playerLevel}</h3>
      <h3>Player Health: {this.state.health}</h3>
      <h3>Weapon: {this.state.weapons[this.state.weaponLevel].weapon}</h3>
      <h3>Attack: {this.state.weapons[this.state.weaponLevel].damage}</h3>
      <button onClick={this.swap}>{this.state.lightsOn ? 'Toggle Dark':'Toggle Light'}</button>
      {this.state.map}
      </div>
    )
  }
}
ReactDOM.render(<Hello/>, document.getElementById("app"));
