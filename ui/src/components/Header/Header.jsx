import React from 'react';
import './Header.css';
import hamburger from '../../img/hamburger-menu.png';
import acmVoteLogo from '../../img/acm-logo-final.png';

/* Profile photo link  be passed in from the Page component */
const Header = (props) => {
    return(
        <div className="header">
            <img className="acm-logo" src={acmVoteLogo} alt="Acm Logo"/>
            <img className="hamburger" src={hamburger} alt="Profile Pic"/>
        </div>
    );
}

export default Header;