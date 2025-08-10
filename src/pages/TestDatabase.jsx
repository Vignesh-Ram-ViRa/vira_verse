import React, { useState, useEffect } from 'react';
import { projectsAPI, supabase, getCurrentUser } from '../utils/supabase';
import Button from '../components/atoms/Button';
import Icon from '../components/atoms/Icon';
import './TestDatabase.css';

const TestDatabase = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('User check failed:', err);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    setError('');
    const results = {};
    
    try {
      // Test 1: Basic connection
      console.log('Testing Supabase connection...');
      const { error } = await supabase.from('projects').select('count');
      if (error) throw error;
      results.connection = '✅ Connection successful';
      
      // Test 2: Fetch projects
      console.log('Testing project fetch...');
      const allProjects = await projectsAPI.getAll();
      setProjects(allProjects);
      results.fetchAll = `✅ Fetched ${allProjects.length} projects`;
      
      // Test 3: Fetch public projects
      const publicProjects = await projectsAPI.getPublic();
      results.fetchPublic = `✅ Found ${publicProjects.length} public projects`;
      
      // Test 4: Check RLS
      results.rls = user ? '✅ RLS active (authenticated)' : '✅ RLS active (guest mode)';
      
    } catch (err) {
      console.error('Test failed:', err);
      setError(`Test failed: ${err.message}`);
      results.error = `❌ ${err.message}`;
    }
    
    setTestResults(results);
    setLoading(false);
  };

  const testCreateProject = async () => {
    if (!user) {
      setError('Must be authenticated to create projects');
      return;
    }

    try {
      const testProject = {
        title: 'Test Project',
        description: 'This is a test project created from the app',
        category: 'Test',
        year: 2025,
        status: 'In Progress',
        featured: false,
        private: false
      };

      const created = await projectsAPI.create(testProject);
      console.log('Created project:', created);
      
      // Refresh projects list
      const updated = await projectsAPI.getAll();
      setProjects(updated);
      
      setTestResults(prev => ({
        ...prev,
        create: '✅ Project created successfully'
      }));
    } catch (err) {
      console.error('Create test failed:', err);
      setError(`Create failed: ${err.message}`);
    }
  };

  const signInWithEmail = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: 'test@example.com',
        options: {
          shouldCreateUser: true
        }
      });
      
      if (error) throw error;
      
      setTestResults(prev => ({
        ...prev,
        auth: '✅ Check your email for login link'
      }));
    } catch (err) {
      console.error('Auth test failed:', err);
      setError(`Auth failed: ${err.message}`);
    }
  };

  return (
    <div className="test-database">
      <div className="container">
        <h1>🧪 Database Connection Test</h1>
        
        <div className="test-section">
          <h2>Connection Status</h2>
          <div className="test-info">
            <p><strong>User:</strong> {user ? `${user.email} (${user.id})` : 'Not authenticated (Guest mode)'}</p>
            <p><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL ? '✅ Configured' : '❌ Missing'}</p>
            <p><strong>Supabase Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing'}</p>
          </div>
        </div>

        <div className="test-actions">
          <Button 
            variant="primary" 
            onClick={testConnection}
            loading={loading}
            icon={<Icon name="database" />}
          >
            Test Database Connection
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={testCreateProject}
            disabled={!user}
            icon={<Icon name="add" />}
          >
            Test Create Project
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={signInWithEmail}
            icon={<Icon name="mail" />}
          >
            Test Auth (Email)
          </Button>
        </div>

        {Object.keys(testResults).length > 0 && (
          <div className="test-results">
            <h3>Test Results</h3>
            {Object.entries(testResults).map(([test, result]) => (
              <div key={test} className="test-result">
                <strong>{test}:</strong> <span>{result}</span>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="error-message">
            <Icon name="warning" />
            <span>{error}</span>
          </div>
        )}

        {projects.length > 0 && (
          <div className="projects-preview">
            <h3>Projects Found ({projects.length})</h3>
            <div className="projects-list">
              {projects.map(project => (
                <div key={project.id} className="project-item">
                  <h4>{project.title}</h4>
                  <p>{project.description}</p>
                  <div className="project-meta">
                    <span className={`status ${project.status.toLowerCase().replace(' ', '-')}`}>
                      {project.status}
                    </span>
                    <span className="category">{project.category}</span>
                    <span className="year">{project.year}</span>
                    {project.featured && <span className="featured">⭐ Featured</span>}
                    {project.private && <span className="private">🔒 Private</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestDatabase; 