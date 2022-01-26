const NumPad = ({clickButton}) => {

    return(
        <div className="numPad">
                <button onClick={()=>clickButton('7')}>7</button>
                <button onClick={()=>clickButton('8')}>8</button>
                <button onClick={()=>clickButton('9')}>9</button>
                <button onClick={()=>clickButton('4')}>4</button>
                <button onClick={()=>clickButton('5')}>5</button>
                <button onClick={()=>clickButton('6')}>6</button>
                <button onClick={()=>clickButton('1')}>1</button>
                <button onClick={()=>clickButton('2')}>2</button>
                <button onClick={()=>clickButton('3')}>3</button>
                <button className="minusButton" onClick={()=>clickButton('-')}>-</button>
                <button onClick={()=>clickButton('0')}>0</button>
                <button className="clearButton" onClick={()=>clickButton('clear')}>clear</button>
            </div>
    )
}

export default NumPad