// src/components/TransactionTable.js

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';



const TransactionTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [month, setMonth] = useState('September'); // Default month

    const fetchTransactions = useCallback(async (month, search = '', page = 1, perPage = 10) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/transactions?month=${month}&search=${search}&page=${page}&perPage=${perPage}`);
            setTransactions(response.data.transactions);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError('Failed to fetch transactions. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions(month, search, page + 1, rowsPerPage); // Fetch transactions with current month, search, page, and rows per page
    }, [fetchTransactions, month, search, page, rowsPerPage]);

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(0); // Reset to first page on new search
    };

    const handleMonthChange = (event) => {
        setMonth(event.target.value);
        setPage(0); // Reset to first page on month change
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Transaction Table</h2>
            <div className='filterSection'>
                <label>
                    Month:
                    <select value={month} onChange={handleMonthChange}>
                        <option value="January">January</option>
                        <option value="February">February</option>
                        <option value="March">March</option>
                        <option value="April">April</option>
                        <option value="May">May</option>
                        <option value="June">June</option>
                        <option value="July">July</option>
                        <option value="August">August</option>
                        <option value="September">September</option>
                        <option value="October">October</option>
                        <option value="November">November</option>
                        <option value="December">December</option>
                    </select>
                </label>
                <label>
                    Search:
                    <input type="text" value={search} onChange={handleSearchChange} placeholder="Search..." />
                </label>
            </div>
            <table className='tableSection'>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Date of Sale</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(transaction => (
                        <tr key={transaction._id}>
                            <td>{transaction.title}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.price}</td>
                            <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Pagination Controls */}
            <div className='pagiNAtion'>
                <div>
                    <button 
                        onClick={() => handleChangePage(page - 1)} 
                        disabled={page === 0}>
                        Previous
                    </button>
                    <span>{` Page ${page + 1} of ${totalPages} `}</span>
                </div>

                <div>
                    <button className='nextButton'
                        onClick={() => handleChangePage(page + 1)} 
                        disabled={page >= totalPages - 1}>
                        Next
                    </button>
                    <select value={rowsPerPage} onChange={handleChangeRowsPerPage}>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default TransactionTable;
