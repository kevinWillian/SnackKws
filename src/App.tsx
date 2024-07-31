import $ from "jquery";
import { useState } from "react";
import Button from '@mui/material/Button';
declare let global: any;
global.jQuery = $;

enum directionKey{
  Up,
  Left,
  Rigth,
  Down
}
var w = window.innerWidth;
var h = window.innerHeight;
var squareSize = (w > h) ? h : w;
var snackPartSize = 2 * (squareSize/100);
let isFirst = true;
let firstSnackCords = new Array((Math.floor(squareSize/2)));
let isGameOver = false;


function Game(){

  

  
  if(isFirst){
    firstSnackCords[0] = [(squareSize/2),(squareSize/2)];
    firstSnackCords[1] = [(squareSize/2- snackPartSize),(squareSize/2)];
    firstSnackCords[2] = [(squareSize/2 - (2*snackPartSize)) ,(squareSize/2)];
    for(let i = 3; i < firstSnackCords.length; i++){
      firstSnackCords[i] = [-snackPartSize,-snackPartSize];
    }
    isFirst = false;
  }

  const [snackCords , setSnackCords] = useState(firstSnackCords);
  const [appleCords, setAppleCords] = useState([50,50]);
  const [direction, setDirection] = useState(directionKey.Rigth);
  const [gameInterval, setGameInterval] = useState(20);
  const [gameVelo, setGameVelo] = useState(1);
  const [snackSize, setSnackSize] = useState(3);

  function startNewGame(){
    window.location.reload();
  }

  function isEat(){
    if((snackCords[0][0] > appleCords[0] || snackCords[0][0] > appleCords[0] - snackPartSize)
      && snackCords[0][0] < appleCords[0] + snackPartSize
      && (snackCords[0][1] > appleCords[1] || snackCords[0][1] > appleCords[1] - snackPartSize)
      && snackCords[0][1] < appleCords[1] + snackPartSize){
      return true;
    }else {
      return false;
    }
  }

  function getIsGameOver(){
    for(let i = 1; i < snackCords.length; i++){
      if(i > snackSize){
        return false;
      }
      if((snackCords[0][0] > snackCords[i][0] || snackCords[0][0] > snackCords[i][0] - snackPartSize)
        && snackCords[0][0] < snackCords[i][0] + snackPartSize
        && (snackCords[0][1] > snackCords[i][1] || snackCords[0][1] > snackCords[i][1] - snackPartSize)
        && snackCords[0][1] < snackCords[i][1] + snackPartSize){
        return true;
      }
    }
    return false;
  }

  if(isEat()){
    genereteApple();
    setSnackSize(snackSize + 4);
    setGameVelo(gameVelo + 0.4);
  }

  function genereteApple(){
    let x = (Math.floor(Math.random() * ((squareSize - snackPartSize) - snackPartSize + 1)) + snackPartSize)
    let y = (Math.floor(Math.random() * (squareSize - snackPartSize + 1)) + snackPartSize)
    let nextAppleCords = appleCords.slice();
    nextAppleCords[0] = x;
    nextAppleCords[1] = y;
    setAppleCords(nextAppleCords);  
  }

  function logic(timestamp: number){

    if(isGameOver){
      return;
    }

    if(gameInterval > 0){
      setGameInterval(gameInterval - 1);
      return;
    }else{
      setGameInterval(20/gameVelo);
    }

    function coMoveSnack(_nextSnackCords : number[][], _snackCords: number[][]){
      for(let i = 1; i < _nextSnackCords.length; i++){
        if(i > snackSize){
          break;
        }
        _nextSnackCords[i] = _snackCords[i -1];
      }
      return _nextSnackCords;
    }

    switch (direction){
      case directionKey.Rigth:{
        let nextSnackCords = snackCords.slice();
        if((nextSnackCords[0][0] + 2*snackPartSize) > squareSize){
          nextSnackCords[0] = [0, nextSnackCords[0][1]]
        }else{
          nextSnackCords[0] = [nextSnackCords[0][0] + snackPartSize, nextSnackCords[0][1]]
        }
        nextSnackCords = coMoveSnack(nextSnackCords, snackCords);
        setSnackCords(nextSnackCords);
        break;
      }
      case directionKey.Up: {
        let nextSnackCords = snackCords.slice();
        if((nextSnackCords[0][1] - snackPartSize) < 0){
          nextSnackCords[0] = [nextSnackCords[0][0], squareSize - snackPartSize]
        }else{
          nextSnackCords[0] = [nextSnackCords[0][0], nextSnackCords[0][1] - snackPartSize]
        }
        nextSnackCords = coMoveSnack(nextSnackCords, snackCords);
        setSnackCords(nextSnackCords);
        break;
      }
      case directionKey.Left: {
        let nextSnackCords = snackCords.slice();
        if((nextSnackCords[0][0] - snackPartSize) < 0){
          nextSnackCords[0] = [squareSize - snackPartSize, nextSnackCords[0][1]]
        }else{
          nextSnackCords[0] = [nextSnackCords[0][0] - snackPartSize, nextSnackCords[0][1]]
        }
        nextSnackCords = coMoveSnack(nextSnackCords, snackCords);
        setSnackCords(nextSnackCords);
        break;
      }
      case directionKey.Down: {
        let nextSnackCords = snackCords.slice();
        if((nextSnackCords[0][1] + 2*snackPartSize) > squareSize){
          nextSnackCords[0] = [nextSnackCords[0][0], 0]
        }else{
          nextSnackCords[0] = [nextSnackCords[0][0], nextSnackCords[0][1] + snackPartSize]
        }
        nextSnackCords = coMoveSnack(nextSnackCords, snackCords);
        setSnackCords(nextSnackCords);
        break;
      }
    }

    isGameOver = getIsGameOver();

    requestAnimationFrame(logic);
  }

  function getSnack(){
    let ret = [];
    for(let i = 0; i < snackCords.length; i++){
      const snackStyle = (x : number , y : number) => ({
        left: x,
        top: y
      });
      ret.push(<div className="snack" key={i} style={snackStyle(snackCords[i][0], snackCords[i][1])}>
      </div>)
    }
  
    return ret;
  }

  function getApple(){
    const appleStyle = (x : number , y : number) => ({
      left: x,
      top: y
    });
    return (<div className="apple" style={appleStyle(appleCords[0], appleCords[1])}></div>);
  }

  function OnClickKey(_direction : directionKey){
    if(_direction === directionKey.Up && direction === directionKey.Down){
      return;
    }
    if(_direction === directionKey.Left && direction === directionKey.Rigth){
      return;
    }
    if(_direction === directionKey.Down && direction === directionKey.Up){
      return;
    }
    if(_direction === directionKey.Rigth && direction === directionKey.Left){
      return;
    }
    setDirection(_direction);
  }

  requestAnimationFrame(logic);

  if(!isGameOver){
    return (<>
      <svg viewBox="0 0 100 100" width={squareSize} height={squareSize}>
        <polygon id="leftKey" points="0,0 50,50 0,100" fillOpacity="0" onClick={() => OnClickKey(directionKey.Left)}></polygon>
        <polygon id="upKey" points="0,0 50,50 100,0" fillOpacity="0" onClick={() => OnClickKey(directionKey.Up)}></polygon>
        <polygon id="rightKey" points="100,0 50,50 100,100" fillOpacity="0" onClick={() => OnClickKey(directionKey.Rigth)}></polygon>
        <polygon id="downKey0" points="0,100 50,50 100,100" fillOpacity="0" onClick={() => OnClickKey(directionKey.Down)}></polygon>
      </svg>
      <div className="gameBoard">
        <div id="snack">
          {getSnack()}
        </div>
        {getApple()}
      </div>
  
      
    </>);
  }else{
    return (
      <div className="gameOver">
        <Button variant="contained"onClick={() => startNewGame()}>New Game</Button>
      </div>);
  }
}



function Start() {
  return(<>
    <Game />
  </>)
}

export default Start;
