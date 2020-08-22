import React, {useState, useEffect} from 'react';
import Header from '../Header/Header'

const PageLayout = (props) => {
    const [isMobile, setMobile] = useState(false);

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        handleWindowSizeChange();

        return function cleanup() {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    },[]);

    /* Renders different views depending on width */
    const handleWindowSizeChange = () => {
        if(window.innerWidth <= 768){
            setMobile(true);
        }else{
            setMobile(false);
        }
    }

    return(
        <div>
            <Header/>
            {props.children}
        </div>
    )
}

export default PageLayout;