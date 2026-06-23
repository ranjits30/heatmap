import { useEffect, useState } from 'react';
import axios from 'axios';

function DashboardPage() {
  const [employeeCount, setEmployeeCount] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('/api/admin/employees', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployeeCount(response.data.length);
    }

    fetchStats().catch(console.error);
  }, []);

  return (
    <div className="page-shell">
      <div className="dashboard-grid">
        <section className="glass-card summary-card">
          <h2>Employee Dashboard</h2>
          <div className="card-stat">
            <span>Employees</span>
            <strong>{employeeCount}</strong>
          </div>
        </section>
        <section className="glass-card chart-card">
          <h3>Summary</h3>
          <p>Analytics and assessment metrics will appear here.</p>
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;
