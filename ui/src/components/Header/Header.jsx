import React from 'react';
import './Header.css';

/* Profile photo link  be passed in from the Page component */
const Header = (props) => {
    return(
        <div className="header">
            <img className="profile-pic" src={require(`../../img/${props.imgLink}`)} alt="Profile Pic"/>
        </div>
    );
}

export default Header;