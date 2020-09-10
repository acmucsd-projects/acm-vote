import React, {useState} from 'react';
import AnswerOption from '../AnswerOption/AnswerOption';
import '../PollBody/PollBody.css';

const SetAnswerOptions = (props) => {
    const [optionInds, setOptionInds] = useState([1, 2]);
    const {visibility, options, setOptions, pollTitle, pollDescription, 
           numForceUpdates, setNumForceUpdates} = props;

    const addOption = () => {
        let updatedOptionInds = optionInds;
        updatedOptionInds.push(optionInds.length + 1);
        setOptionInds(updatedOptionInds);
        let updatedOptions = options;
        updatedOptions.push({ optionName: "", description: "" });
        setOptions(updatedOptions);
        setNumForceUpdates(numForceUpdates + 1);
    }

    /* Function triggered when option title blurs */
    const changeOption = (ind, option) => {
        options[ind - 1].optionName = option;
        console.log(options);
    }

    /* Function triggered when option description blurs */
    const changeDescription = (ind, description) => {
        options[ind - 1].description = description;
        console.log(options);
    }

    let optionList = optionInds.map((ind) =>
        <AnswerOption id={ind} changeOption={changeOption} changeDescription={changeDescription} />)

    return (
        <div className={visibility}>
            <p><span className="create-poll-bold">Title:{'\u00A0'}</span>{pollTitle}</p>
            <p><span className="create-poll-bold">Description:{'\u00A0'}</span>{pollDescription}</p>
            {optionList}
            <div id="add-answer-button" onClick={addOption}>Add answer</div>
        </div>
    )

}

export default SetAnswerOptions;