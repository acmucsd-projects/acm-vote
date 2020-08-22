import React from 'react';
import './Header.css';
import sampleProfilePic from '../../img/profile.png';

/* Profile photo link  be passed in from the Page component */
const Header = (props) => {
    return(
        <div className="header">
            <img className="profile-pic" src={sampleProfilePic} alt="Profile Pic"/>
        </div>
    );
}

export default Header;