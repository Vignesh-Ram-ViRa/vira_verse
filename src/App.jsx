import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/organisms/Header';
import Home from './screens/Home';
import About from './screens/About';
import Dashboard from './pages/Dashboard';
import TestDatabase from './pages/TestDatabase';
import Button from './components/atoms/Button';
import Icon from './components/atoms/Icon';
import { LANGUAGE_CONTENT } from './constants/language';
import './App.css';

function App() {
  const content = LANGUAGE_CONTENT;
  
  return (
    <Router>
      <div className="app">
        <Header />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/public-projects" element={
              <div className="demo-page">
                <h1>Public Projects</h1>
                <p>This will contain the public projects grid/list view.</p>
              </div>
            } />
            <Route path="/private-projects" element={
              <div className="demo-page">
                <h1>Private Projects</h1>
                <p>This will contain the private projects grid/list view.</p>
              </div>
            } />
            <Route path="/about" element={<About />} />
            <Route path="/test-database" element={<TestDatabase />} />
          </Routes>
        </main>

        {/* Demo Section to test components */}
        <section className="demo-section">
          <div className="container">
            <h2>Theme & Component Demo</h2>
            <p>Testing our component system and theme switching:</p>
            
            <div className="demo-buttons">
              <Button variant="primary" size="medium">
                Primary Button
              </Button>
              <Button variant="secondary" size="medium">
                Secondary Button
              </Button>
              <Button variant="ghost" size="medium" icon={<Icon name="add" />}>
                Ghost Button
              </Button>
              <Button variant="success" size="medium" icon={<Icon name="check" />}>
                Success Button
              </Button>
              <Button variant="danger" size="medium" icon={<Icon name="close" />}>
                Danger Button
              </Button>
            </div>

            <div className="demo-icons">
              <Icon name="home" size="large" onClick={() => alert('Home clicked!')} />
              <Icon name="folder" size="large" onClick={() => alert('Folder clicked!')} />
              <Icon name="lock" size="large" onClick={() => alert('Lock clicked!')} />
              <Icon name="github" size="large" onClick={() => alert('GitHub clicked!')} />
              <Icon name="linkExternal" size="large" onClick={() => alert('Link clicked!')} />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <p>{content.footer.copyright}</p>
            <div className="footer__social">
              <a 
                href={content.footer.socialLinks.github} 
                target="_blank" 
                rel="noopener noreferrer"
                title="GitHub"
              >
                <Icon name="github" size="medium" />
              </a>
              <a 
                href={content.footer.socialLinks.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                title="LinkedIn"
              >
                <Icon name="person" size="medium" />
              </a>
              <a 
                href={content.footer.socialLinks.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                title="Twitter"
              >
                <Icon name="twitter" size="medium" />
              </a>
              <a 
                href={content.footer.socialLinks.email} 
                title="Email"
              >
                <Icon name="mail" size="medium" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;