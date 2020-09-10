import React, { useState, useEffect } from 'react';

import BasicInformation from '../BasicInformation/BasicInformation';
import SelectVoters from '../SelectVoters/SelectVoters';
import SetAnswerOptions from '../SetAnswerOptions/SetAnswerOptions';
import ConfirmDetails from '../ConfirmDetails/ConfirmDetails';
import API from '../../API';
import './PollBody.css';

const PollBody = () => {
    const [currPage, setCurrPage] = useState(0);
    const [privacy, setPrivacy] = useState('private');

    const [pollTitle, setPollTitle] = useState("");
    const [pollDescription, setPollDescription] = useState("");
    const [pollType, setPollType] = useState("");
    const [pollExpiration, setPollExpiration] = useState();
    const [voters, setVoters] = useState([]);
    const [numForceUpdates, setNumForceUpdates] = useState(0); // BAD PRACTICE ;-;
    const [options, setOptions] = useState([{optionName: "", description:""}, {optionName:"", description:""}]);

    /* Use an array to store page names to make the code more concise :0 */
    const pageNames = ['Create Poll', 'Select Voters', 'Set Answer Options', 'Confirm Details', 'Expiration'];

    /* Returns whether a section is currently visible */
    const getVisibility = (pageNumber) => {
        return pageNumber === currPage ? "visible" : "hidden";
    }

    /* Returns the title of the current page */
    const getTitle = () => {
        if (currPage <= 4) { return pageNames[currPage]; }
        return "Invalid Page";
    }

    /* Top Button: Title */
    const getTopButtonText = () => {
        if (currPage === 3) { return "Finish"; }
        return "Continue";
    }

    /* Top button function: Continuing to next page */
    const continueToNextPage = () => {
        // This is a special case because we will proceed to different pages depending on privacy settings
        if (currPage === 0) {
            if (privacy === 'private') { setCurrPage(1); }
            else { setCurrPage(2); }
        }
        else { setCurrPage(currPage + 1); }
        window.scrollTo(0, 0);
    }

    /* Top button function: Creating the Poll */
    const createPoll = async() => {
        const payload = {
            pollTitle: pollTitle,
            pollDescription: pollDescription,
            options: options,
            deadline: pollExpiration
        }
        await API.createPoll(payload);
        console.log("Yeet");
    }

    /* Top button: Determines which function to execute depending on the current page */
    const topButtonFunction = () => {
        if (currPage === 3) { createPoll(); }
        else { continueToNextPage(); }
    }

    /* Bottom button: title */
    const getBottomButtonText = () => {
        if (currPage === 0) { return "Cancel"; }
        return "Back";
    }

    /* Bottom button function: Cancels form creation */
    const cancelCreation = () => {
        console.log("Cancelled :((");
    }

    /* Bottom button function: Goes back */
    const goBacktoLastPage = () => {
        // Special handling of Page 'Set Answer Options'
        if (currPage === 2) {
            if (privacy === 'private') { setCurrPage(1); }
            else { setCurrPage(0); }
        }
        else { setCurrPage(currPage - 1); }
        window.scrollTo(0, 0);
    }

    /* Bottom button: Determines which function to execute depending on the current page */
    const bottomButtonFunction = () => {
        if (currPage === 0) { cancelCreation(); }
        else { goBacktoLastPage(); }
    }

    /* ------------------------------------ The actual body of the poll ----------------------------------- */
    return (
        <div className="poll-body">
            <h1>{getTitle(currPage)}</h1>
            <form>
                <BasicInformation visibility={getVisibility(0)}
                setPollTitle={setPollTitle} setPollDescription={setPollDescription}
                setPollType={setPollType} setPollExpiration={setPollExpiration} 
                privacy={privacy} setPrivacy={setPrivacy}/>

                <SelectVoters visibility={getVisibility(1)} voters={voters} setVoters={setVoters} 
                numForceUpdates={numForceUpdates} setNumForceUpdates={setNumForceUpdates} />

                <SetAnswerOptions visibility={getVisibility(2)} options={options} setOptions={setOptions}
                pollTitle={pollTitle} pollDescription={pollDescription}
                numForceUpdates={numForceUpdates} setNumForceUpdates={setNumForceUpdates} />
                
                <ConfirmDetails visibility={getVisibility(3)} options={options}
                pollTitle={pollTitle} pollDescription={pollDescription}
                pollType={pollType} pollExpiration={pollExpiration} privacy={privacy}/>
            </form>
            <div className="nav-buttons">
                <button className="create-poll-field nav-button" id="top-button" onClick={topButtonFunction}>
                    {getTopButtonText()}
                </button>
                <button className="create-poll-field nav-button" id="bottom-button" onClick={bottomButtonFunction}>
                    {getBottomButtonText()}
                </button>
            </div>
        </div>
    );
}

export default PollBody;