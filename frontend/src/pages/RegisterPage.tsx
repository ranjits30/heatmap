import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/api/auth/register', { username, password });
      // After successful registration, redirect to login
      navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('Username already exists');
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <section className="auth-card glass-card">
        <h1>Employee Skill Evaluation</h1>
        <p>Create a new account</p>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Username
            <input 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required
              minLength={3}
              placeholder="Choose a username"
            />
          </label>
          <label>
            Password
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              minLength={6}
              placeholder="At least 6 characters"
            />
          </label>
          <label>
            Confirm Password
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required
              placeholder="Confirm password"
            />
          </label>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: '#00d4ff', textDecoration: 'none' }}>Sign in here</Link>
        </p>
      </section>
    </div>
  );
}

export default RegisterPage;
