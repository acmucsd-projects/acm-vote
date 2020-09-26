import React, { useState } from 'react';
import { notification } from 'antd';
import 'antd/dist/antd.css';
import './HomePageVotePopup.css';

const HomePageVotePopup = (props) => {

    const { popupVisible } = props;

    const [pollID, updatePollID] = useState("");

    const redirectToElection = (e) => {
        if (!pollID) {
            notification.open({
                key: "vote-id-empty",
                message: "Unable to Vote",
                description: "Please enter a vote ID!"
            });

        }
        else {
            notification.close("vote-id-empty");
            window.location.href = `/election/${pollID}`;
        }
    }

    const updateID = (e) => { updatePollID(e.target.value); }

    return (
        popupVisible ?
            <div className={"homepage-vote-popup"}>
                <input placeholder="Poll ID" onBlur={updateID} />
                <button onClick={redirectToElection}>vote</button>
            </div> : <div></div>
    );
}

export default HomePageVotePopup;