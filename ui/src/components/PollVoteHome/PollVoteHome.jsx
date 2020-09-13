import React, {useState, useEffect} from 'react';
import './PollVoteHome.css';

const PollVoteHome = (props) => {
    const {pollTitle, pollId, pollDescription, deadline} = props;
    const [deadlineDate, setDeadlineDate] = useState();

    useEffect(() => {
        setDeadlineDate(new Date(deadline));
    })

    const voteButton = (
        <button className="vote-buttons" id="vote-button">Vote</button>
    );

    const viewResultsActivated = (
        <button className="vote-buttons" id="view-results-button-activated">View Results</button>
    )

    const viewResultsDisabled = (
        <button className="vote-buttons" id="view-results-button-disabled">View Results</button>
    )

    const viewResultsButton = () => {
        const currDate = new Date();
        if(!deadlineDate){return;}
        return currDate.getTime() <= deadlineDate.getTime() ? viewResultsDisabled : viewResultsActivated;
    }

    return (
        <div className="page-body" id="vote-page-body">
            <h1>{pollTitle}</h1>
            <p id="poll-id-vote">Poll ID: {pollId}</p>
            <p>Vote by: {deadline}</p>
            <p>{pollDescription}</p>
            <div id="vote-buttons-container">
                {voteButton}
                {viewResultsButton()}
            </div>
        </div>
    )
}

export default PollVoteHome;