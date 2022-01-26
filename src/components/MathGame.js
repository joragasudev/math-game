import './css/styles.css'
import Operation from './Operation'
import NumPad from './NumPad'
import ScorePopUp from './ScorePopUp';
import SoundManager from '../assets/sounds';
import { useState ,useEffect, useReducer,useRef} from 'react'

const FIRST_OPEARATIONS_AMOUNT = 5;
const TIME = 45;
const WRONG_HANDICAP_TIME = 1.4;
const SM = new SoundManager();
let OPERATIONS_ID = 0;


const getNewOperation = ()=>{
    OPERATIONS_ID++;
    let operand1,operand2,operator,result;
    const operators = ['+','-','*'];

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min+1)) + min;
    }

    operator = operators[Math.floor(Math.random() * operators.length)];

    switch (operator) {
        case '+':{  operand1 = getRandomInt(0,20);
                    operand2 = getRandomInt(0,20);
                    result = operand1 + operand2;
                    break;}
        case '-':{  operand1 = getRandomInt(0,10);
                    operand2 = getRandomInt(0,9); 
                    result = operand1 - operand2;
                    break;}
        case '*':{  operand1 = getRandomInt(0,9);
                    operand2 = getRandomInt(0,9);
                    result = operand1 * operand2;
                    break;}
        default: break;
    }
    return {id:OPERATIONS_ID.toString(),
            operand1:operand1.toString(),
            operand2:operand2.toString(),
            operator:operator ==='*'? 'x' : operator,
            result:result.toString(),
            // result:'1', //(to easy test)
            current:false,
            input:'',
            veredict:''}
}
const firstOperations = ()=>{
    let arr = [];
    for (let index = 0; index < FIRST_OPEARATIONS_AMOUNT; index++) {
        arr.push(getNewOperation());
    }
    arr[0].current = true;
    return arr;
}
const cloneOperationsState =(state)=>{
    //clones a shallow state only.
    return state.map ( (operation) =>{
        return {...operation};
    });
}
const operations = firstOperations();

const reducer = (state,action)=> {
    //action ={ type : 'string', payload: any}
    if (action.type === 'reset'){
        return firstOperations();
    }

    let newState  = cloneOperationsState(state);
    switch(action.type){
        case 'input':{
            for (let i = 0; i < newState.length; i++) {
                let operation = newState[i]
                if(operation.current){
                    switch (action.payload) {
                        case '0': if(operation.input!=='0' && operation.input!=='-0')
                                    operation.input= operation.input + '0';
                                    break;
                        case '-': operation.input = operation.input[0]!=='-' ?
                                    operation.input= '-'+ operation.input:
                                    operation.input= operation.input.substring(1,operation.input.length);
                                    break;
                        default:{
                            if(operation.input.length<2 && (operation.input !== '0'))
                                operation.input = operation.input + action.payload; 
                            break;}
                    }
                    break;
                }
            }
            return newState;
        }
        case 'clear':{
                    for (let i = 0; i < newState.length; i++) {
                        if(newState[i].current){
                            newState[i].input = '';
                            break;
                        }
                    }
                    return newState;   
                    }
        case 'next':{
                    newState.push(getNewOperation());
                    //newState.shift();
                    for (let i = 0; i < newState.length; i++) {
                        if(newState[i].current){
                            newState[i].current = false;
                            newState[i].veredict = action.payload;
                            newState[i+1].current = true;
                            break;
                        }
                    }
                    return newState;
                    }
        default:
                return state
    }
}

    

const MathGame = ()=>{
    const [operationsState,operationsDispatch] = useReducer(reducer,operations);
    const [secondsLeft,setSecondsLeft] = useState(TIME);
    const [viewScorePopUp,setShowScorePopUp] = useState(false);
    const [sound,setSound]=useState(false);
    const stateRef = useRef({
        score:0,
        highScore: localStorage.getItem('highscore')!== null? parseInt(localStorage.getItem('highscore'),10) : 0,
        gameStarted:false,
        scrollPixels:0,
        scrollTimes:1,
        seconds:TIME
    });

    const clickButtonHandler = (button) => {
        if(sound) 
            SM.playAudio('button');

        if(button==='clear'){
            operationsDispatch({type:'clear'}); 
            return;
        }
        operationsDispatch({type:'input', payload:button});
    };

    const resetGame = ()=>{
        stateRef.current = {...stateRef.current,seconds: TIME,gameStarted:false,score:0};
        setSecondsLeft(TIME); 
        setShowScorePopUp(false);
        operationsDispatch({type:'reset'});
        document.getElementById('listContainer').style.transform = 'translateY(0px)';
        stateRef.current = {...stateRef.current,scrollTimes:1};
    }

    function showPopUp(){
        if(sound) SM.playAudio('gameover');
        return(<ScorePopUp 
            score={stateRef.current.score} 
            bestScore={stateRef.current.highScore} 
            clickHandler={resetGame}
        />);
    }

    const scrollOperationList = ()=>{
        //Scroll the operations list by list item height.
        const elm = document.getElementById('listContainer');
        //el clientHeight mas el margen del primer hijo(1er li) del primer hijo (ul) de id (listcontainer).
        elm.style.transform = 'translateY(-'+(stateRef.current.scrollPixels * stateRef.current.scrollTimes).toString()+'px)';
        stateRef.current = {...stateRef.current,scrollTimes:(stateRef.current.scrollTimes+1)};
    }
    
    //INIT
   useEffect(()=>{
        if (localStorage.getItem('highscore')===null)
            localStorage.setItem('highscore', '0');

        window.addEventListener("keydown", function (event) {
            if (event.defaultPrevented) {
                return; 
            }
            if(stateRef.current.seconds>0)
            switch (event.key) {
                case "1":clickButtonHandler('1');break;
                case "2":clickButtonHandler('2');break;
                case "3":clickButtonHandler('3');break;
                case "4":clickButtonHandler('4');break;
                case "5":clickButtonHandler('5');break;
                case "6":clickButtonHandler('6');break;
                case "7":clickButtonHandler('7');break;
                case "8":clickButtonHandler('8');break;
                case "9":clickButtonHandler('9');break;
                case "0":clickButtonHandler('0');break;
                case "-":clickButtonHandler('-');break;
                case "Backspace": clickButtonHandler('clear');break;
                default:return;
            }
            event.preventDefault();
            }, true);

        //searching for : listContainer(div) ->  <lu> ->  <li>.height    
        let totalHeight = document.getElementById('listContainer').firstElementChild.firstElementChild
        .getBoundingClientRect().height;//Warnign, this do not considerate margin.
        stateRef.current = {...stateRef.current,scrollPixels:(totalHeight)};
    },[]);
    

    useEffect(()=>{
        let wrongHandicapTime_TimeOutID;
        const operation = operationsState.filter((op)=>op.current)[0];
        const input = operation.input;

        if(operation!== null && input!=='' && input!=='-'){
            if (!stateRef.current.gameStarted){
                //Start game
                stateRef.current = {...stateRef.current,gameStarted:true};
                let timerID = setInterval(() => {
                    stateRef.current = {...stateRef.current,seconds: (stateRef.current.seconds - 1)};
                    setSecondsLeft(stateRef.current.seconds);
                }, 1000);

                //End game in TIME seconds.
                setTimeout(()=>{
                    clearInterval(timerID);
                    if (stateRef.current.score > stateRef.current.highScore){
                        stateRef.current = {...stateRef.current, highScore: stateRef.current.score };
                        localStorage.setItem('highscore', stateRef.current.score.toString()); 
                    }
                    setShowScorePopUp(true);

                }, (TIME*1000));
            }

            if(operation.result!==input){
                wrongHandicapTime_TimeOutID = setTimeout(()=>{
                    operationsDispatch({type:'next',payload:'incorrect'});
                    if(sound) SM.playAudio('incorrect');
                    scrollOperationList();
                }, WRONG_HANDICAP_TIME * 1000);
                return(()=>{clearTimeout(wrongHandicapTime_TimeOutID);})
            }else{
                operationsDispatch({type:'next',payload:'correct'});
                if(sound) SM.playAudio('correct');
                scrollOperationList();
                stateRef.current = {...stateRef.current,score:stateRef.current.score+1};
            }
        }
    } ,[operationsState,sound] );
    

    return (
        <div>
        {viewScorePopUp === true? showPopUp(): null}
        <div className="gameContainer">
        <div className="game">
            <div className="GUI">
                {sound?
                 <img style={{width:'1rem'}} src="/assets/sound_on.svg" alt="Vol on" onClick={()=>setSound(!sound)}/>
                :<img style={{width:'1rem'}} src="/assets/sound_off.svg" alt="Vol off" onClick={()=>setSound(!sound)}/>
                }
                <p>Time: {secondsLeft}  </p>
                <p>Score: {stateRef.current.score}  </p>
            </div>
            <div className="display">
                <div id='listContainer' className='listContainer'>
                    <ul>
                        {operationsState.map((operation,index)=>{
                            return(
                                <Operation key={operation.id}
                                    operand1={operation.operand1} 
                                    operand2={operation.operand2} 
                                    operator={operation.operator}
                                    input = {operation.input}
                                    veredict = {operation.veredict}
                                >
                            </Operation>)
                        })}
                    </ul>
                </div>
            </div>
            <NumPad clickButton = {clickButtonHandler}/>
           
        </div>
        </div>
        </div>
    )

}

export default MathGame;