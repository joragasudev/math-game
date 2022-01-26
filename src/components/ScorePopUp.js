const ScorePopUp = ({score,bestScore,clickHandler})=>{

    return(
        <span className="scorePopUpContainer">
            <div className="scorePopUp">
                <p>Game Over!</p>
                <p>Score: {score}</p>
                <p>High score: {bestScore}</p>
                <button onClick={clickHandler}>Play Again</button>
                <div id="twitterInfo">
                 <img className="twitterIcon" src="/assets/twitter.svg" alt="twitter"/>
                 <a href="https://twitter.com/joragasudev" target="_blank" rel="noreferrer">@joragasudev</a>
                </div>
            </div>
        </span>
    )
}

export default ScorePopUp;