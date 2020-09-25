import React, { useState } from 'react';
// import * as d3 from 'd3';
import PieChart from '../components/PieChart/PieChart';
import ResultRow from '../components/ResultRow/ResultRow';
import '../components/PollVoteHome/PollVoteHome.css';
import './style.css';
import { useEffect } from 'react';

const ViewResults = (props) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth * 0.8);

    const { pollTitle, pollDescription, votes, numVotes } = props;

    let voteData = {};
    votes.forEach((option) => {
        voteData[option.optionName] = option.votes;
    })

    const colorArray = ['#E981A0', '#FFD51E', '#81D6FF'];

    const orderedVotes = votes ?
        votes.sort((option1, option2) => {
            console.log(votes);
            return option1.votes > option2.votes;
        }) : [];

    let colorInd = 0;
    const votesTableContent = orderedVotes.map((option) => {
        let percentageString = (option.votes / numVotes * 100).toFixed(2) + "%";
        console.log("current color: " + colorArray[colorInd]);
        return <ResultRow color={colorArray[colorInd++]} optionName={option.optionName}
            percentageString={percentageString} numVotes={option.votes} />
    })

    const redirectToHome = () => {
        window.location.href = "/";
    }

    useEffect(() => {
        setWindowWidth(window.innerWidth);
    })

    return (
        <div className="page-body vote-page-body">
            <h1>{pollTitle}</h1>
            <p className="poll-id-vote">{pollDescription}</p>
            <div id="view-results-center-content">
                <PieChart voteData={voteData} colorArray={colorArray} radius={100} />
                <table>
                    {votesTableContent}
                </table>
                <p>
                Total: 
                    <span id="num-votes">{numVotes}</span>
                votes
                </p>
                <p>Winner: {}</p>
                <button className="vote-buttons" id="view-results-go-home-button" onClick={redirectToHome}>
                    Return Home
            </button>
            </div>
        </div>
    )
}

export default ViewResults;