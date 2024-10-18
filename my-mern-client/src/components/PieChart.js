// src/components/PieChart.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend } from 'recharts';

const PieChartComponent = () => {
    const [pieChartData, setPieChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPieChartData = async (month) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/pie-chart?month=${month}`);
            setPieChartData(response.data);
        } catch (err) {
            setError('Failed to fetch pie chart data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPieChartData('September'); // Fetch pie chart data for September by default
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='pieChart'>
            <h2>Pie Chart Data for September</h2>
            <PieChart width={400} height={400}>
                <Pie
                    data={pieChartData}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                >
                    {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                    ))}
                </Pie>
                <Legend />
            </PieChart>
        </div>
    );
};

export default PieChartComponent;
