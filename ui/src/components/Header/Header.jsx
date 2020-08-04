import React from 'react';
import profilePic from '../../img/profile.png';
import './Header.css';

/* Profile photo link  be passed in from the Page component */
const Header = (imgLink) => {
    return(
        <div className="header">
            <img className="profile-pic" src={profilePic} alt="Profile Pic"/>
        </div>
    );
}

export default Header;