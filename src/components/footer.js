import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Footer extends React.Component {
    render() {
        return (
            <div className='footer'>
                <div className='text-center'>Copyright VBI Music.</div>
                <ToastContainer position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover />
            </div>

        )
    }
}
export default Footer;