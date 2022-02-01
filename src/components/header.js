import React from 'react';
import logo from '../Assets/Images/logo.svg'

class Header extends React.Component {
    render() {
        return (
            <div className='row col-md-12'>
                <div className='text-center'>
                    <img src={logo} height="60px" width="60px" alt="VBI Music" />
                    <h4>VBI Music</h4>
                    <hr />
                </div>
            </div>
        )
    }
}
export default Header;