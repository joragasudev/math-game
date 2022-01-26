 const Operation = ({operand1,operand2,operator,input,veredict}) =>{

    const veredictElement = (veredict)=>{
        switch (veredict) {
            case 'correct': return (<img className="correctIcon" src="/assets/check.svg" alt="R"/>);
            case 'incorrect': return (<img className="incorrectIcon" src="/assets/cross.svg" alt="W"/>);     
            default: return (<p></p>);
        }
    }

    return (
        <li className="operation">
            <div className="licontainer">
                <p>{operand1}</p>
                <p>{operator}</p>
                <p>{operand2}</p>
                <p>=</p>
                <p>{input}</p>
                {veredictElement(veredict)}
          </div>
        </li>
    )
}

export default Operation