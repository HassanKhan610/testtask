import React, { useState } from 'react';

interface SignupData {
  username: string;
  email: string;
  password: string;
}

interface ErrorResponse {
  username?: string[];
  email?: string[];
  password?: string[];
  non_field_errors?: string[];
}

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<SignupData>({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<ErrorResponse>({});
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
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
        // Handle successful registration (e.g., redirect)
      }
    } catch (error) {
      console.error('Registration error:', error);
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
    <div className="signup-form">
      {success ? (
        <div className="success-message">
          Registration successful! Check your email for verification.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.username && (
              <div className="error">{errors.username.join(' ')}</div>
            )}
          </div>

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

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.password && (
              <div className="error">{errors.password.join(' ')}</div>
            )}
          </div>

          {errors.non_field_errors && (
            <div className="error">
              {errors.non_field_errors.join(' ')}
            </div>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Sign Up'}
          </button>
        </form>
      )}
    </div>
  );
};

export default SignupForm;