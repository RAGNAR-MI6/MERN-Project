// src/components/BarChart.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const BarChartComponent = () => {
    const [barChartData, setBarChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchBarChartData = async (month) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/bar-chart?month=${month}`);
            setBarChartData(response.data);
        } catch (err) {
            setError('Failed to fetch bar chart data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBarChartData('September'); // Fetch bar chart data for September by default
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='barChart'>
            <h2>Bar Chart Data for September</h2>
            <BarChart width={600} height={300} data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
        </div>
    );
};

export default BarChartComponent;
