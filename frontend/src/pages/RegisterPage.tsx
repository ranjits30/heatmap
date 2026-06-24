import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

type RegisterResponse = {
  token?: string;
  roles?: string[];
};

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
      await axios.post<RegisterResponse>('/api/auth/register', { username, password });
      navigate('/login', { state: { message: 'Registration successful. Sign in to start your educator journey.' } });
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
    <div className="auth-page auth-page-register">
      <div className="auth-orb auth-orb-a" />
      <div className="auth-orb auth-orb-b" />
      <div className="auth-shell auth-shell-register">
        <section className="auth-hero auth-hero-register">
          <div className="auth-badge auth-badge-register">Educator onboarding</div>
          <h1>Join the full stack educator journey.</h1>
          <p>
            Create your educator account and rate skills across frontend, backend, cloud,
            data, AI, and behavioural competencies.
          </p>

          <div className="auth-feature-grid">
            <div className="auth-feature-card">
              <span>Technical stacks</span>
              <strong>15+ card categories</strong>
              <small>Programming, mobile, backend, cloud, security, data, and more.</small>
            </div>
            <div className="auth-feature-card">
              <span>Behavioural growth</span>
              <strong>Voice &amp; core skills</strong>
              <small>Capture the human side of delivery, collaboration, and leadership.</small>
            </div>
          </div>

          <div className="auth-stack-cloud">
            {['Programming', 'Frontend', 'Backend', 'Database', 'API', 'Cloud', 'AI', 'Behavioural'].map((stack) => (
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
                <div className="auth-card-kicker">Create account</div>
                <h2>Register as an educator</h2>
              </div>
              <div className="auth-card-avatar">FS</div>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <label className="auth-field">
                <span>Username</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  placeholder="Choose a username"
                />
              </label>

              <label className="auth-field">
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                />
              </label>

              <label className="auth-field">
                <span>Confirm password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm password"
                />
              </label>

              {error && <div className="auth-error">{error}</div>}

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Register educator account'}
              </button>
            </form>

            <div className="auth-card-footer">
              <p>
                Already have an account? <Link to="/login">Sign in here</Link>
              </p>
              <p className="auth-footnote">Admin access is issued separately after onboarding.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default RegisterPage;
