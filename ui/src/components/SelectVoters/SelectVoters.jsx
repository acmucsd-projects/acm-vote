import React, { useState } from 'react';
import AutoSuggest from 'react-autosuggest';
import members from '../../data/voters.json';
import Voter from '../Voter/Voter';
import '../PollBody/PollBody.css';

const SelectVoters = (props) => {
const [value, setValue] = useState('');
const [suggestions, setSuggestions] = useState([]);

    const { visibility, voters, setVoters, numForceUpdates, setNumForceUpdates } = props;
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
    }

    /* Removes a voter */
    const removeVoter = (voterId) => {
        let updatedVoters = voters;
        let ind = 0;
        while (ind < updatedVoters.length) {
            if (updatedVoters[ind].id === voterId) {
                updatedVoters.splice(ind, 1);
                break;
            }
            ind++;
        }
        setVoters(updatedVoters);
        setNumForceUpdates(numForceUpdates + 1);
    }

    let numVoters = 0;
    let voterList = voters.map((voter) => {
        return <Voter ind={++numVoters} name={voter.name} id={voter.id} removeVoter={removeVoter} />
    })


    /* Autosuggest function that renders the suggestions */
    const renderSuggestion = (suggestion) => {
        return (
            suggestions.some(e => e.id === suggestion.id) && 
            !voters.some(e => e.id === suggestion.id) &&
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
        <div className={visibility}>
            <p className="create-poll-bold">Add Voters</p>
            <AutoSuggest
                suggestions={members}
                onSuggestionsFetchRequested={onSuggestionFetchRequested}
                onSuggestionsClearRequested={onSuggestionClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
            <table className="poll-voter-table">
                <tbody>
                    {voterList}
                </tbody>
            </table>
            <div className="radio-containers">
                <input name="notify" type="checkbox" />
                <label for="notify">Send email notifications reminding people to vote</label>
            </div>
        </div>
    );
}

export default SelectVoters;