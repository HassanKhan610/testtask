import React, { useState } from 'react';

interface ForgotPasswordData {
  email: string;
}

interface ErrorResponse {
  email?: string[];
  non_field_errors?: string[];
}

const ForgotPasswordForm: React.FC = () => {
  const [formData, setFormData] = useState<ForgotPasswordData>({
    email: '',
  });
  const [errors, setErrors] = useState<ErrorResponse>({});
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/forgot-password/', {
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
        // Handle successful email sending
      }
    } catch (error) {
      console.error('Forgot password error:', error);
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
    <div className="forgot-password-form">
      {success ? (
        <div className="success-message">
          Email sent successfully!
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.email && (
              <div className="error">{errors.email.join(' ')}</div>
            )}
          </div>

          {errors.non_field_errors && (
            <div className="error">
              {errors.non_field_errors.join(' ')}
            </div>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordForm;