import './App.css';
import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <NavLink to="/activities" className="navbar-brand">
            OctoFit Tracker
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  to="/activities"
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  Activities
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/leaderboard"
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  Leaderboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/teams"
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  Teams
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/users"
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  Users
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/workouts"
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  Workouts
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container app-main">
        <Routes>
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<Activities />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
