// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TransactionTable from './components/TransactionTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChartComponent from './components/PieChart';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="App">
                <h1 className='appHeader'>MERN Stack Transactions</h1>
                <nav className='navbar'>
                    <Link className='navbarElements' to="/">Transactions</Link> | 
                    <Link className='navbarElements' to="/statistics"> Statistics</Link> | 
                    <Link className='navbarElements' to="/bar-chart"> Bar Chart</Link> | 
                    <Link className='navbarElements' to="/pie-chart"> Pie Chart</Link>
                </nav>
                <Routes>
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/bar-chart" element={<BarChart />} />
                    <Route path="/pie-chart" element={<PieChartComponent />} />
                    <Route path="/" element={<TransactionTable />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;

// $env:NODE_OPTIONS = "--openssl-legacy-provider"