import React, { useState } from 'react';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const RankedChoiceOption = (props) => {
    const { availableOptions, setAvailableOptions } = props;
    const [selection, setSelection] = useState(null);

    const chooseOption = (option) => {
        if(selection) {availableOptions.push(selection);}
        setAvailableOptions(
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
        setSelection(option);
    } 

    const optionFields = availableOptions.map((option) => {
        return (
            <Menu.Item>
                <div className="ranked-choice-option" onClick={() => chooseOption(option)}>
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
                {selection ? selection.optionName : "Please Choose an Option"}
            </a>
        </Dropdown>
    )
}

export default RankedChoiceOption;