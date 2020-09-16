import React, {useState} from 'react';
import '../PollVoteHome/PollVoteHome.css';
import './PollVoteMain.css';

const PollVoteMain = (props) => {
    const [selection, setSelection] = useState(-1);
    const { pollTitle, pollDescription, pollOptions } = props;

    let optionInd = 0;
    const optionsSection = pollOptions? pollOptions.map((option) => {
        const optionId = "option" + optionInd;
        optionInd++;
        return (
            <div className="vote-option-box">
                <label for={optionId}>{option.optionName}</label>
                <input type="radio" name="pollOption" id={optionId} onClick={() => setSelection(optionInd -1)} />
            </div>
        );
    }) : <div></div>

    return (
        <div className="page-body vote-page-body">
            <h1>{pollTitle}</h1>
            <p id="poll-vote-main-description">{pollDescription}</p>
            {optionsSection}
            <p id="poll-vote-main-footer">Please check your vote carefully before submitting</p>
            <div className="vote-buttons-container">
            <button className="vote-buttons" id="vote-submit-button">Vote</button>
            </div>
        </div>
    )
}

export default PollVoteMain;