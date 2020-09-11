import React from 'react';
import './Header.css';
<<<<<<< HEAD
=======
import sampleProfilePic from '../../img/profile.png';
>>>>>>> master

/* Profile photo link  be passed in from the Page component */
const Header = (props) => {
    return(
        <div className="header">
<<<<<<< HEAD
            <img className="profile-pic" src={require(`../../img/${props.imgLink}`)} alt="Profile Pic"/>
=======
            <img className="profile-pic" src={sampleProfilePic} alt="Profile Pic"/>
>>>>>>> master
        </div>
    );
}

export default Header;