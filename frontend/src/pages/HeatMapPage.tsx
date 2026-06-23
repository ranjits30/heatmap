import { useState, useEffect } from 'react';

const LEVELS = ['', 'Novice', 'Aware', 'Practitioner', 'Proficient', 'Expert'];

const STACKS = [
  {
    id: 'programming',
    name: 'Programming Languages',
    color: '#2F78C4',
    bg: 'linear-gradient(90deg,#2F78C4,#7373D8)',
    skills: [
      { id: 'oop', name: 'Object-Oriented', covers: 'Java, C#, Python' },
      { id: 'procedural', name: 'Procedural', covers: 'C, Pascal' },
      { id: 'functional', name: 'Functional', covers: 'Haskell, Scala' },
      { id: 'scripting', name: 'Scripting', covers: 'Python, JavaScript' },
      { id: 'legacy', name: 'Legacy', covers: 'COBOL' },
    ],
  },
  {
    id: 'mobile',
    name: 'Mobile Tech Stack',
    color: '#06C7CC',
    bg: 'linear-gradient(90deg,#06C7CC,#2F78C4)',
    skills: [
      { id: 'android', name: 'Android', covers: 'Java, Kotlin' },
      { id: 'ios', name: 'iOS', covers: 'Swift, Objective-C' },
      { id: 'crossplatform', name: 'Cross platform', covers: 'JavaScript, Dart, C#' },
      { id: 'emerging', name: 'Emerging', covers: 'Kotlin Multiplatform, TypeScript' },
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend Tech Stack',
    color: '#9333EA',
    bg: 'linear-gradient(90deg,#9333EA,#7373D8)',
    skills: [
      { id: 'corelang', name: 'Core Languages', covers: 'HTML, CSS, JavaScript' },
      { id: 'frameworks', name: 'Frameworks / Libraries', covers: 'React, Angular, Vue' },
      { id: 'styling', name: 'Styling Tools', covers: 'Bootstrap, Tailwind, SASS' },
      { id: 'advanced', name: 'Advanced', covers: 'TypeScript' },
      { id: 'extensions', name: 'Framework extensions', covers: 'Next.js, Nuxt.js' },
    ],
  },
  {
    id: 'backend',
    name: 'Backend Tech Stack',
    color: '#16A34A',
    bg: 'linear-gradient(90deg,#16A34A,#2F78C4)',
    skills: [
      { id: 'springboot', name: 'Spring Boot', covers: 'Java' },
      { id: 'aspnetcore', name: 'ASP.NET Core', covers: '.NET' },
      { id: 'expressjs', name: 'Express.js / NestJS', covers: 'Node.js' },
      { id: 'pythonfws', name: 'Django / Flask / FastAPI', covers: 'Python' },
      { id: 'rails', name: 'Ruby on Rails', covers: 'Ruby' },
      { id: 'laravel', name: 'Laravel', covers: 'PHP' },
      { id: 'gin', name: 'Gin', covers: 'Go' },
      { id: 'auth', name: 'Authentication', covers: 'OAuth, JWT' },
      { id: 'msgqueue', name: 'Message Queues', covers: 'Kafka, RabbitMQ' },
      { id: 'caching', name: 'Caching', covers: 'Redis' },
    ],
  },
  {
    id: 'database',
    name: 'Database',
    color: '#2E308E',
    bg: 'linear-gradient(90deg,#2E308E,#06C7CC)',
    skills: [
      {
        id: 'relationalsql',
        name: 'Relational SQL',
        covers: 'MySQL, PostgreSQL, Oracle, SQL Server',
      },
      {
        id: 'nosql',
        name: 'NoSQL',
        covers: 'MongoDB, Cassandra, DynamoDB, Redis',
      },
    ],
  },
  {
    id: 'api',
    name: 'API',
    color: '#2F78C4',
    bg: 'linear-gradient(90deg,#2F78C4,#06C7CC)',
    skills: [
      { id: 'restapis', name: 'REST APIs', covers: 'Resource-based HTTP APIs' },
      { id: 'graphql', name: 'GraphQL', covers: 'Schema-based query APIs' },
      { id: 'grpc', name: 'gRPC', covers: 'High-performance RPC APIs' },
    ],
  },
  {
    id: 'architecture',
    name: 'Architecture',
    color: '#7373D8',
    bg: 'linear-gradient(90deg,#7373D8,#2F78C4)',
    skills: [
      { id: 'microservices', name: 'Microservices', covers: 'Distributed service-based systems' },
      {
        id: 'serverless',
        name: 'Serverless',
        covers: 'AWS Lambda, Azure Functions, Google Cloud Functions',
      },
    ],
  },
  {
    id: 'testing',
    name: 'Testing',
    color: '#2E308E',
    bg: 'linear-gradient(90deg,#2E308E,#7373D8)',
    skills: [
      { id: 'unittesting', name: 'Unit Testing', covers: 'JUnit, NUnit, PyTest' },
      { id: 'uiautomation', name: 'UI Automation', covers: 'Selenium, Cypress, Playwright' },
      {
        id: 'apitesting',
        name: 'API Testing',
        covers: 'Postman (manual+automation), Rest Assured (Java), SoapUI',
      },
      { id: 'performance', name: 'Performance', covers: 'JMeter, LoadRunner, Gatling' },
      { id: 'securitytesting', name: 'Security', covers: 'OWASP ZAP, Burp Suite' },
      { id: 'specialized', name: 'Specialized', covers: 'Appium, Axe, BrowserStack' },
    ],
  },
  {
    id: 'devopsstack',
    name: 'DevOps',
    color: '#2F78C4',
    bg: 'linear-gradient(90deg,#2F78C4,#2E308E)',
    skills: [
      { id: 'coderepo', name: 'Code Repo', covers: 'Git, GitHub' },
      {
        id: 'cicd',
        name: 'CI/CD',
        covers: 'Jenkins, GitHub Actions, Azure DevOps',
      },
      { id: 'buildtools', name: 'Build', covers: 'Maven, npm' },
      {
        id: 'deploycontainer',
        name: 'Deploy / Containerization',
        covers: 'Docker, Kubernetes',
      },
      {
        id: 'monitoringconfig',
        name: 'Monitoring, Config Mgmt',
        covers: 'Splunk, Prometheus, Grafana, Ansible, Puppet',
      },
    ],
  },
  {
    id: 'agilescrum',
    name: 'Agile / Scrum',
    color: '#7373D8',
    bg: 'linear-gradient(90deg,#7373D8,#06C7CC)',
    skills: [
      { id: 'coreagile', name: 'Core Agile', covers: 'Scrum, Kanban, XP, Lean' },
      { id: 'scaledagile', name: 'Scaled Agile', covers: 'SAFe, LeSS, Nexus, DA' },
      { id: 'hybridagile', name: 'Hybrid', covers: 'Scrumban, Crystal, FDD' },
    ],
  },
  {
    id: 'cloudinfra',
    name: 'Cloud & Infra',
    color: '#06C7CC',
    bg: 'linear-gradient(90deg,#06C7CC,#2E308E)',
    skills: [
      { id: 'cloudplatform', name: 'Cloud platform', covers: 'AWS' },
      { id: 'multicloud', name: 'Multicloud', covers: 'Azure, GCP' },
      { id: 'virtualization', name: 'Virtualization', covers: 'VMware, SDDC' },
      {
        id: 'iac',
        name: 'IaC',
        covers: 'Terraform, CloudFormation, vRealize',
      },
      { id: 'networking', name: 'Networking', covers: 'VPC, Load Balancer, VPN' },
      { id: 'aiops', name: 'AI Ops', covers: 'Copilot (Infra)' },
    ],
  },
  {
    id: 'cybersecuritystack',
    name: 'Cybersecurity',
    color: '#2E308E',
    bg: 'linear-gradient(90deg,#2E308E,#7373D8)',
    skills: [
      {
        id: 'cyber_os',
        name: 'Operating Systems',
        covers: 'Linux, Windows Security',
      },
      {
        id: 'cyber_networking',
        name: 'Networking',
        covers:
          'TCP/IP, DNS, HTTP/HTTPS, Firewalls, VPNs, proxies, Wireshark, Snort, Palo Alto / Cisco firewalls',
      },
      {
        id: 'cyber_security_basics',
        name: 'Security',
        covers: 'CIA Triad, Encryption, hashing',
      },
      {
        id: 'cyber_ethical_hacking',
        name: 'Ethical Hacking',
        covers: 'Metasploit, Nmap, Kali Linux',
      },
      {
        id: 'cyber_iam',
        name: 'Identity & Access Mgmt (IAM)',
        covers: 'Authentication, authorization, access control',
      },
      {
        id: 'cyber_cloud_security',
        name: 'Cloud Security',
        covers: 'AWS Security Hub, Azure Security Center',
      },
      {
        id: 'cyber_soc',
        name: 'Security Operations (SOC)',
        covers: 'SIEM (Splunk, QRadar), SOAR platforms',
      },
      {
        id: 'cyber_cryptography',
        name: 'Cryptography',
        covers: 'AES, RSA, SHA',
      },
      {
        id: 'cyber_vuln_mgmt',
        name: 'Vulnerability Mgmt',
        covers: 'Nessus, Qualys',
      },
      {
        id: 'cyber_devsecops',
        name: 'DevSecOps',
        covers: 'SonarQube, Snyk, Checkmarx',
      },
      {
        id: 'cyber_grc',
        name: 'Governance, Risk & Compliance (GRC)',
        covers: 'ISO 27001, GDPR, NIST',
      },
    ],
  },
  {
    id: 'dataengml',
    name: 'Data Engineering, Analytics and ML',
    color: '#06C7CC',
    bg: 'linear-gradient(90deg,#06C7CC,#7373D8)',
    skills: [
      {
        id: 'de_data_engineering',
        name: 'Data Engineering',
        covers: 'Spark, Kafka, Airflow, Snowflake',
      },
      {
        id: 'de_machine_learning',
        name: 'Machine Learning',
        covers:
          'R programming, TensorFlow, PyTorch, Keras, Scikit-learn, MLflow, Kubeflow, SageMaker',
      },
      {
        id: 'de_database',
        name: 'Database',
        covers:
          'Snowflake, Amazon Redshift, Google BigQuery, Apache Kafka, Apache Flink, Spark Streaming, AWS S3, Azure Data Lake',
      },
      {
        id: 'de_big_data',
        name: 'Big data',
        covers: 'Hadoop, Hive, Spark, HBase',
      },
      {
        id: 'de_data_analytics',
        name: 'Data Analytics',
        covers: 'Power BI, Tableau, Looker',
      },
    ],
  },
  {
    id: 'industryplatforms',
    name: 'Industry Products and Enterprise Platforms',
    color: '#2F78C4',
    bg: 'linear-gradient(90deg,#2F78C4,#7373D8)',
    skills: [
      {
        id: 'ind_industry_focused',
        name: 'Industry focused',
        covers: 'Guidewire, Duck Creek',
      },
      {
        id: 'ind_erp',
        name: 'ERP',
        covers: 'SAP, Oracle ERP',
      },
      {
        id: 'ind_crm',
        name: 'CRM',
        covers: 'Salesforce (SFDC)',
      },
      {
        id: 'ind_bpm_lowcode',
        name: 'BPM / Low-Code',
        covers: 'Pega, Appian, Mendix, OutSystems',
      },
      {
        id: 'ind_data',
        name: 'Data',
        covers: 'Snowflake, Databricks',
      },
      {
        id: 'ind_integration',
        name: 'Integration',
        covers: 'MuleSoft, Boomi, Informatica',
      },
      {
        id: 'ind_itsm',
        name: 'ITSM',
        covers: 'ServiceNow, BMC Remedy',
      },
    ],
  },
  {
    id: 'aigenaiaagentic',
    name: 'AI, GenAI, Agentic AI',
    color: '#06C7CC',
    bg: 'linear-gradient(90deg,#06C7CC,#2F78C4)',
    skills: [
      {
        id: 'ai_core_tech',
        name: 'AI core tech',
        covers: 'ML, Deep Learning, NLP, Computer Vision',
      },
      {
        id: 'genai_llms',
        name: 'GenAI',
        covers:
          'LLMs - GPT, LLaMA, Claude, OpenAI (GPT, DALL·E), Hugging Face, Azure OpenAI / AWS Bedrock',
      },
      {
        id: 'genai_prompt_engineering',
        name: 'Prompt engineering',
        covers: 'GenAI',
      },
      {
        id: 'genai_context_handling',
        name: 'Context handling (RAG)',
        covers: 'GenAI',
      },
      {
        id: 'agentic_langchain',
        name: 'LangChain',
        covers: 'Agentic AI',
      },
      {
        id: 'agentic_langgraph',
        name: 'LangGraph',
        covers: 'Agentic AI',
      },
      {
        id: 'agentic_crewai',
        name: 'CrewAI',
        covers: 'Agentic AI',
      },
      {
        id: 'agentic_autogpt',
        name: 'AutoGPT',
        covers: 'Agentic AI',
      },
    ],
  },
  {
    id: 'voiceaccent',
    name: 'Voice and Accent',
    color: '#7373D8',
    bg: 'linear-gradient(90deg,#7373D8,#06C7CC)',
    skills: [
      {
        id: 'voice_clarity',
        name: 'Voice Clarity',
        covers: 'Pronunciation, audible, steady speech, articulation of words',
      },
      {
        id: 'fluency_intonation',
        name: 'Fluency, Intonation & Modulation',
        covers: 'Pace of speech',
      },
      {
        id: 'accent_neutralization',
        name: 'Accent Neutralization',
        covers: 'Understanding global accents, intelligibility for global audiences',
      },
    ],
  },
  {
    id: 'corebehavioural',
    name: 'Core Behavioural Skills',
    color: '#7373D8',
    bg: 'linear-gradient(90deg,#7373D8,#2E308E)',
    skills: [
      {
        id: 'communication',
        name: 'Communication',
        covers: 'Verbal and written communication, presentation, active listening, business communication',
      },
      {
        id: 'interpersonal',
        name: 'Interpersonal & Collaboration',
        covers: 'Teamwork, relationship building, conflict resolution, stakeholder management, networking',
      },
      {
        id: 'emotional_intelligence',
        name: 'Emotional Intelligence',
        covers: 'Self-awareness, self-regulation, empathy, social awareness, resilience, adaptability',
      },
      {
        id: 'cognitive',
        name: 'Cognitive',
        covers: 'Critical thinking, analytical thinking, problem solving, logical reasoning, creative thinking, design thinking, systems thinking, decision making',
      },
      {
        id: 'professional_effectiveness',
        name: 'Professional Effectiveness',
        covers: 'Time management, ownership & accountability, attention to detail, professionalism, learning agility, execution excellence',
      },
      {
        id: 'learning_facilitation_influence',
        name: 'Learning, Facilitation & Influence',
        covers: 'Story telling, facilitation, instructional communication, audience engagement, coaching & mentoring, influencing skills, feedback skills',
      },
      {
        id: 'leadership_ownership',
        name: 'Leadership & Ownership',
        covers: 'Strategic thinking, change agility, decision ownership, leadership presence, delegation & coordination',
      },
    ],
  },
];

const ALL_SKILLS = STACKS.flatMap((s) => s.skills);
const TOTAL = ALL_SKILLS.length;

function scColor(v: number): string {
  return [
    '#D0D0CE',
    '#E8424A',
    '#E9A01D',
    '#F5D020',
    '#52C87A',
    '#06C7CC',
  ][v || 0];
}

function HeatMapPage() {
  const [mode, setMode] = useState('educator'); // 'educator' or 'manager'
  const [profile, setProfile] = useState({
    name: '',
    grade: '',
    bu: '',
    empid: '',
  });
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [primaryCovers, setPrimaryCovers] = useState<{ [key: string]: string }>({});
  const [toastMsg, setToastMsg] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = () => {
    if (!profile.name || !profile.grade) {
      showToast('Please enter your name and grade');
      return;
    }
    showToast(`Profile saved: ${profile.name}`);
  };

  const setRating = (id: string, score: number) => {
    if (!profile.name) {
      showToast('Please save your profile first');
      return;
    }
    setRatings((prev) => ({ ...prev, [id]: score }));
  };

  const submitRatings = () => {
    if (!profile.name || !profile.grade) {
      showToast('Save your profile first');
      return;
    }
    const rated = ALL_SKILLS.filter((s) => ratings[s.id] !== undefined).length;
    if (rated < TOTAL) {
      showToast(`Rate all ${TOTAL} skills first — ${TOTAL - rated} remaining`);
      return;
    }
    setShowResults(true);
    showToast('✓ Ratings submitted successfully!');
  };

  const resetRatings = () => {
    setRatings({});
    setPrimaryCovers({});
    setShowResults(false);
    showToast('Ratings cleared');
  };

  const coverOptions = (covers?: string) =>
    (covers || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const rated = ALL_SKILLS.filter((s) => ratings[s.id] !== undefined).length;
  const pct = Math.round((rated / TOTAL) * 100);
  const vals = ALL_SKILLS.map((s) => ratings[s.id]).filter((v) => v !== undefined && v > 0);
  const avg = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '—';
  const stackTotal = (stackId: string) =>
    STACKS.find((stack) => stack.id === stackId)?.skills.reduce((sum, s) => sum + (ratings[s.id] || 0), 0) || 0;

  const countSkillsInStacks = (stackIds: string[]): number => {
    let count = 0;
    stackIds.forEach((id) => {
      const stack = STACKS.find((s) => s.id === id);
      if (stack) count += stack.skills.length;
    });
    return count;
  };

  const calculateMaxScore = (stackIds: string[]): number => countSkillsInStacks(stackIds) * 5;

  const calculateCategoryScore = (stackIds: string[]): number =>
    stackIds.reduce((sum, id) => sum + stackTotal(id), 0);

  const calculatePercentage = (score: number, maxScore: number): string => {
    return maxScore === 0 ? '0%' : `${Math.round((score / maxScore) * 100)}%`;
  };

  const gaps = ALL_SKILLS.filter((s) => ratings[s.id] > 0 && ratings[s.id] < 3).sort(
    (a, b) => (ratings[a.id] || 0) - (ratings[b.id] || 0)
  );
  const strong = ALL_SKILLS.filter((s) => (ratings[s.id] || 0) >= 4);

  return (
    <>
      <div className="topbar">
        <div className="brand">
          <div className="brand-mark">C</div>
          <div>
            <div className="brand-text">FSE Skill Heatmap</div>
            <div className="brand-sub">Full Stack Educator Platform</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="mode-toggle">
            <button
              className={`mode-btn ${mode === 'educator' ? 'active' : ''}`}
              onClick={() => setMode('educator')}
            >
              Educator
            </button>
            <button
              className={`mode-btn ${mode === 'manager' ? 'active' : ''}`}
              onClick={() => setMode('manager')}
            >
              Manager
            </button>
          </div>
        </div>
      </div>

      {mode === 'educator' && (
        <div className="page active">
          <div className="layout">
            <div className="ph-eyebrow">SELF EVALUATION</div>
            <div className="ph-title">Rate your skills, Educator</div>
            <div className="ph-desc">
              Rate yourself across all  stacks. Your submission is saved live and visible to your Program Manager instantly.
            </div>

            {!showResults ? (
              <>
                {/* Profile Card */}
                <div className="card" style={{ marginTop: '1.5rem' }}>
                  <div className="card-head">
                    <div className="card-title">Your Profile</div>
                  </div>
                  <div className="card-body">
                    <div className="field-row2">
                      <div className="field">
                        <label>Name</label>
                        <input
                          name="name"
                          value={profile.name}
                          onChange={handleProfileChange}
                          placeholder="e.g. Rakesh Kumar"
                        />
                      </div>
                      <div className="field">
                        <label>Grade</label>
                        <select name="grade" value={profile.grade} onChange={handleProfileChange}>
                          <option value="">Select grade</option>
                          <option value="Associate">Associate</option>
                          <option value="Senior Associate">Senior Associate</option>
                          <option value="Manager">Manager</option>
                          <option value="Senior Manager">Senior Manager</option>
                          <option value="Associate Director">Associate Director</option>
                          <option value="Director">Director</option>
                        </select>
                      </div>
                    </div>
                    <div className="field-row2">
                      <div className="field">
                        <label>Business Unit</label>
                        <input
                          name="bu"
                          value={profile.bu}
                          onChange={handleProfileChange}
                          placeholder="e.g Learning & Development"
                        />
                      </div>
                      <div className="field">
                        <label>Employee ID</label>
                        <input
                          name="empid"
                          value={profile.empid}
                          onChange={handleProfileChange}
                          placeholder="EMP ID"
                        />
                      </div>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={saveProfile}>
                      Save Profile
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="prog-strip">
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>
                      Completion
                    </div>
                    <div className="prog-bg">
                      <div
                        className="prog-fill"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="prog-pct">{pct}%</div>
                  <div className="prog-stats">
                    <div className="pstat">
                      <div className="v">{rated}</div>
                      <div className="l">Rated</div>
                    </div>
                    <div className="pstat">
                      <div className="v">{avg}</div>
                      <div className="l">Total</div>
                    </div>
                    <div className="pstat">
                      <div className="v">{strong.length}</div>
                      <div className="l">Strong</div>
                    </div>
                  </div>
                </div>

                {/* Skills Form */}
                <div id="skills-form">
                  {STACKS.map((stack) => (
                    <div key={stack.id} className="card" style={{ marginBottom: '1rem' }}>
                      <div
                        className="card-head"
                        style={{
                          background: stack.bg,
                          borderBottom: 'none',
                          color: 'white',
                          borderRadius: '10px 10px 0 0',
                        }}
                      >
                        <div className="card-title" style={{ color: 'white' }}>
                          {stack.name}
                        </div>
                      </div>
                      <div className="card-body">
                        <table className="skills-tbl">
                          <thead>
                            <tr>
                              <th style={{ textAlign: 'left', minWidth: '120px' }}>Skill</th>
                              <th style={{ textAlign: 'left', minWidth: '200px' }}>Covers</th>
                              <th style={{ textAlign: 'center', width: '30px' }}>N/A</th>
                              <th style={{ textAlign: 'center', width: '30px' }}>1</th>
                              <th style={{ textAlign: 'center', width: '30px' }}>2</th>
                              <th style={{ textAlign: 'center', width: '30px' }}>3</th>
                              <th style={{ textAlign: 'center', width: '30px' }}>4</th>
                              <th style={{ textAlign: 'center', width: '30px' }}>5</th>
                            </tr>
                          </thead>
                          <thead style={{ background: 'var(--gray-ltest)', fontSize: '9px', color: 'var(--gray-md)', fontWeight: '600' }}>
                            <tr>
                              <th colSpan={2}></th>
                              <th style={{ textAlign: 'center' }}>N/A</th>
                              <th style={{ textAlign: 'center' }}>Novice</th>
                              <th style={{ textAlign: 'center' }}>Aware</th>
                              <th style={{ textAlign: 'center' }}>Pract.</th>
                              <th style={{ textAlign: 'center' }}>Prof.</th>
                              <th style={{ textAlign: 'center' }}>Expert</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stack.skills.map((skill) => (
                              <tr key={skill.id}>
                                <td className="sname">{skill.name}</td>
                                <td style={{ fontSize: '11px', color: 'var(--gray-dk)' }}>
                                  <select
                                    value={primaryCovers[skill.id] || coverOptions(skill.covers)[0] || ''}
                                    onChange={(e) =>
                                      setPrimaryCovers((prev) => ({ ...prev, [skill.id]: e.target.value }))
                                    }
                                    style={{
                                      width: '100%',
                                      maxWidth: '240px',
                                      padding: '6px 8px',
                                      borderRadius: '6px',
                                      border: '1px solid var(--gray-lt)',
                                      background: 'white',
                                      color: 'var(--gray-dk)',
                                      fontSize: '11px',
                                    }}
                                  >
                                    {coverOptions(skill.covers).map((cover) => (
                                      <option key={cover} value={cover}>
                                        {cover}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  <button
                                    className={`rpip ${
                                      ratings[skill.id] === 0
                                        ? `sel-0`
                                        : ''
                                    }`}
                                    onClick={() => setRating(skill.id, 0)}
                                    style={{
                                      background:
                                        ratings[skill.id] === 0
                                          ? scColor(0)
                                          : 'var(--gray-ltest)',
                                      color:
                                        ratings[skill.id] === 0
                                          ? 'white'
                                          : 'var(--gray-md)',
                                    }}
                                  >
                                    —
                                  </button>
                                </td>
                                {[1, 2, 3, 4, 5].map((score) => (
                                  <td key={score} style={{ textAlign: 'center' }}>
                                    <button
                                      className={`rpip ${
                                        ratings[skill.id] === score
                                          ? `sel-${score}`
                                          : ''
                                      }`}
                                      onClick={() => setRating(skill.id, score)}
                                      style={{
                                        background:
                                          ratings[skill.id] === score
                                            ? scColor(score)
                                            : 'var(--gray-ltest)',
                                        color:
                                          ratings[skill.id] === score && score === 3
                                            ? 'var(--primary)'
                                            : ratings[skill.id] === score
                                              ? 'white'
                                              : 'var(--gray-md)',
                                      }}
                                    >
                                      {score}
                                    </button>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="btn-row">
                  <button
                    className="btn btn-primary"
                    onClick={submitRatings}
                    disabled={rated < TOTAL}
                    style={{
                      opacity: rated < TOTAL ? 0.5 : 1,
                      cursor: rated < TOTAL ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Submit Ratings ({rated}/{TOTAL})
                  </button>
                  <button className="btn btn-sec" onClick={resetRatings}>
                    Clear
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Results */}
                <div
                  style={{
                    marginTop: '1.5rem',
                    padding: '1.25rem',
                    background: 'var(--primary)',
                    borderRadius: 'var(--r)',
                    color: 'white',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      marginBottom: '1rem',
                      color: 'var(--a3m)',
                    }}
                  >
                    ✓ Assessment Complete
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--a3m)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                      Technical
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                      <div style={{ background: 'rgba(255,255,255,.07)', padding: '9px 12px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '9px', color: 'white', textTransform: 'uppercase', marginBottom: '3px' }}>
                          Digital Stack Score
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>
                          {calculateCategoryScore(['programming', 'mobile', 'frontend', 'backend', 'database', 'api', 'architecture', 'testing', 'devopsstack', 'agilescrum'])}/{calculateMaxScore(['programming', 'mobile', 'frontend', 'backend', 'database', 'api', 'architecture', 'testing', 'devopsstack', 'agilescrum'])}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.7)', marginTop: '4px' }}>
                          {calculatePercentage(calculateCategoryScore(['programming', 'mobile', 'frontend', 'backend', 'database', 'api', 'architecture', 'testing', 'devopsstack', 'agilescrum']), calculateMaxScore(['programming', 'mobile', 'frontend', 'backend', 'database', 'api', 'architecture', 'testing', 'devopsstack', 'agilescrum']))}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,.07)', padding: '9px 12px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '9px', color: 'white', textTransform: 'uppercase', marginBottom: '3px' }}>
                          Cloud & Infra Score
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>
                          {calculateCategoryScore(['cloudinfra'])}/{calculateMaxScore(['cloudinfra'])}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.7)', marginTop: '4px' }}>
                          {calculatePercentage(calculateCategoryScore(['cloudinfra']), calculateMaxScore(['cloudinfra']))}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,.07)', padding: '9px 12px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '9px', color: 'white', textTransform: 'uppercase', marginBottom: '3px' }}>
                          Cybersec Score
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>
                          {calculateCategoryScore(['cybersecuritystack'])}/{calculateMaxScore(['cybersecuritystack'])}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.7)', marginTop: '4px' }}>
                          {calculatePercentage(calculateCategoryScore(['cybersecuritystack']), calculateMaxScore(['cybersecuritystack']))}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,.07)', padding: '9px 12px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '9px', color: 'white', textTransform: 'uppercase', marginBottom: '3px' }}>
                          Data Engg, Analytics & ML Score
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>
                          {calculateCategoryScore(['dataengml'])}/{calculateMaxScore(['dataengml'])}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.7)', marginTop: '4px' }}>
                          {calculatePercentage(calculateCategoryScore(['dataengml']), calculateMaxScore(['dataengml']))}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,.07)', padding: '9px 12px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '9px', color: 'white', textTransform: 'uppercase', marginBottom: '3px' }}>
                          Products & Platforms Score
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>
                          {calculateCategoryScore(['industryplatforms'])}/{calculateMaxScore(['industryplatforms'])}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.7)', marginTop: '4px' }}>
                          {calculatePercentage(calculateCategoryScore(['industryplatforms']), calculateMaxScore(['industryplatforms']))}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,.07)', padding: '9px 12px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '9px', color: 'white', textTransform: 'uppercase', marginBottom: '3px' }}>
                          AI Stack Score
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>
                          {calculateCategoryScore(['aigenaiaagentic'])}/{calculateMaxScore(['aigenaiaagentic'])}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.7)', marginTop: '4px' }}>
                          {calculatePercentage(calculateCategoryScore(['aigenaiaagentic']), calculateMaxScore(['aigenaiaagentic']))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--a3m)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                      Behavioural
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                      <div style={{ background: 'rgba(255,255,255,.07)', padding: '9px 12px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '9px', color: 'white', textTransform: 'uppercase', marginBottom: '3px' }}>
                          Core BH Score
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>
                          {calculateCategoryScore(['corebehavioural'])}/{calculateMaxScore(['corebehavioural'])}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.7)', marginTop: '4px' }}>
                          {calculatePercentage(calculateCategoryScore(['corebehavioural']), calculateMaxScore(['corebehavioural']))}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,.07)', padding: '9px 12px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '9px', color: 'white', textTransform: 'uppercase', marginBottom: '3px' }}>
                          V&A Score
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>
                          {calculateCategoryScore(['voiceaccent'])}/{calculateMaxScore(['voiceaccent'])}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.7)', marginTop: '4px' }}>
                          {calculatePercentage(calculateCategoryScore(['voiceaccent']), calculateMaxScore(['voiceaccent']))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="btn-row">
                  <button className="btn btn-primary" onClick={() => setShowResults(false)}>
                    Edit Ratings
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {mode === 'manager' && (
        <div className="page active">
          <div className="layout">
            <div className="ph-eyebrow">Dashboard</div>
            <div className="ph-title">Manager Dashboard</div>
            <div className="ph-desc">Team skill assessment overview</div>
            <div className="card" style={{ marginTop: '1.5rem' }}>
              <div className="card-body">
                <p style={{ color: 'var(--gray-md)', textAlign: 'center', padding: '2rem' }}>
                  Manager dashboard data would be loaded here from the backend
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="toast show">
          {toastMsg}
        </div>
      )}
    </>
  );
}

export default HeatMapPage;
