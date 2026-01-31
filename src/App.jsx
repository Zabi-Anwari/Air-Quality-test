import React, { useState, lazy, Suspense } from 'react';
import NavBar from './components/NavBar.jsx';
import Footer from './components/Footer.jsx';
import { LanguageProvider, useLanguage } from './i18n.js';

const HomePage = lazy(() => import('./components/HomePage.jsx'));
const AboutPage = lazy(() => import('./components/AboutPage.jsx'));
const ServicesPage = lazy(() => import('./components/ServicesPage.jsx'));

const LoadingSpinner = () => {
  const { t } = useLanguage();
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <p>{t('app.loading')}</p>
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          marginTop: '20px',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h2 style={{ color: '#dc2626', margin: '0 0 10px 0' }}>Error Loading Component</h2>
          <p style={{ color: '#991b1b', margin: '0 0 10px 0' }}>{this.state.error?.message}</p>
          <details style={{ cursor: 'pointer' }}>
            <summary>Details</summary>
            <pre style={{
              backgroundColor: '#f3f4f6',
              padding: '10px',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '12px'
            }}>{this.state.error?.stack}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  const [activePage, setActivePage] = useState('home');

  const renderPage = () => {
    switch (activePage) {
      case 'about':
        return <AboutPage />;
      case 'services':
        return <ServicesPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <LanguageProvider>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f0f0'
      }}>
        <NavBar activePage={activePage} setActivePage={setActivePage} />
        <main style={{ flex: 1, padding: '20px' }}>
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              {renderPage()}
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default App;