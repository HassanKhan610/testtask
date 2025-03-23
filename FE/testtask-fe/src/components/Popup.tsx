import React from 'react';
import ForgotPasswordForm from './ForgotPasswordForm';
import ResetPasswordForm from './ResetPasswordForm';
import { useState } from 'react';

interface PopupProps {
  type: 'forgot-password' | 'reset-password';
}

const Popup: React.FC<PopupProps> = ({ type }) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {type === 'forgot-password' && (
        <button onClick={togglePopup}>Forgot Password</button>
      )}
      {type === 'reset-password' && (
        <button onClick={togglePopup}>Reset Password</button>
      )}
      {isOpen && (
        <div className="popup">
          <div className="popup-content">
            {type === 'forgot-password' && <ForgotPasswordForm />}
            {type === 'reset-password' && <ResetPasswordForm />}
            <button onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
