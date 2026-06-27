import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { clearAuthSession, getAuthRoles } from '../auth';

const MAX_RATING = 4;
const LEVELS = ['No knowledge', 'Aware', 'Practitioner', 'Advanced', 'Expert'];

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

const STACKS_WITH_OTHERS = STACKS.map((stack) => ({
  ...stack,
  skills: [
    ...stack.skills,
    {
      id: `${stack.id}_others`,
      name: 'Others',
      covers: '',
    },
  ],
}));

const TECHNICAL_STACK_IDS = [
  'programming',
  'mobile',
  'frontend',
  'backend',
  'database',
  'api',
  'architecture',
  'testing',
  'devopsstack',
  'agilescrum',
  'cloudinfra',
  'cybersecuritystack',
  'dataengml',
  'industryplatforms',
  'aigenaiaagentic',
];

const BEHAVIOURAL_STACK_IDS = ['voiceaccent', 'corebehavioural'];

const TECHNICAL_STACKS = STACKS_WITH_OTHERS.filter((stack) =>
  TECHNICAL_STACK_IDS.includes(stack.id)
);

const BEHAVIOURAL_STACKS = STACKS_WITH_OTHERS.filter((stack) =>
  BEHAVIOURAL_STACK_IDS.includes(stack.id)
);

const ALL_SKILLS = STACKS_WITH_OTHERS.flatMap((s) => s.skills).filter(
  (skill) => !skill.id.toLowerCase().endsWith('_others') && skill.id.toLowerCase() !== 'others'
);
const TOTAL = ALL_SKILLS.length;
const DIGITAL_STACK_GROUP_IDS = ['programming', 'mobile', 'frontend', 'backend', 'database', 'api', 'architecture', 'testing', 'devopsstack', 'agilescrum'];
const AI_STACK_GROUP_IDS = ['aigenaiaagentic'];
const BH_STACK_GROUP_IDS = ['corebehavioural', 'voiceaccent'];

type SkillRatings = { [key: string]: number };

type ManagerEmployee = {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  location: string;
  grade?: string;
  skills: SkillRatings;
  skillCovers?: { [key: string]: string };
  submittedAt?: string;
};

const MANAGER_EMPLOYEES: ManagerEmployee[] = [
  {
    id: 'emp-001',
    employeeId: 'EMP001',
    name: 'Rakesh Kumar',
    designation: 'Full Stack Lead',
    department: 'Technology',
    location: 'Chennai',
    grade: 'Senior Manager',
    skills: {
      programming: 5,
      frontend: 5,
      backend: 4,
      api: 4,
      database: 4,
      architecture: 4,
      testing: 4,
      devopsstack: 3,
      agilescrum: 4,
      cloudinfra: 3,
      voiceaccent: 4,
      corebehavioural: 4,
    },
  },
  {
    id: 'emp-002',
    employeeId: 'EMP002',
    name: 'Ananya Iyer',
    designation: 'Data Engineer',
    department: 'Data & Analytics',
    location: 'Bangalore',
    grade: 'Manager',
    skills: {
      dataengml: 5,
      database: 4,
      backend: 3,
      cloudinfra: 3,
      api: 3,
      industryplatforms: 2,
      agilescrum: 3,
      voiceaccent: 4,
      corebehavioural: 4,
    },
  },
  {
    id: 'emp-003',
    employeeId: 'EMP003',
    name: 'Salman Khan',
    designation: 'Platform Engineer',
    department: 'Operations',
    location: 'Pune',
    grade: 'Senior Associate',
    skills: {
      devopsstack: 5,
      cloudinfra: 5,
      backend: 4,
      database: 3,
      testing: 3,
      cybersecuritystack: 4,
      architecture: 3,
      voiceaccent: 3,
      corebehavioural: 4,
    },
  },
  {
    id: 'emp-004',
    employeeId: 'EMP004',
    name: 'Priya Nair',
    designation: 'Security Analyst',
    department: 'Cybersecurity',
    location: 'Hyderabad',
    grade: 'Associate Director',
    skills: {
      cybersecuritystack: 5,
      cloudinfra: 4,
      api: 3,
      database: 3,
      architecture: 3,
      testing: 4,
      voiceaccent: 5,
      corebehavioural: 5,
      agilescrum: 3,
    },
  },
  {
    id: 'emp-005',
    employeeId: 'EMP005',
    name: 'Rahul Verma',
    designation: 'Enterprise Consultant',
    department: 'Business Solutions',
    location: 'Mumbai',
    grade: 'Director',
    skills: {
      industryplatforms: 5,
      backend: 3,
      api: 4,
      architecture: 4,
      agilescrum: 4,
      cloudinfra: 3,
      corebehavioural: 4,
      voiceaccent: 4,
      dataengml: 2,
    },
  },
  {
    id: 'emp-006',
    employeeId: 'EMP006',
    name: 'Meera Singh',
    designation: 'AI Engineer',
    department: 'AI & Innovation',
    location: 'Noida',
    grade: 'Senior Associate',
    skills: {
      aigenaiaagentic: 5,
      dataengml: 4,
      programming: 4,
      backend: 3,
      api: 3,
      cloudinfra: 3,
      corebehavioural: 4,
      voiceaccent: 4,
      testing: 3,
    },
  },
  {
    id: 'emp-007',
    employeeId: 'EMP007',
    name: 'Arun Das',
    designation: 'QA Lead',
    department: 'Quality Engineering',
    location: 'Kolkata',
    grade: 'Manager',
    skills: {
      testing: 5,
      programming: 4,
      frontend: 4,
      backend: 3,
      devopsstack: 3,
      agilescrum: 4,
      corebehavioural: 4,
      voiceaccent: 4,
      architecture: 3,
    },
  },
  {
    id: 'emp-008',
    employeeId: 'EMP008',
    name: 'Deepa Menon',
    designation: 'UI Architect',
    department: 'Product Engineering',
    location: 'Trivandrum',
    grade: 'Senior Manager',
    skills: {
      frontend: 5,
      programming: 4,
      api: 4,
      architecture: 4,
      database: 3,
      agilescrum: 3,
      corebehavioural: 4,
      voiceaccent: 5,
      mobile: 4,
    },
  },
];

type ManagerEmployeeApi = {
  id: number;
  employeeId: string;
  name: string;
  designation?: string;
  department?: string;
  location?: string;
  submittedAt?: string;
  skillRatings?: SkillRatings;
  skillCovers?: { [key: string]: string };
};

const getEmployeeMetrics = (employee: ManagerEmployee) => {
  const ratedEntries = Object.entries(employee.skills).filter(([, score]) => score > 0);
  const normalizedEntries = ratedEntries.map(([skillId, score]) => [skillId, Math.min(score, MAX_RATING)] as const);
  const totalScore = normalizedEntries.reduce((sum, [, score]) => sum + score, 0);
  const maxScore = normalizedEntries.length * MAX_RATING;
  const averageScore = ratedEntries.length ? totalScore / ratedEntries.length : 0;
  const percentage = maxScore ? Math.round((totalScore / maxScore) * 100) : 0;
  const strongSkills = normalizedEntries.filter(([, score]) => score >= 2).length;
  const topSkills = ratedEntries
    .filter(([skillId]) => !skillId.toLowerCase().endsWith('_others') && skillId.toLowerCase() !== 'others')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([skillId, score]) => ({ skillId, score }));

  return {
    totalScore,
    maxScore,
    percentage,
    averageScore,
    ratedSkills: ratedEntries.length,
    strongSkills,
    topSkills,
  };
};

const getStackSkillIds = (stackIds: string[]) =>
  stackIds.flatMap((stackId) => STACKS.find((stack) => stack.id === stackId)?.skills.map((skill) => skill.id) || []);

const getEmployeeStackPercentage = (employee: ManagerEmployee, stackIds: string[]) => {
  const stackSkillIds = getStackSkillIds(stackIds);
  const ratedEntries = stackSkillIds
    .map((skillId) => employee.skills[skillId])
    .filter((score): score is number => score !== undefined && score > 0)
    .map((score) => Math.min(score, MAX_RATING));
  const totalScore = ratedEntries.reduce((sum, score) => sum + score, 0);
  const maxScore = ratedEntries.length * MAX_RATING;

  return maxScore ? Math.round((totalScore / maxScore) * 100) : 0;
};

const SKILL_NAME_BY_ID = Object.fromEntries(ALL_SKILLS.map((skill) => [skill.id, skill.name]));

function scColor(v: number): string {
  return [
    '#D0D0CE',
    '#E8424A',
    '#E9A01D',
    '#F5D020',
    '#52C87A',
  ][v || 0];
}

function HeatMapPage({ initialMode = 'educator' }: { initialMode?: 'educator' | 'manager' } = {}) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'educator' | 'manager'>(initialMode);
  const authRoles = getAuthRoles();
  const isAdmin = authRoles.includes('ROLE_ADMIN');
  const [activeSection, setActiveSection] = useState<'technical' | 'behaviourial'>('technical');
  const [sectionCardIndex, setSectionCardIndex] = useState({
    technical: 0,
    behaviourial: 0,
  });
  const [profile, setProfile] = useState({
    name: '',
    grade: '',
    bu: '',
    designation: '',
    location: '',
    empid: '',
  });
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [primaryCovers, setPrimaryCovers] = useState<{ [key: string]: string }>({});
  const [coverRatings, setCoverRatings] = useState<{ [key: string]: { [key: string]: number } }>({});
  const [toastMsg, setToastMsg] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [managerEmployees, setManagerEmployees] = useState<ManagerEmployee[]>(MANAGER_EMPLOYEES);
  const [managerSearch, setManagerSearch] = useState('');
  const [managerEmployeeId, setManagerEmployeeId] = useState('');
  const [managerDesignation, setManagerDesignation] = useState('');
  const [managerLocation, setManagerLocation] = useState('');
  const [managerScore, setManagerScore] = useState('');
  const [managerSkillCategory, setManagerSkillCategory] = useState('');
  const [managerSkills, setManagerSkills] = useState('');
  const [managerDigitalStackScore, setManagerDigitalStackScore] = useState('');
  const [managerAiStackScore, setManagerAiStackScore] = useState('');
  const [managerCategory, setManagerCategory] = useState('');
  const [managerRatingSkill, setManagerRatingSkill] = useState('');
  const [managerRatingMin, setManagerRatingMin] = useState('4');

  useEffect(() => {
    let cancelled = false;

    if (isAdmin && mode !== 'manager') {
      setMode('manager');
    }

    const loadManagerEmployees = async () => {
      try {
        const response = await fetch('/api/admin/employees');
        if (!response.ok) {
          throw new Error(`Failed to load employees: ${response.status}`);
        }

        const data: ManagerEmployeeApi[] = await response.json();
        if (cancelled || !Array.isArray(data)) {
          return;
        }

        const mappedEmployees = data.map((employee) => ({
          id: String(employee.id),
          employeeId: employee.employeeId,
          name: employee.name,
          designation: employee.designation || '',
          department: employee.department || '',
          location: employee.location || '',
          grade: employee.designation || '',
          bu: employee.department || '',
          skills: employee.skillRatings || {},
          skillCovers: employee.skillCovers || {},
          submittedAt: employee.submittedAt,
        }));

        if (mappedEmployees.length > 0) {
          setManagerEmployees(mappedEmployees);
        }
      } catch {
        if (!cancelled) {
          setManagerEmployees(MANAGER_EMPLOYEES);
        }
      }
    };

    loadManagerEmployees();

    return () => {
      cancelled = true;
    };
  }, [isAdmin, mode]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    if (!profile.name || !profile.grade || !profile.designation || !profile.location) {
      showToast('Please enter your name, grade, designation, and location');
      return;
    }

    try {
      const resolvedCovers = Object.fromEntries(
        ALL_SKILLS.filter((skill) => ratings[skill.id] !== undefined).map((skill) => [skill.id, buildCoverSummary(skill)])
      );

      const response = await fetch('/api/assessments/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: profile.empid,
          name: profile.name,
          designation: profile.designation || profile.grade,
          department: profile.bu,
          location: profile.location,
          ratings: {},
          covers: resolvedCovers,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      showToast(`Profile saved to database: ${profile.name}`);
    } catch {
      showToast('Unable to save profile');
    }
  };

  const submitRatings = async () => {
    if (!profile.name || !profile.grade || !profile.designation || !profile.location) {
      showToast('Save your profile first');
      return;
    }
    try {
      const resolvedCovers = Object.fromEntries(
        ALL_SKILLS.filter((skill) => ratings[skill.id] !== undefined).map((skill) => [skill.id, buildCoverSummary(skill)])
      );

      const response = await fetch('/api/assessments/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: profile.empid,
          name: profile.name,
          designation: profile.designation || profile.grade,
          department: profile.bu,
          location: profile.location,
          ratings,
          covers: resolvedCovers,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit ratings');
      }

      setShowResults(true);
      showToast('✓ Ratings submitted to database successfully!');
    } catch {
      showToast('Unable to submit ratings');
    }
  };

  const setRating = (id: string, score: number) => {
    if (!profile.name) {
      showToast('Please save your profile first');
      return;
    }

    setRatings((prev) => ({ ...prev, [id]: score }));
  };

  const resetRatings = () => {
    setRatings({});
    setPrimaryCovers({});
    setCoverRatings({});
    setShowResults(false);
    showToast('Ratings cleared');
  };

  const coverOptions = (covers?: string) =>
    (covers || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const getSkillCoverNames = (skill: { id: string; name: string; covers?: string }) =>
    skill.name === 'Others' ? [primaryCovers[skill.id] || 'Custom cover'] : coverOptions(skill.covers);

  const getAggregateCoverRating = (skillId: string) => {
    const values = Object.values(coverRatings[skillId] || {});
    if (!values.length) {
      return undefined;
    }

    return Math.round(values.reduce((sum, score) => sum + score, 0) / values.length);
  };

  const setCoverRating = (skillId: string, coverName: string, score: number) => {
    setCoverRatings((prev) => {
      const nextSkillRatings = {
        ...(prev[skillId] || {}),
        [coverName]: score,
      };

      setRatings((prevRatings) => ({
        ...prevRatings,
        [skillId]: getAggregateCoverRatingFromMap(nextSkillRatings),
      }));

      return {
        ...prev,
        [skillId]: nextSkillRatings,
      };
    });
  };

  const setSkillCoverRatings = (skillId: string, coverNames: string[], score: number) => {
    const nextSkillRatings = Object.fromEntries(coverNames.map((coverName) => [coverName, score]));

    setCoverRatings((prev) => ({
      ...prev,
      [skillId]: nextSkillRatings,
    }));

    setRatings((prevRatings) => ({
      ...prevRatings,
      [skillId]: score,
    }));
  };

  const getAggregateCoverRatingFromMap = (skillRatings: { [key: string]: number }) => {
    const values = Object.values(skillRatings);
    if (!values.length) {
      return 0;
    }

    return Math.round(values.reduce((sum, score) => sum + score, 0) / values.length);
  };

  const buildCoverSummary = (skill: { id: string; name: string; covers?: string }) => {
    const coverNames = getSkillCoverNames(skill);
    const skillRatings = coverRatings[skill.id] || {};

    return coverNames
      .map((coverName) => `${coverName}: ${skillRatings[coverName] ?? '-'}`)
      .join(', ');
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const rated = ALL_SKILLS.filter((s) => ratings[s.id] !== undefined).length;
  const pct = Math.round((rated / TOTAL) * 100);
  const stackTotal = (stackId: string) =>
    STACKS_WITH_OTHERS.find((stack) => stack.id === stackId)?.skills.reduce(
      (maxScore, skill) => Math.max(maxScore, ratings[skill.id] || 0),
      0
    ) || 0;

  const countSkillsInStacks = (stackIds: string[]): number => {
    let count = 0;
    stackIds.forEach((id) => {
      const stack = STACKS_WITH_OTHERS.find((s) => s.id === id);
      if (stack) count += stack.skills.length;
    });
    return count;
  };

  const calculateMaxScore = (stackIds: string[]): number => (stackIds.length ? MAX_RATING : 0);

  const calculateCategoryScore = (stackIds: string[]): number =>
    stackIds.reduce((maxScore, id) => Math.max(maxScore, stackTotal(id)), 0);

  const calculatePercentage = (score: number, maxScore: number): string => {
    return maxScore === 0 ? '0%' : `${Math.round((score / maxScore) * 100)}%`;
  };

  const gaps = ALL_SKILLS.filter((s) => (ratings[s.id] || 0) > 0 && (ratings[s.id] || 0) < 3).sort(
    (a, b) => Math.min(ratings[a.id] || 0, MAX_RATING) - Math.min(ratings[b.id] || 0, MAX_RATING)
  );
  const strong = ALL_SKILLS.filter((s) => Math.min(ratings[s.id] || 0, MAX_RATING) >= 2);
  const overallScore = ALL_SKILLS.reduce((sum, skill) => sum + Math.min(ratings[skill.id] || 0, MAX_RATING), 0);
  const overallMaxScore = TOTAL * MAX_RATING;

  const reportFullName = profile.name.trim() || 'User';
  const reportDisplayName = reportFullName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
  const reportTitle = `${reportDisplayName.split(/\s+/)[0]}'s Score Report`;
  const reportFileStem = `${reportFullName.toLowerCase().replace(/[^a-z0-9]+/g, '_') || 'user'}_score_report`;

  const buildSkillRows = () =>
    ALL_SKILLS.filter((skill) => Object.prototype.hasOwnProperty.call(ratings, skill.id)).map((skill) => ({
      Category: STACKS.find((stack) => stack.skills.some((item) => item.id === skill.id))?.name || 'Other',
      Skill: skill.name,
      Score: Math.min(
        Math.max(ratings[skill.id] ?? 0, ...Object.values(coverRatings[skill.id] || {})),
        MAX_RATING
      ),
      Level: LEVELS[
        Math.min(Math.max(ratings[skill.id] ?? 0, ...Object.values(coverRatings[skill.id] || {})), MAX_RATING)
      ] || '',
      Covers: buildCoverSummary(skill),
    }));

  const downloadExcelReport = () => {
    const summarySheet = XLSX.utils.json_to_sheet([
      {
        Name: reportFullName,
        EmployeeID: profile.empid,
        Grade: profile.grade,
        BusinessUnit: profile.bu,
        Designation: profile.designation || profile.grade,
        Location: profile.location,
        TotalScore: overallScore,
        MaxScore: overallMaxScore,
        Percentage: `${calculatePercentage(overallScore, overallMaxScore)}`,
        RatedSkills: rated,
        PractitionerSkills: strong.length,
      },
    ]);

    const skillsSheet = XLSX.utils.json_to_sheet(buildSkillRows());
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    XLSX.utils.book_append_sheet(workbook, skillsSheet, 'Skill Ratings');
    XLSX.writeFile(workbook, `${reportFileStem}.xlsx`);
  };

  const downloadPdfReport = () => {
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 40;
    let cursorY = 48;
    const skillRows = buildSkillRows();
    const summaryRows = [
      ['Name', reportDisplayName],
      ['Employee ID', profile.empid || '-'],
      ['Grade', profile.grade || '-'],
      ['Business Unit', profile.bu || '-'],
      ['Designation', profile.designation || profile.grade || '-'],
      ['Location', profile.location || '-'],
      ['Overall Score', `${calculatePercentage(overallScore, overallMaxScore)} (${overallScore}/${overallMaxScore})`],
      ['Rated Skills', String(rated)],
      ['Practitioner Skills', String(strong.length)],
    ];

    pdf.setFillColor(0, 0, 72);
    pdf.rect(0, 0, pageWidth, 86, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(reportTitle, margin, 34);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Full Stack Educator Platform', margin, 54);

    autoTable(pdf, {
      startY: 112,
      margin: { left: margin, right: margin },
      head: [['Summary Field', 'Value']],
      body: summaryRows,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 6,
        textColor: [0, 0, 72],
        lineColor: [208, 208, 206],
        lineWidth: 0.6,
      },
      headStyles: {
        fillColor: [0, 0, 72],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [247, 247, 245],
      },
      columnStyles: {
        0: { cellWidth: 140, fontStyle: 'bold' },
        1: { cellWidth: 'auto' },
      },
    });

    cursorY = ((pdf as any).lastAutoTable?.finalY || 112) + 18;
    const orderedCategories = STACKS.map((stack) => stack.name);
    const groupedRows = orderedCategories
      .map((category) => ({
        category,
        rows: skillRows.filter((row) => row.Category === category),
      }))
      .filter((entry) => entry.rows.length > 0);

    groupedRows.forEach((entry, index) => {
      const baseColor: [number, number, number] = index % 2 === 0 ? [47, 120, 196] : [115, 115, 216];
      if (cursorY > 720) {
        pdf.addPage();
        cursorY = 48;
      }

      pdf.setFillColor(baseColor[0], baseColor[1], baseColor[2]);
      pdf.roundedRect(margin, cursorY - 8, pageWidth - margin * 2, 24, 6, 6, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text(`${entry.category} - ${entry.rows.length} skill${entry.rows.length === 1 ? '' : 's'}`, margin + 12, cursorY + 8);

      autoTable(pdf, {
        startY: cursorY + 18,
        margin: { left: margin, right: margin },
        head: [['Skill', 'Score', 'Level', 'Cover']],
        body: entry.rows.map((row) => [row.Skill, String(row.Score), row.Level || '-', row.Covers || '-']),
        theme: 'striped',
        styles: {
          font: 'helvetica',
          fontSize: 9.5,
          cellPadding: 6,
          textColor: [0, 0, 72],
          lineColor: [232, 232, 230],
          lineWidth: 0.5,
        },
        headStyles: {
          fillColor: baseColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [247, 249, 255],
        },
        columnStyles: {
          0: { cellWidth: 150 },
          1: { cellWidth: 52, halign: 'center' },
          2: { cellWidth: 92 },
          3: { cellWidth: 'auto' },
        },
        didDrawPage: (data) => {
          cursorY = data.cursor?.y || cursorY;
        },
      });

      cursorY = ((pdf as any).lastAutoTable?.finalY || cursorY) + 20;
    });

    pdf.save(`${reportFileStem}.pdf`);
  };

  const sanitizeSheetName = (name: string, fallback: string) => {
    const cleaned = name.replace(/[\\/?*\[\]:]/g, ' ').trim();
    const shortened = cleaned.slice(0, 31);
    return shortened || fallback;
  };

  const buildManagerEmployeeRows = (employee: ManagerEmployee) =>
    ALL_SKILLS.filter((skill) => Object.prototype.hasOwnProperty.call(employee.skills, skill.id)).map((skill) => ({
      Category: STACKS.find((stack) => stack.skills.some((item) => item.id === skill.id))?.name || 'Other',
      Skill: skill.name,
      Score: Math.min(employee.skills[skill.id] ?? 0, MAX_RATING),
      Level: LEVELS[Math.min(employee.skills[skill.id] ?? 0, MAX_RATING)] || '',
      Cover: employee.skillCovers?.[skill.id] || coverOptions(skill.covers)[0] || '',
    }));

  const downloadManagerReports = () => {
    const workbook = XLSX.utils.book_new();

    const overviewRows = managerVisibleEmployees.map((employee, index) => {
      const metrics = getEmployeeMetrics(employee);
      const submittedOn = employee.submittedAt
        ? new Date(employee.submittedAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : '-';

      return {
        Rank: index + 1,
        Name: employee.name,
        EmployeeID: employee.employeeId,
        Designation: employee.designation || '-',
        Department: employee.department || '-',
        Location: employee.location || '-',
        Score: `${metrics.percentage}%`,
        Marks: metrics.totalScore,
        Skills: metrics.ratedSkills,
        Practitioner: metrics.strongSkills,
        Submitted: submittedOn,
      };
    });

    const overviewSheet = XLSX.utils.json_to_sheet(overviewRows);
    XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Manager Overview');

    managerVisibleEmployees.forEach((employee, index) => {
      const metrics = getEmployeeMetrics(employee);
      const submittedOn = employee.submittedAt
        ? new Date(employee.submittedAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : '-';

      const sheet = XLSX.utils.aoa_to_sheet([
        ['Employee Report'],
        [],
        ['Name', employee.name],
        ['Employee ID', employee.employeeId],
        ['Designation', employee.designation || '-'],
        ['Department', employee.department || '-'],
        ['Location', employee.location || '-'],
        ['Score', `${metrics.percentage}%`],
        ['Marks', metrics.totalScore],
        ['Skills', metrics.ratedSkills],
        ['Practitioner', metrics.strongSkills],
        ['Submitted', submittedOn],
        [],
        ['Skill Ratings'],
        ['Category', 'Skill', 'Score', 'Level', 'Cover'],
        ...buildManagerEmployeeRows(employee).map((row) => [row.Category, row.Skill, row.Score, row.Level, row.Cover]),
      ]);

      const sheetName = sanitizeSheetName(`${index + 1}_${employee.name}`, `Employee_${index + 1}`);
      XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
    });

    XLSX.writeFile(workbook, `${reportFileStem}_manager_reports.xlsx`);
  };
  const activeStacks = activeSection === 'technical' ? TECHNICAL_STACKS : BEHAVIOURAL_STACKS;
  const activeCardIndex = Math.min(sectionCardIndex[activeSection], Math.max(activeStacks.length - 1, 0));
  const activeStack = activeStacks[activeCardIndex];

  const goToNextStack = () => {
    if (!activeStacks.length) {
      return;
    }

    if (activeCardIndex < activeStacks.length - 1) {
      setSectionCardIndex((prev) => ({
        ...prev,
        [activeSection]: activeCardIndex + 1,
      }));
    }
  };

  const goToPrevStack = () => {
    if (!activeStacks.length) {
      return;
    }

    if (activeCardIndex > 0) {
      setSectionCardIndex((prev) => ({
        ...prev,
        [activeSection]: activeCardIndex - 1,
      }));
    }
  };

  const managerFilteredEmployees = managerEmployees.filter((employee) => {
    const metrics = getEmployeeMetrics(employee);
    const searchText = managerSearch.trim().toLowerCase();
    const employeeIdText = managerEmployeeId.trim().toLowerCase();
    const designationText = managerDesignation.trim().toLowerCase();
    const locationText = managerLocation.trim().toLowerCase();
    const skillsText = managerSkills.trim().toLowerCase();
    const scoreThreshold = Number(managerScore || '0');
    const digitalStackThreshold = Number(managerDigitalStackScore || '0');
    const aiStackThreshold = Number(managerAiStackScore || '0');
    const matchesSearch =
      !searchText ||
      [employee.name, employee.employeeId, employee.designation, employee.department, employee.location, employee.grade]
        .join(' ')
        .toLowerCase()
        .includes(searchText) ||
      Object.keys(employee.skills).some((skillId) => {
        const skillName = SKILL_NAME_BY_ID[skillId] || skillId;
        return skillName.toLowerCase().includes(searchText);
      });
    const matchesEmployeeId = !employeeIdText || employee.employeeId.toLowerCase().includes(employeeIdText);
    const matchesDesignation = !designationText || employee.designation.toLowerCase().includes(designationText);
    const matchesLocation = !locationText || employee.location.toLowerCase().includes(locationText);
    const matchesScore = !scoreThreshold || metrics.percentage >= scoreThreshold;
    const matchesSkillCategory =
      !managerSkillCategory ||
      (STACKS_WITH_OTHERS.find((stack) => stack.id === managerSkillCategory)?.skills.some(
        (skill) => (employee.skills[skill.id] || 0) > 0
      ) ?? false);
    const matchesSkills =
      !skillsText ||
      Object.keys(employee.skills).some((skillId) => {
        const skillName = SKILL_NAME_BY_ID[skillId] || skillId;
        return skillName.toLowerCase().includes(skillsText);
      });
    const digitalStackScore = getEmployeeStackPercentage(employee, DIGITAL_STACK_GROUP_IDS);
    const aiStackScore = getEmployeeStackPercentage(employee, AI_STACK_GROUP_IDS);
    const matchesDigitalStackScore = !digitalStackThreshold || digitalStackScore >= digitalStackThreshold;
    const matchesAiStackScore = !aiStackThreshold || aiStackScore >= aiStackThreshold;
    const matchesCategory =
      !managerCategory ||
      STACKS_WITH_OTHERS.find((stack) => stack.id === managerCategory)?.skills.some(
        (skill) => (employee.skills[skill.id] || 0) > 0
      );
    const ratingMin = Number(managerRatingMin || '0');
    const matchesRating =
      !managerRatingSkill ||
      (employee.skills[managerRatingSkill] || 0) >= ratingMin;

    return (
      matchesSearch &&
      matchesEmployeeId &&
      matchesDesignation &&
      matchesLocation &&
      matchesScore &&
      matchesSkillCategory &&
      matchesSkills &&
      matchesDigitalStackScore &&
      matchesAiStackScore &&
      matchesCategory &&
      matchesRating
    );
  });

  const managerVisibleEmployees = [...managerFilteredEmployees]
    .sort((a, b) => {
      const metricsA = getEmployeeMetrics(a);
      const metricsB = getEmployeeMetrics(b);
      return metricsB.totalScore - metricsA.totalScore || metricsB.percentage - metricsA.percentage;
    })
    .slice(0, 5);

  const summaryEmployees = managerEmployees;

  const averageVisibleScore = summaryEmployees.length
    ? Math.round(
        summaryEmployees.reduce((sum, employee) => sum + getEmployeeMetrics(employee).percentage, 0) /
          summaryEmployees.length
      )
    : 0;
  const averageVisibleDigitalStack = summaryEmployees.length
    ? Math.round(
        summaryEmployees.reduce(
          (sum, employee) => sum + getEmployeeStackPercentage(employee, DIGITAL_STACK_GROUP_IDS),
          0
        ) / summaryEmployees.length
      )
    : 0;
  const averageVisibleAiStack = summaryEmployees.length
    ? Math.round(
        summaryEmployees.reduce(
          (sum, employee) => sum + getEmployeeStackPercentage(employee, AI_STACK_GROUP_IDS),
          0
        ) / summaryEmployees.length
      )
    : 0;
  const averageVisibleBhStack = summaryEmployees.length
    ? Math.round(
        summaryEmployees.reduce(
          (sum, employee) => sum + getEmployeeStackPercentage(employee, BH_STACK_GROUP_IDS),
          0
        ) / summaryEmployees.length
      )
    : 0;
  const practitionerVisibleSkills = summaryEmployees.reduce(
    (sum, employee) => sum + getEmployeeMetrics(employee).strongSkills,
    0
  );

  const managerSummaryColumns = [
    { label: 'Educators', value: String(summaryEmployees.length) },
    { label: 'Digital Stack', value: `${averageVisibleDigitalStack}%` },
    { label: 'AI Stack', value: `${averageVisibleAiStack}%` },
    { label: 'BH Stack', value: `${averageVisibleBhStack}%` },
    { label: 'Practitioner', value: String(practitionerVisibleSkills) },
  ];

  const analyticsEmployees = managerEmployees;
  const analyticsEducatorScores = analyticsEmployees.map((employee) => ({
    name: employee.name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' '),
    score: getEmployeeMetrics(employee).percentage,
  }));
  const analyticsCategoryScores = [
    {
      name: 'Digital Stack',
      score: analyticsEmployees.length
        ? Math.round(
            analyticsEmployees.reduce(
              (sum, employee) => sum + getEmployeeStackPercentage(employee, DIGITAL_STACK_GROUP_IDS),
              0
            ) / analyticsEmployees.length
          )
        : 0,
    },
    {
      name: 'AI Stack',
      score: analyticsEmployees.length
        ? Math.round(
            analyticsEmployees.reduce((sum, employee) => sum + getEmployeeStackPercentage(employee, AI_STACK_GROUP_IDS), 0) /
              analyticsEmployees.length
          )
        : 0,
    },
    {
      name: 'BH Stack',
      score: analyticsEmployees.length
        ? Math.round(
            analyticsEmployees.reduce((sum, employee) => sum + getEmployeeStackPercentage(employee, BH_STACK_GROUP_IDS), 0) /
              analyticsEmployees.length
          )
        : 0,
    },
  ];
  const analyticsPractitionerCounts = STACKS_WITH_OTHERS.map((stack) => ({
    name:
      {
        programming: 'Prog',
        mobile: 'Mobile',
        frontend: 'Front-end',
        backend: 'Back-end',
        database: 'DB',
        api: 'API',
        architecture: 'Arch',
        testing: 'QA',
        devopsstack: 'DevOps',
        agilescrum: 'Agile',
        cloudinfra: 'Cloud',
        cybersecuritystack: 'Cyber',
        dataengml: 'Data Engg',
        industryplatforms: 'Industry',
        aigenaiaagentic: 'AI',
        voiceaccent: 'V&A',
        corebehavioural: 'BH',
      }[stack.id] || stack.name,
    practitioners: analyticsEmployees.reduce((count, employee) => {
      const hasPractitioner = stack.skills.some((skill) => !skill.id.toLowerCase().endsWith('_others') && (employee.skills[skill.id] || 0) >= 2);
      return count + (hasPractitioner ? 1 : 0);
    }, 0),
  }));

  const managerCategoryOptions = STACKS_WITH_OTHERS.map((stack) => ({ id: stack.id, name: stack.name }));
  const managerSkillOptions = ALL_SKILLS.map((skill) => ({ id: skill.id, name: skill.name }));

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <div className="topbar">
        <div className="brand">
          <div className="brand-mark">HM</div>
          <div>
            <div className="brand-text">FSE Skill Heatmap</div>
            <div className="brand-sub">Full Stack Educator Platform</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isAdmin && authRoles.includes('ROLE_EMPLOYEE') ? (
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
          ) : null}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {mode === 'educator' && (
        <div className="page active">
          <div className="layout">
            <div className="ph-eyebrow">RATE YOUR SKILLS</div>
            <div className="ph-title">Full Stack Educator</div>
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
                        <label>Employee ID</label>
                        <input
                          name="empid"
                          value={profile.empid}
                          onChange={handleProfileChange}
                          placeholder="EMP ID"
                        />
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
                        <label>Designation</label>
                        <input
                          name="designation"
                          value={profile.designation}
                          onChange={handleProfileChange}
                          placeholder="e.g. Full Stack Educator"
                        />
                      </div>
                      <div className="field">
                        <label>Location</label>
                        <input
                          name="location"
                          value={profile.location}
                          onChange={handleProfileChange}
                          placeholder="e.g. Chennai"
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
                  <div className="prog-pct" style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.1 }}>{pct}%</div>
                  <div className="prog-stats">
                    <div className="pstat">
                      <div className="v">{rated}</div>
                      <div className="l">Rated</div>
                    </div>
                    <div className="pstat">
                      <div className="v">{overallScore}</div>
                      <div className="l">Total</div>
                    </div>
                    <div className="pstat">
                      <div className="v">{strong.length}</div>
                      <div className="l">Practitioner</div>
                    </div>
                  </div>
                </div>

                {/* Skills Form */}
                <div id="skills-form">
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      gap: '0.75rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <div className="section-tabs">
                        <button
                          className={`section-tab ${activeSection === 'technical' ? 'active' : ''}`}
                          onClick={() => setActiveSection('technical')}
                        >
                          TECHNICAL
                        </button>
                        <button
                          className={`section-tab ${activeSection === 'behaviourial' ? 'active' : ''}`}
                          onClick={() => setActiveSection('behaviourial')}
                        >
                          BEHAVIOURAL
                        </button>
                      </div>
                    </div>
                  </div>

                  {activeStack ? (
                    <div key={activeStack.id} className="card" style={{ marginBottom: '1rem' }}>
                      <div
                        className="card-head"
                        style={{
                          background: activeStack.bg,
                          borderBottom: 'none',
                          color: 'white',
                          borderRadius: '10px 10px 0 0',
                        }}
                      >
                        <div className="card-title" style={{ color: 'white' }}>
                          {activeStack.name}
                        </div>
                      </div>
                      <div className="card-body">
                        <table className="skills-tbl">
                          <thead>
                            <tr>
                              <th style={{ textAlign: 'left', minWidth: '120px' }}>Skill</th>
                              <th style={{ textAlign: 'left', minWidth: '200px' }}>Covers</th>
                              <th className="rating-col" style={{ textAlign: 'center' }}>0</th>
                              <th className="rating-col" style={{ textAlign: 'center' }}>1</th>
                              <th className="rating-col" style={{ textAlign: 'center' }}>2</th>
                              <th className="rating-col" style={{ textAlign: 'center' }}>3</th>
                              <th className="rating-col" style={{ textAlign: 'center' }}>4</th>
                            </tr>
                          </thead>
                          <thead style={{ background: 'var(--gray-ltest)', fontSize: '9px', color: 'var(--gray-md)', fontWeight: '600' }}>
                            <tr>
                              <th colSpan={2}></th>
                              <th style={{ textAlign: 'center' }}>No knowledge</th>
                              <th style={{ textAlign: 'center' }}>Aware</th>
                              <th style={{ textAlign: 'center' }}>Practitioner</th>
                              <th style={{ textAlign: 'center' }}>Advanced</th>
                              <th style={{ textAlign: 'center' }}>Expert</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeStack.skills.filter((skill) => skill.name !== 'Others').map((skill) => (
                              (() => {
                                const coverNames = getSkillCoverNames(skill);
                                return coverNames.map((coverName, coverIndex) => {
                                  const rowKey = `${skill.id}-${coverName}-${coverIndex}`;
                                  const displayCover = skill.name === 'Others' ? primaryCovers[skill.id] || 'Custom cover' : coverName;
                                  const isFirstRow = coverIndex === 0;
                                  const skillRating = skill.name === 'Others' ? coverRatings[skill.id]?.[displayCover] : coverRatings[skill.id]?.[coverName];

                                  return (
                                    <tr key={rowKey}>
                                      {isFirstRow ? (
                                        <td className="sname" rowSpan={coverNames.length}>
                                          {skill.name}
                                        </td>
                                      ) : null}
                                      <td style={{ fontSize: '11px', color: 'var(--gray-dk)' }}>
                                        {skill.name === 'Others' ? (
                                          <input
                                            type="text"
                                            value={primaryCovers[skill.id] || ''}
                                            onChange={(e) =>
                                              setPrimaryCovers((prev) => ({ ...prev, [skill.id]: e.target.value }))
                                            }
                                            placeholder="Enter cover"
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
                                          />
                                        ) : (
                                          displayCover
                                        )}
                                      </td>
                                      {[0, 1, 2, 3, 4].map((score) => (
                                        <td key={`${rowKey}-${score}`} className="rating-col">
                                          <button
                                            type="button"
                                            className={`rpip rpip-mini ${skillRating === score ? `sel-${score}` : ''}`}
                                            onClick={() => setCoverRating(skill.id, displayCover, score)}
                                            style={{
                                              background: skillRating === score ? scColor(score) : 'var(--gray-ltest)',
                                              color:
                                                skillRating === score && score === 3
                                                  ? 'var(--primary)'
                                                  : skillRating === score
                                                    ? 'white'
                                                    : 'var(--gray-md)',
                                            }}
                                          >
                                            {score}
                                          </button>
                                        </td>
                                      ))}
                                    </tr>
                                  );
                                });
                              })()
                            ))}
                          </tbody>
                        </table>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px',
                            flexWrap: 'wrap',
                            marginTop: '1rem',
                          }}
                        >
                          <div style={{ fontSize: '12px', color: 'var(--gray-md)', fontWeight: '600' }}>
                            {activeStacks.length ? `${activeCardIndex + 1} / ${activeStacks.length}` : '0 / 0'}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              className="btn btn-sec btn-sm"
                              onClick={goToPrevStack}
                              disabled={!activeStacks.length || activeCardIndex === 0}
                              style={{
                                opacity: !activeStacks.length || activeCardIndex === 0 ? 0.5 : 1,
                                cursor: !activeStacks.length || activeCardIndex === 0 ? 'not-allowed' : 'pointer',
                              }}
                            >
                              Prev
                            </button>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={goToNextStack}
                              disabled={!activeStacks.length || activeCardIndex >= activeStacks.length - 1}
                              style={{
                                opacity:
                                  !activeStacks.length || activeCardIndex >= activeStacks.length - 1
                                    ? 0.5
                                    : 1,
                                cursor:
                                  !activeStacks.length || activeCardIndex >= activeStacks.length - 1
                                    ? 'not-allowed'
                                    : 'pointer',
                              }}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Action Buttons */}
                <div className="btn-row">
                  <button
                    className="btn btn-primary"
                    onClick={submitRatings}
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
                      fontSize: '15px',
                      fontWeight: '700',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'white',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {(profile.name || 'User').split(' ')[0]}'s Score Report
                  </div>
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
                      Overall
                    </div>
                    <div style={{ background: 'rgba(255,255,255,.07)', padding: '9px 12px', borderRadius: '6px', maxWidth: '240px' }}>
                      <div style={{ fontSize: '9px', color: 'white', textTransform: 'uppercase', marginBottom: '3px' }}>
                        Overall Score
                      </div>
                      <div style={{ fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '4px', lineHeight: 1.1 }}>
                        {calculatePercentage(overallScore, overallMaxScore)}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.7)' }}>
                        {overallScore}/{overallMaxScore}
                      </div>
                    </div>
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
                        <div style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
                          {calculatePercentage(calculateCategoryScore(['programming', 'mobile', 'frontend', 'backend', 'database', 'api', 'architecture', 'testing', 'devopsstack', 'agilescrum']), calculateMaxScore(['programming', 'mobile', 'frontend', 'backend', 'database', 'api', 'architecture', 'testing', 'devopsstack', 'agilescrum']))}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.7)' }}>
                          {calculateCategoryScore(['programming', 'mobile', 'frontend', 'backend', 'database', 'api', 'architecture', 'testing', 'devopsstack', 'agilescrum'])}/{calculateMaxScore(['programming', 'mobile', 'frontend', 'backend', 'database', 'api', 'architecture', 'testing', 'devopsstack', 'agilescrum'])}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,.07)', padding: '9px 12px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '9px', color: 'white', textTransform: 'uppercase', marginBottom: '3px' }}>
                          Cloud & Infra Score
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
                          {calculatePercentage(calculateCategoryScore(['cloudinfra']), calculateMaxScore(['cloudinfra']))}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.7)' }}>
                          {calculateCategoryScore(['cloudinfra'])}/{calculateMaxScore(['cloudinfra'])}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,.07)', padding: '9px 12px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '9px', color: 'white', textTransform: 'uppercase', marginBottom: '3px' }}>
                          Cybersec Score
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
                          {calculatePercentage(calculateCategoryScore(['cybersecuritystack']), calculateMaxScore(['cybersecuritystack']))}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.7)' }}>
                          {calculateCategoryScore(['cybersecuritystack'])}/{calculateMaxScore(['cybersecuritystack'])}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,.07)', padding: '9px 12px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '9px', color: 'white', textTransform: 'uppercase', marginBottom: '3px' }}>
                          Data Engg, Analytics & ML Score
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
                          {calculatePercentage(calculateCategoryScore(['dataengml']), calculateMaxScore(['dataengml']))}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.7)' }}>
                          {calculateCategoryScore(['dataengml'])}/{calculateMaxScore(['dataengml'])}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,.07)', padding: '9px 12px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '9px', color: 'white', textTransform: 'uppercase', marginBottom: '3px' }}>
                          Products & Platforms Score
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
                          {calculatePercentage(calculateCategoryScore(['industryplatforms']), calculateMaxScore(['industryplatforms']))}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.7)' }}>
                          {calculateCategoryScore(['industryplatforms'])}/{calculateMaxScore(['industryplatforms'])}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,.07)', padding: '9px 12px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '9px', color: 'white', textTransform: 'uppercase', marginBottom: '3px' }}>
                          AI Stack Score
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
                          {calculatePercentage(calculateCategoryScore(['aigenaiaagentic']), calculateMaxScore(['aigenaiaagentic']))}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.7)' }}>
                          {calculateCategoryScore(['aigenaiaagentic'])}/{calculateMaxScore(['aigenaiaagentic'])}
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
                        <div style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
                          {calculatePercentage(calculateCategoryScore(['corebehavioural']), calculateMaxScore(['corebehavioural']))}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.7)' }}>
                          {calculateCategoryScore(['corebehavioural'])}/{calculateMaxScore(['corebehavioural'])}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,.07)', padding: '9px 12px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '9px', color: 'white', textTransform: 'uppercase', marginBottom: '3px' }}>
                          V&A Score
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
                          {calculatePercentage(calculateCategoryScore(['voiceaccent']), calculateMaxScore(['voiceaccent']))}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.7)' }}>
                          {calculateCategoryScore(['voiceaccent'])}/{calculateMaxScore(['voiceaccent'])}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="btn-row">
                  <button className="btn btn-primary" onClick={() => setShowResults(false)}>
                    Edit Ratings
                  </button>
                  <button className="btn btn-primary" onClick={downloadExcelReport}>
                    Download Excel
                  </button>
                  <button className="btn btn-primary" onClick={downloadPdfReport}>
                    Download PDF
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
            <div className="ph-desc">Team skill assessment overview with employee search and rating filters.</div>

            <div className="card" style={{ marginTop: '1rem' }}>
              <div className="card-body" style={{ padding: 0 }}>
                <div style={{ padding: '1rem 1rem 0.25rem' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gray-md)' }}>
                    Summary
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
                    Average Score
                  </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="manager-table">
                    <thead>
                      <tr>
                        {managerSummaryColumns.map((column) => (
                          <th key={column.label} style={{ textAlign: 'center' }}>
                            {column.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {managerSummaryColumns.map((column) => (
                          <td key={column.label} style={{ textAlign: 'center', fontWeight: 700 }}>
                            {column.value}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
              <div className="card-body" style={{ padding: 0 }}>
                <div style={{ padding: '1rem 1rem 0.25rem' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
                    TOP FSE EDUCATORS
                  </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="manager-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Employee ID</th>
                        <th>Designation</th>
                        <th>Location</th>
                        <th style={{ textAlign: 'center' }}>Score</th>
                        <th>Core Skills</th>
                      </tr>
                    </thead>
                    <tbody>
                      {managerVisibleEmployees.map((employee) => {
                        const metrics = getEmployeeMetrics(employee);
                        const displayName = employee.name
                          .split(/\s+/)
                          .filter(Boolean)
                          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                          .join(' ');

                        return (
                          <tr key={employee.id}>
                            <td>
                              <div style={{ display: 'grid', gap: '4px' }}>
                                <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '13px' }}>{displayName}</div>
                              </div>
                            </td>
                            <td style={{ fontWeight: 600, color: 'var(--gray-dk)' }}>{employee.employeeId}</td>
                            <td>{employee.designation || '-'}</td>
                            <td>{employee.location || '-'}</td>
                            <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--primary)' }}>{metrics.percentage}%</td>
                            <td>
                              <span style={{ fontSize: '11px', color: 'var(--gray-dk)', lineHeight: 1.5 }}>
                                {(() => {
                                  const coreSkills = metrics.topSkills.filter((skill) => {
                                    const normalizedSkillId = skill.skillId.trim().toLowerCase();
                                    return !normalizedSkillId.endsWith('_others') && normalizedSkillId !== 'others';
                                  });
                                  const highestRating = coreSkills.length ? Math.max(...coreSkills.map((skill) => skill.score)) : 0;
                                  return coreSkills
                                    .filter((skill) => skill.score === highestRating)
                                    .map((skill) => SKILL_NAME_BY_ID[skill.skillId] || skill.skillId)
                                    .join(', ');
                                })() || '-'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: '1.5rem' }}>
              <div className="card-body">
                <div style={{ padding: '0 0 0.75rem' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
                    Search Educators
                  </div>
                </div>
                <div style={{ display: 'grid', gap: '14px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                  <div className="field">
                    <label>Name</label>
                    <input
                      type="text"
                      value={managerSearch}
                      onChange={(e) => setManagerSearch(e.target.value)}
                      placeholder="Search educator name"
                    />
                  </div>
                  <div className="field">
                    <label>EMPLOYEE ID</label>
                    <input
                      type="text"
                      value={managerEmployeeId}
                      onChange={(e) => setManagerEmployeeId(e.target.value)}
                      placeholder="Employee ID"
                    />
                  </div>
                  <div className="field">
                    <label>DESIGNATION</label>
                    <input
                      type="text"
                      value={managerDesignation}
                      onChange={(e) => setManagerDesignation(e.target.value)}
                      placeholder="Designation"
                    />
                  </div>
                  <div className="field">
                    <label>LOCATION</label>
                    <input
                      type="text"
                      value={managerLocation}
                      onChange={(e) => setManagerLocation(e.target.value)}
                      placeholder="Location"
                    />
                  </div>
                  <div className="field">
                    <label>SCORE</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={managerScore}
                      onChange={(e) => setManagerScore(e.target.value)}
                      placeholder="Minimum score"
                    />
                  </div>
                  <div className="field">
                    <label>Skill Category</label>
                    <select value={managerSkillCategory} onChange={(e) => setManagerSkillCategory(e.target.value)}>
                      <option value="">All categories</option>
                      {STACKS_WITH_OTHERS.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Skills</label>
                    <input
                      type="text"
                      value={managerSkills}
                      onChange={(e) => setManagerSkills(e.target.value)}
                      placeholder="Search skills"
                    />
                  </div>
                  <div className="field">
                    <label>Digital AI stack score</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={managerDigitalStackScore}
                      onChange={(e) => setManagerDigitalStackScore(e.target.value)}
                      placeholder="Minimum digital stack score"
                    />
                  </div>
                  <div className="field">
                    <label>AI stack score</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={managerAiStackScore}
                      onChange={(e) => setManagerAiStackScore(e.target.value)}
                      placeholder="Minimum AI stack score"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
              <div className="card-body">
                <div style={{ padding: '0 0 0.75rem' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
                    Analytics
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--gray-md)', marginTop: '4px' }}>
                    Visual summary of educator scores, category averages, and practitioner coverage.
                  </div>
                </div>
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
                  <div style={{ border: '1px solid var(--gray-ltr)', borderRadius: '12px', padding: '12px', background: 'white' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)', marginBottom: '10px' }}>
                      Educator Score Chart
                    </div>
                    <div style={{ width: '100%', height: '280px' }}>
                      <ResponsiveContainer>
                        <BarChart data={analyticsEducatorScores} margin={{ top: 10, right: 16, left: 0, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} height={60} />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="score" name="Score %" radius={[8, 8, 0, 0]} fill="#2F78C4">
                            {analyticsEducatorScores.map((entry, index) => (
                              <Cell key={entry.name} fill={index % 2 === 0 ? '#2F78C4' : '#06C7CC'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div style={{ border: '1px solid var(--gray-ltr)', borderRadius: '12px', padding: '12px', background: 'white' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)', marginBottom: '10px' }}>
                      Skill Category Averages
                    </div>
                    <div style={{ width: '100%', height: '280px' }}>
                      <ResponsiveContainer>
                        <BarChart data={analyticsCategoryScores} margin={{ top: 10, right: 16, left: 0, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="score" name="Average %" radius={[8, 8, 0, 0]} fill="#06C7CC">
                            {analyticsCategoryScores.map((entry, index) => (
                              <Cell key={entry.name} fill={index % 2 === 0 ? '#06C7CC' : '#7373D8'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div style={{ border: '1px solid var(--gray-ltr)', borderRadius: '12px', padding: '12px', background: 'white' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)', marginBottom: '10px' }}>
                      Practitioner Count by Skill Family
                    </div>
                    <div style={{ width: '100%', height: '280px' }}>
                      <ResponsiveContainer>
                        <BarChart data={analyticsPractitionerCounts} margin={{ top: 10, right: 16, left: 0, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} height={60} tick={{ fontSize: 9 }} />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="practitioners" name="Practitioners" radius={[8, 8, 0, 0]} fill="#2E308E" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!managerVisibleEmployees.length && (
              <div className="card" style={{ marginTop: '1rem' }}>
                <div className="card-body">
                  <p style={{ color: 'var(--gray-md)', textAlign: 'center', padding: '2rem' }}>
                    No employees match the current filters.
                  </p>
                </div>
              </div>
            )}

            <div className="btn-row" style={{ marginTop: '1.25rem' }}>
              <button className="btn btn-primary" onClick={downloadManagerReports}>
                Download All Employee Reports (Excel)
              </button>
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

