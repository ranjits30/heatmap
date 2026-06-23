import { useEffect, useState } from 'react';
import axios from 'axios';

function SkillPage() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSkills() {
      const response = await axios.get('/api/skills');
      setCategories(response.data);
    }

    fetchSkills().catch(console.error);
  }, []);

  return (
    <div className="page-shell">
      <section className="glass-card">
        <h2>Skill Categories</h2>
        <div className="category-list">
          {categories.map((category) => (
            <article key={category.id} className="category-item">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default SkillPage;
