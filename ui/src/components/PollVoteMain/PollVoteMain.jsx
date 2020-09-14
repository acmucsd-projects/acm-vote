import React from 'react';
import '../PollVoteHome/PollVoteHome.css';
import './PollVoteMain.css';

const PollVoteMain = (props) => {
    const { pollTitle, pollDescription, pollOptions } = props;

    let optionInd = 0;
    const optionsSection = pollOptions? pollOptions.map((option) => {
        const optionId = "option" + optionInd;
        optionInd++;
        return (
            <div>
                <input type="radio" name="pollOption" id={optionId} />
                <label for={optionId}>{option.optionName}</label>
            </div>
        );
    }) : <div></div>

    return (
        <div className="page-body vote-page-body">
            <h1>{pollTitle}</h1>
            <p id="poll-vote-main-description">{pollDescription}</p>
            {optionsSection}
            <p>Please check your vote carefully before submitting</p>
            <div className="vote-buttons-container">
            <button className="vote-buttons" id="vote-submit-button">Vote</button>
            </div>
        </div>
    )
}

export default PollVoteMain;