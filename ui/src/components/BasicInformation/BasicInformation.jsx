import React from 'react';
import '../PollBody/PollBody.css';

const BasicInformation = (props) => {

    const {visibility, setPollTitle, setPollDescription, setPollType, setPollExpiration, privacy, setPrivacy} = props;

    const changeTypeToDate = (e) => {
        e.target.type = "date";
    }

    /* Changes the type of the "date" input to "text", if no date selected */
    const changeTypeToText = (e) => {
        if (e.target.value) {
            setPollExpiration(e.target.value);
            return;
        }
        e.target.type = "text";
    }

    const updatePollTitle = (e) => {
        setPollTitle(e.target.value);
    }

    const updatePollDescription = (e) => {
        setPollDescription(e.target.value);
    }

    const updatePollType = (e) => {
        if (e.target.value === 'multiple-choice') { setPollType('Multiple Choice'); }
        setPollType('Ranked Choice');
    }

    const privatePublic = {
        marginLeft: '18.5vw'
    }
    // The first page defining basic meeting information
    return (
        <div className={visibility}>
            <input className="create-poll-field" onBlur={updatePollTitle} name="name" placeholder="Poll Title" />
            <input className="create-poll-field" onBlur={updatePollDescription} name="description" placeholder="Description of Poll" />
            <select className="create-poll-field create-poll-field-select" onBlur={updatePollType} name="type">
                <option value="" disabled selected>Poll Type</option>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="ranked-choice">Ranked Choice</option>
            </select>
            <input className="create-poll-field" name="date" type="text"
                onFocus={changeTypeToDate} onBlur={changeTypeToText}
                placeholder="Select the last day to vote" />
            <p style={privatePublic}>Do you want to create a Private or Public poll?</p>
            <div className="radio-containers">
                <input type="radio" name="privacy" id="public" value="public"
                    checked={privacy === 'public'} onClick={() => setPrivacy('public')} />
                <label for="public">Public so all ACM members can view</label>
            </div>
            <div className="radio-containers">
                <input type="radio" name="privacy" id="private" value="private"
                    checked={privacy === 'private'} onClick={() => setPrivacy('private')} />
                <label for="private">Private so only ACM members I select can view</label><br></br>
            </div>
        </div>
    );
}

export default BasicInformation;
