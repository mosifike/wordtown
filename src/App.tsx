import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import OnboardingWizard from './pages/OnboardingWizard';
import BookSelection from './pages/BookSelection';
import Home from './pages/Home';
import WordLearning from './pages/WordLearning';
import ReviewCenter from './pages/ReviewCenter';
import StatsDashboard from './pages/StatsDashboard';
import Settings from './pages/Settings';
import Navigation from './components/Navigation';
import { useAppStore } from './stores/appStore';

function App() {
  const { userProfile, selectedBook } = useAppStore();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900">
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/onboarding" element={<OnboardingWizard />} />
          <Route path="/select-book" element={<BookSelection />} />
          <Route path="/home" element={<Home />} />
          <Route path="/learn/:wordId" element={<WordLearning />} />
          <Route path="/review" element={<ReviewCenter />} />
          <Route path="/stats" element={<StatsDashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route 
            path="/" 
            element={
              !userProfile ? <Navigate to="/welcome" /> :
              !selectedBook ? <Navigate to="/select-book" /> :
              <Navigate to="/home" />
            } 
          />
        </Routes>
        {userProfile && selectedBook && <Navigation />}
      </div>
    </BrowserRouter>
  );
}

export default App;
