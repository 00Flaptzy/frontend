import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './components/mainPage.jsx';
import Login from './components/authorization/login.jsx';  // CORREGIDO
import Register from './components/authorization/register.jsx';  // CORREGIDO
import { Habits } from './components/habitsPage.jsx';
import UserProfile from './components/userProfile.jsx';
import InternalServerError from './components/internalServerError.jsx';
import HabitCompletions from './components/habitCompletions.jsx';
import ThemeWrapper from './utils/themeWrapper.jsx';
import NotFound from './components/notFound.jsx';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('No se encontró el elemento root');
}

const root = ReactDOM.createRoot(rootElement);

function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ThemeWrapper><MainPage /></ThemeWrapper>} />
          <Route path='/habits' element={<ThemeWrapper><Habits /></ThemeWrapper>} />
          <Route path='/login' element={<ThemeWrapper><Login /></ThemeWrapper>} />
          <Route path='/register' element={<ThemeWrapper><Register /></ThemeWrapper>} />
          <Route path='/internal-server-error' element={<ThemeWrapper><InternalServerError /></ThemeWrapper>} />
          <Route path='/user-profile' element={<ThemeWrapper><UserProfile /></ThemeWrapper>} />
          <Route path='/to-many-requests' element={<ThemeWrapper><div>Too many requests</div></ThemeWrapper>} />
          <Route path='/habit_completions/:id' element={<ThemeWrapper><HabitCompletions /></ThemeWrapper>} />
          <Route path='*' element={<ThemeWrapper><NotFound /></ThemeWrapper>}/>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}

root.render(<App />);