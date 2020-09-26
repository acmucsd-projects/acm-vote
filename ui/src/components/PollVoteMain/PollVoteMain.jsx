import React, { useState } from 'react';
import VoteCompletePopup from '../VoteCompletePopup/VoteCompletePopup';
import '../PollVoteHome/PollVoteHome.css';
import './PollVoteMain.css';
import { notification } from 'antd';

const PollVoteMain = (props) => {
    const [selection, setSelection] = useState(-1);
    const [popupVisible, setPopupVisible] = useState(false);
    const { pollTitle, pollDescription, pollOptions, deadline, pollType, setCurrPage } = props;

    /* Check the deadline again, and check whether the user selected an option */
    const submitVote = () => {
        const currDate = new Date();
        const deadlineDate = new Date(deadline);
        if (currDate > deadlineDate) {
        notification.open({
            key: "poll-expired-on-submit",
            message: "Unable to Vote",
            description: "The deadline to vote has passed. Click this notification to go back to home page!",
            onClick: () => {
                notification.close("poll-expired-on-submit");
                setCurrPage(0);
            }
        });
        }
        else if (selection == -1) { alert("Please select an option"); }
        else {
            document.getElementById('vote-main-body').style.filter = 'blur(10px)';
            setPopupVisible(true);
        }
    }

    /* The vote section for multiple choice questions */
    const multipleChoiceField = pollOptions.map((option, optionInd) => {
        const optionId = "option" + optionInd;
        return (
            <div className="vote-option-box">
                <label for={optionId}>{option.optionName}</label>
                <input type="radio" name="pollOption" id={optionId} onClick={() => setSelection(optionInd)} />
            </div>
        );
    })

    /* The vote section for ranked choice questions */
    const rankedChoiceField = <div>Yeet</div>;

    /* The mapping between poll types and their corrersponding vote section */
    const voteSectionMapping = {
        "multiple-choice" : multipleChoiceField,
        "ranked-choice" : rankedChoiceField
    }

    const optionsSection = pollOptions ? voteSectionMapping[pollType] : <div></div>

    return (
        <div className="page-body vote-page-body">
            <div id="vote-main-body">
                <h1>{pollTitle}</h1>
                <p id="poll-vote-main-description">{pollDescription}</p>
                {optionsSection}
                <p id="poll-vote-main-footer">Please check your vote carefully before submitting</p>
                <div className="vote-buttons-container">
                    <button className="vote-buttons" id="vote-submit-button" onClick={submitVote}>Vote</button>
                </div>
            </div>
            <VoteCompletePopup visible={popupVisible}/>
        </div>
    )
}

export default PollVoteMain;
