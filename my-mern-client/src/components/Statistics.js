// src/components/Statistics.js

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Statistics = () => {
    const [statistics, setStatistics] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchStatistics = useCallback(async (month) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/statistics?month=${month}`);
            setStatistics(response.data);
        } catch (err) {
            setError('Failed to fetch statistics. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []); // No dependencies here since we want it to remain the same

    useEffect(() => {
        fetchStatistics('September'); // Fetch statistics for September by default
    }, [fetchStatistics]); // Only re-run if fetchStatistics changes

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='statisticsSection'>
            <h2>Statistics for September</h2>
            <p>Total Sales: {statistics.totalSales}</p>
            <p>Total Sold Items: {statistics.totalSoldItems}</p>
            <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
        </div>
    );
};

export default Statistics;
