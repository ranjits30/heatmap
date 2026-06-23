import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      setTimeout(() => setSuccess(''), 5000);
    }
  }, [location]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      localStorage.setItem('authToken', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="page-shell">
      <section className="auth-card glass-card">
        <h1>Employee Skill Evaluation</h1>
        <p>Sign in to continue</p>
        {success && <div style={{ color: '#00ff00', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="primary-button">Login</button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
          Don't have an account? <Link to="/register" style={{ color: '#00d4ff', textDecoration: 'none' }}>Register here</Link>
        </p>
      </section>
    </div>
  );
}

export default LoginPage;
