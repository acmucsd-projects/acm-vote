import React from 'react';
import * as d3 from 'd3';
import ResultRow from '../components/ResultRow/ResultRow';
import '../components/PollVoteHome/PollVoteHome.css';
import './style.css';

const ViewResults = (props) => {
    const {pollTitle, pollDescription, votes, numVotes} = props;

    const orderedVotes = votes ? 
    votes.sort((option1, option2) => {
        console.log(votes);
        return option1.votes > option2.votes;
    }) : [] ;

    const votesTableContent = orderedVotes.map ((option) => {
        let percentageString = (option.votes / numVotes * 100).toFixed(2) + "%";
        return <ResultRow optionName={option.optionName} percentageString={percentageString} numVotes={option.votes}/>
    })

    const redirectToHome = () => {
        window.location.href="/";
    }

    return (
        <div className="page-body vote-page-body">
            <h1>{pollTitle}</h1>
            <p className="poll-id-vote">{pollDescription}</p>
            <table>
                {votesTableContent}
            </table>
            <p>Total: {numVotes} votes</p>
            <button className="vote-buttons" id="view-results-go-home-button" onClick={redirectToHome}>
                Return Home
            </button>
        </div>
    )
}

export default ViewResults;