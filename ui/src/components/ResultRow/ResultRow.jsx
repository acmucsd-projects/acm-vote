import React from 'react';
import './ResultRow.css';

const ResultRow = (props) => {
    const {optionName, percentageString, numVotes} = props;
    return  (
        <tr className="poll-result-row">
            <td className="poll-result-optionName">{optionName}</td>
            <td className="poll-result-percentage">{percentageString}</td>
            <td className="poll-result-votes">{numVotes} votes</td>
        </tr>
    );
}

export default ResultRow;