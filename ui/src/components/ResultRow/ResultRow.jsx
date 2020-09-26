import React from 'react';
import './ResultRow.css';

const ResultRow = (props) => {
    const {color, optionName, percentageString, numVotes} = props;
    const colorLegend = <div style={{width:"14px", height:"14px", backgroundColor:color}}>{'\u00A0'}</div>
    return  (
        <tr className="poll-result-row">
            <td>{colorLegend}</td>
            <td className="poll-result-optionName">{optionName}</td>
            <td className="poll-result-percentage">{percentageString}</td>
            <td className="poll-result-votes">{numVotes} votes</td>
        </tr>
    );
}

export default ResultRow;