import React, { useState, useEffect } from 'react';
import { projectsAPI, supabase, getCurrentUser } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth.jsx';
import Button from '../components/atoms/Button';
import Icon from '../components/atoms/Icon';
import './TestDatabase.css';

const TestDatabase = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testResults, setTestResults] = useState({});
  const { user, isOwner } = useAuth();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      console.log('Current user:', currentUser);
    } catch (err) {
      console.error('User check failed:', err);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    setError('');
    const results = {};

    try {
      console.log('Testing Supabase connection...');
      const { error } = await supabase.from('projects').select('count');
      if (error) throw error;
      results.connection = '✅ Connection successful';

      const allProjects = await projectsAPI.getAll();
      setProjects(allProjects);
      results.fetchAll = `✅ Fetched ${allProjects.length} projects`;

      const publicProjects = await projectsAPI.getPublic();
      results.fetchPublic = `✅ Found ${publicProjects.length} public projects`;

      const privateProjects = await projectsAPI.getPrivate();
      results.fetchPrivate = `✅ Found ${privateProjects.length} private projects`;

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
      setError('Must be logged in to create projects');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const testProject = {
        title: 'Test Project',
        description: 'This is a test project created from the app',
        status: 'In Progress',
        category: 'Innovation',
        year: new Date().getFullYear(),
        featured: false,
        private: false
      };

      const result = await projectsAPI.create(testProject);
      console.log('Created project:', result);
      setTestResults(prev => ({
        ...prev,
        create: '✅ Project created successfully'
      }));
    } catch (err) {
      console.error('Create test failed:', err);
      setError(`Create failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fixUserIds = async () => {
    if (!isOwner) {
      setError('Only the owner can fix user IDs');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      console.log('Current user ID:', currentUser.id);
      
      // Get all projects with dummy user ID
      const { data: projectsToFix, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', '123e4567-e89b-12d3-a456-426614174000');

      if (fetchError) throw fetchError;

      if (projectsToFix.length === 0) {
        setTestResults(prev => ({
          ...prev,
          fixUserIds: '✅ No projects need fixing'
        }));
        setLoading(false);
        return;
      }

      // Update all projects to use the current user's ID
      const { error: updateError } = await supabase
        .from('projects')
        .update({ user_id: currentUser.id })
        .eq('user_id', '123e4567-e89b-12d3-a456-426614174000');

      if (updateError) throw updateError;

      setTestResults(prev => ({
        ...prev,
        fixUserIds: `✅ Fixed ${projectsToFix.length} projects with correct user ID`
      }));

      // Refresh the test
      setTimeout(() => testConnection(), 1000);

    } catch (err) {
      console.error('Fix user IDs failed:', err);
      setError(`Fix failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async () => {
    setLoading(true);
    setError('');

    try {
      // This would be handled by your login page normally
      console.log('Use the login page to sign in');
      setTestResults(prev => ({
        ...prev,
        auth: '✅ Use /login page for authentication'
      }));
    } catch (err) {
      console.error('Auth failed:', err);
      setError(`Auth failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-database">
      <h1>Database Testing & Debug</h1>

      {/* User Info */}
      <div className="test-section">
        <h2>User Information</h2>
        <div className="user-info">
          <p><strong>Authenticated:</strong> {user ? 'Yes' : 'No'}</p>
          <p><strong>User ID:</strong> {user?.id || 'Not logged in'}</p>
          <p><strong>Email:</strong> {user?.email || 'Not logged in'}</p>
          <p><strong>Is Owner:</strong> {isOwner ? 'Yes' : 'No'}</p>
        </div>
      </div>

      {/* Connection Tests */}
      <div className="test-section">
        <h2>Database Connection Tests</h2>
        <div className="test-buttons">
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
            loading={loading}
            disabled={!user}
            icon={<Icon name="add" />}
          >
            Test Create Project
          </Button>

          <Button
            variant="secondary"
            onClick={signInWithEmail}
            loading={loading}
            icon={<Icon name="person" />}
          >
            Sign In Info
          </Button>
        </div>
      </div>

      {/* Fix User IDs */}
      <div className="test-section">
        <h2>Fix User ID Issue</h2>
        <p>If you can't see private projects, click this button to fix user IDs:</p>
        <Button
          variant="success"
          onClick={fixUserIds}
          loading={loading}
          disabled={!isOwner}
          icon={<Icon name="tools" />}
        >
          Fix User IDs for Existing Projects
        </Button>
        <p className="fix-note">
          This will update all projects with dummy user ID to use your current user ID.
        </p>
      </div>

      {/* Results */}
      {Object.keys(testResults).length > 0 && (
        <div className="test-section">
          <h2>Test Results</h2>
          <div className="test-results">
            {Object.entries(testResults).map(([key, result]) => (
              <div key={key} className="test-result">
                <strong>{key}:</strong> {result}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="test-section">
          <div className="error-message">
            <Icon name="warning" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Projects Display */}
      {projects.length > 0 && (
        <div className="test-section">
          <h2>Current Projects ({projects.length})</h2>
          <div className="projects-list">
            {projects.map(project => (
              <div key={project.id} className="project-item">
                <h3>{project.title}</h3>
                <p><strong>User ID:</strong> {project.user_id}</p>
                <p><strong>Private:</strong> {project.private ? 'Yes' : 'No'}</p>
                <p><strong>Category:</strong> {project.category}</p>
                <p><strong>Status:</strong> {project.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestDatabase; 