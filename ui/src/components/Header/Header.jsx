import React from 'react';
import './Header.css';
import sampleProfilePic from '../../img/hamburger-menu.png';
import sampleProfilePic2 from '../../img/acm-logo-final.png';

/* Profile photo link  be passed in from the Page component */
const Header = (props) => {
    return(
        <div className="header">
            <img className="acm-logo" src={sampleProfilePic2} alt="Profile Pic"/>
            <img className="profile-pic" src={sampleProfilePic} alt="Profile Pic"/>
        </div>
    );
}

export default Header;