import React from 'react';
import logo from '../Assets/Images/logo.svg'

class Header extends React.Component {
    render() {
        return (
            <div className='row col-md-12'>
                <div className='col-8 text-center'>
                    <img src={logo} height="50px" width="50px" alt="VBI Music" />
                    <span>VBI Music</span>
                </div>
                <div className='col-4 pull-right'>
                    <span>Welcome, Guest</span>
                </div>
            </div>
        )
    }
}
export default Header;