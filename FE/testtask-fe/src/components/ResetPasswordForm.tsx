import React, { useState } from 'react';

interface ResetPasswordData {
  uidb64: string;
  token: string;
  new_password: string;
}

interface ErrorResponse {
  new_password?: string[];
  non_field_errors?: string[];
}

const ResetPasswordForm: React.FC = () => {
  const [formData, setFormData] = useState<ResetPasswordData>({
    uidb64: '',
    token: '',
    new_password: '',
  });
  const [errors, setErrors] = useState<ErrorResponse>({});
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/reset-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setErrors(data);
      } else {
        setSuccess(true);
        setErrors({});
        // Handle successful password reset
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({ non_field_errors: ['An unexpected error occurred'] });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="reset-password-form">
      {success ? (
        <div className="success-message">
          Password reset successfully!
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>UIDB64</label>
            <input
              type="text"
              name="uidb64"
              value={formData.uidb64}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>Token</label>
            <input
              type="text"
              name="token"
              value={formData.token}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.new_password && (
              <div className="error">{errors.new_password.join(' ')}</div>
            )}
          </div>

          {errors.non_field_errors && (
            <div className="error">
              {errors.non_field_errors.join(' ')}
            </div>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordForm;