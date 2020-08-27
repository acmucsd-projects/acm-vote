import React, { useState } from 'react';
import './PollBody.css';

const PollBody = () => {
    const [currPage, setCurrPage] = useState('basicInformation');
    const [privacy, setPrivacy] = useState('private');

    /* Returns whether a section is currently visible */
    const getVisibility = (pageName) => {
        let classStr = pageName === currPage ? "visible" : "hidden";
        console.log(classStr);
        return classStr;
    }

    /* Returns the title of the current page */
    const getTitle = () => {
        if (currPage === 'basicInformation') { return "Create Poll"; }
        else if (currPage === 'setPrivacy-1' || currPage === 'setPrivacy-2' || currPage === 'setPrivacy-3') { return "Set Privacy"; }
        else if (currPage === 'setAnswerOptions') { return "Set Answer Options"; }
        else if (currPage === 'confirmDetails') { return "Confirm Details"; }
        else if (currPage === 'expiration') { return "Expiration"; }
        return "Invalid Page";
    }

    /* Top Button: Title */
    const getTopButtonText = () => {
        if(currPage === 'confirmDetails'){return "Finish";}
        return "Continue";
    }

    /* Top button function: Continuing to next page */
    const continueToNextPage = () => {
        // This is a special case because we will proceed to different pages depending on privacy settings
        if(currPage === 'basicInformation'){
            if(privacy === 'private'){setCurrPage('setPrivacy-1');}
            else{setCurrPage('setAnswerOptions');}
        }
    }

    /* Top button function: Creating the Poll */
    const createPoll = () => {
        console.log("Yeet");
    }

    /* Top button: Determines which function to execute depending on the current page */
    const topButtonFunction = () => {
        if(currPage === 'confirmDetails'){createPoll();}
        else{continueToNextPage();}
    }

    /* Bottom button: title */
    const getBottomButtonText = () => {
        if(currPage === 'basicInformation'){return "Cancel";}
        return "Back";
    }

    /* Bottom button function: Cancels form creation */
    const cancelCreation = () => {
        console.log("Cancelled :((");
    }

    /* Bottom button function: Goes back */
    const goBacktoLastPage = () => {
        // Special handling of Page 'Set Answer Options'
        if(currPage === 'setAnswerOptions'){
            if(privacy === 'private') {setCurrPage('setPrivacy-3');}
            else {setCurrPage('basicInformation');}
        }
    }

    /* Bottom button: Determines which function to execute depending on the current page */
    const bottomButtonFunction = () => {
        if(currPage === 'basicInformation') {cancelCreation();}
        else {goBacktoLastPage();}
    }

    /* The following sections define the pages of the form separately for display reasons */
    const basicInformation = () => {
        /* Changes the type of the "date" input to "date" */
        const changeTypeToDate = (e) => {
            e.target.type = "date";
        }

        /* Changes the type of the "date" input to "text", if no date selected */
        const changeTypeToText = (e) => {
            if (e.target.value) { return; }
            e.target.type = "text";
        }

        // The first page defining basic meeting information
        return (
            <div className={getVisibility('basicInformation')}>
                <input className="create-poll-field" name="name" placeholder="Name" />
                <input className="create-poll-field" name="description" placeholder="Description" />
                <select className="create-poll-field create-poll-field-select" name="type">
                    <option value="" disabled selected>Poll Type</option>
                    <option value="type1">Public</option>
                    <option value="type2">Private</option>
                </select>
                <input className="create-poll-field" name="date" type="text"
                    onFocus={changeTypeToDate} onBlur={changeTypeToText}
                    placeholder="What is the last day to vote?" />
                <p>Do you want to create a Private or Public poll?</p>
                <div className="radio-containers">
                    <input type="radio" name="privacy" value="public" onClick={() => setPrivacy('public')} />
                    <label for="public">Public so all ACM members can view</label>
                </div>
                <div className="radio-containers">
                    <input type="radio" name="privacy" value="private" checked onClick={() => setPrivacy('private')} />
                    <label for="private">Private so only ACM members I select can view</label><br></br>
                </div>
            </div>
        );
    }

    // The first out of two pages to set privacy of the poll, if set to be private

    return (
        <div className="poll-body">
            <h1>{getTitle(currPage)}</h1>
            <form>
                {basicInformation()}
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