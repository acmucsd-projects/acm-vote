import React, { useState } from 'react';
import { Menu, Dropdown } from 'antd';

const RankedChoiceOption = (props) => {
    const { id, choices, setChoices, availableOptions, setAvailableOptions } = props;
    const [selection, setSelection] = useState(null);

    const chooseOption = (option) => {
        if(selection) {availableOptions.push(selection);}
        setSelection(option);
        setAvailableOptions (
            [
                {
                    id: -1, 
                    optionName: "Please Select an Option",
                    description: "",
                    votes: -1
                },
                ...availableOptions.filter((opt) => opt.id != -1 && opt.id != option.id)
            ]
        );
        const choicesCpy = choices.slice();
        choicesCpy[id] = option.id;
        setChoices(choicesCpy);
    } 

    const optionFields = availableOptions.map((option) => {
        return (
            <Menu.Item>
                <div onClick={() => chooseOption(option)}>
                    {option.optionName} 
                </div>
            </Menu.Item>
        )
    })

    const menu = (
        <Menu>
            {optionFields}
        </Menu>
    );

    return (
        <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                {selection ? selection.optionName : "Please Select an Option"}
            </a>
        </Dropdown>
    )
}

export default RankedChoiceOption;
