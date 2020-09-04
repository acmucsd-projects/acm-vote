import React, { useState, useEffect } from 'react';
import AutoSuggest from 'react-autosuggest';
import Voter from '../../components/Voter/Voter';
import members from '../../data/voters.json';
import './PollBody.css';

const PollBody = () => {
    const [currPage, setCurrPage] = useState(0);
    const [privacy, setPrivacy] = useState('private');
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [voters, setVoters] = useState([]);

    /* Note to readers: I kind of can't put the pages of the form as their own components? 
     * Because we need to be able to access all the input values on form submit right
     * But this code does look really messy with that layout especially since useEffect and useState
     * Can only be put on the outermost layer, so if you have an idea of how to change the structure
     * Please do let me know and I will change it for sure!
     * /

    /* Removes a voter */
    const removeVoter = (voterId) => {
        console.log("Remove voter called on id: " + voterId);
        let updatedVoters = voters;
        let ind = 0;
        while (ind < updatedVoters.length) {
            if (updatedVoters[ind].id === voterId) {
                updatedVoters.splice(ind, 1);
                break;
            }
            ind++;
        }
        console.log("Updated Voters after remove: " + updatedVoters);
        setVoters(updatedVoters);
    }
    
    let numVoters = 0;
    let voterList = voters.map((voter) => {
        return <Voter ind={++numVoters} name={voter.name} id={voter.id} removeVoter={removeVoter} />
    })

    /* Reloads the list of voters on voters change */
    useEffect(() => {
        numVoters = 0;
        voterList = voters.map((voter) => {
            return <Voter ind={++numVoters} name={voter.name} id={voter.id} removeVoter={removeVoter} />
        })
    }, [voters])

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
    }

    /* Top button function: Creating the Poll */
    const createPoll = () => {
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
    }

    /* Bottom button: Determines which function to execute depending on the current page */
    const bottomButtonFunction = () => {
        if (currPage === 0) { cancelCreation(); }
        else { goBacktoLastPage(); }
    }

    /*-----------------------------------------BASIC INFO PAGE-------------------------------------- */
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
            <div className={getVisibility(0)}>
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

    /*-----------------------------------------SELECT VOTERS PAGE-------------------------------------- */
    const selectVoters = () => {

        /* Autosuggest function to run to get suggestions */
        const getSuggestions = (value) => {
            const inputValue = value.toLowerCase();
            const inputLength = value.length;

            return inputLength === 0 ? [] :
                members.filter(member => member.name.toLowerCase().includes(inputValue));
        }

        /* Autosugget function that clears the input field after selecting an option */
        const getSuggestionValue = (voter) => "";

        /* Adds a selected suggestion to voters */
        const addVoter = (voter) => {
            let updatedVoters = voters;
            updatedVoters.push(voter);
            setVoters(updatedVoters);
            console.log(voters);
        }


        /* Autosuggest function that renders the suggestions */
        const renderSuggestion = (suggestion) => {
            return (
                suggestions.some(e => e.name === suggestion.name) &&
                <div className="autosuggest-suggestion" onClick={() => addVoter(suggestion)}>
                    {suggestion.name} <span>({suggestion.email})</span>
                </div>
            );
        }

        /* Autosuggest function to run when suggestion is updated */
        const onSuggestionFetchRequested = ({ value }) => {
            setSuggestions(getSuggestions(value));
        }

        /* Autosuggest function to run when suggestion is cleared */
        const onSuggestionClearRequested = () => { setSuggestions([]); }

        /* Autosuggest function when input function changes */
        const onChange = (e, { newValue }) => {
            setValue(newValue);
        }

        /* Properties of the input box */
        const inputProps = {
            placeholder: 'Type a name here...',
            value,
            onChange: onChange
        }
        
        return (
            <div className={getVisibility(1)}>
                <AutoSuggest
                    suggestions={members}
                    onSuggestionsFetchRequested={onSuggestionFetchRequested}
                    onSuggestionsClearRequested={onSuggestionClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                />
                <table className="poll-voter-table">
                    {voterList}
                </table>
            </div>
        );
    }

    /* The actual body of the poll */
    return (
        <div className="poll-body">
            <h1>{getTitle(currPage)}</h1>
            <form>
                {basicInformation()}
                {selectVoters()}
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