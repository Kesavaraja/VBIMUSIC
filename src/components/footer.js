import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Footer extends React.Component {
    render() {
        return (
            <div className='footer'>
                <div className='text-center'>Copyright VBI Music.</div>
                <ToastContainer />
            </div>

        )
    }
}
export default Footer;