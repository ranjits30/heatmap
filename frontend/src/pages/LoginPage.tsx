import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { storeAuthSession } from '../auth';

type LoginResponse = {
  token: string;
  roles?: string[];
};

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      setTimeout(() => setSuccess(''), 5000);
    }
  }, [location.state]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post<LoginResponse>('/api/auth/login', { username, password });
      const roles = response.data.roles || [];
      storeAuthSession(response.data.token, roles);
      navigate('/dashboard', { replace: true });
    } catch {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb-a" />
      <div className="auth-orb auth-orb-b" />
      <div className="auth-shell">
        <section className="auth-hero">
          <div className="auth-badge">Full Stack Educator Platform</div>
          <h1>Learn, rate, and grow across every stack.</h1>
          <p>
            A single workspace for educators and admins to manage skills, review capability gaps,
            and track progress with role-aware dashboards.
          </p>

          <div className="auth-feature-grid">
            <div className="auth-feature-card">
              <span>Educator mode</span>
              <strong>Update skills by stack</strong>
              <small>Rate technical and behavioural strengths in one place.</small>
            </div>
            <div className="auth-feature-card">
              <span>Admin mode</span>
              <strong>Team analytics dashboard</strong>
              <small>Search employees, filter by category, and inspect ratings.</small>
            </div>
          </div>

          <div className="auth-stack-cloud">
            {['Frontend', 'Backend', 'Cloud', 'Data', 'AI', 'Behavioural'].map((stack) => (
              <span key={stack} className="auth-stack-chip">
                {stack}
              </span>
            ))}
          </div>
        </section>

        <section className="auth-card-panel">
          <div className="auth-card-panel-inner">
            <div className="auth-card-header">
              <div>
                <div className="auth-card-kicker">Welcome back</div>
                <h2>Sign in to continue</h2>
              </div>
              <div className="auth-card-avatar">HM</div>
            </div>

            {success && <div className="auth-success">{success}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <label className="auth-field">
                <span>Username</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                />
              </label>

              <label className="auth-field">
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </label>

              {error && <div className="auth-error">{error}</div>}

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <div className="auth-card-footer">
              <p>
                Don&apos;t have an account? <Link to="/register">Register as an educator</Link>
              </p>
              <p className="auth-footnote">Admin accounts are managed separately.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;
