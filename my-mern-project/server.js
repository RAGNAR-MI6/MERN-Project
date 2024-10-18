const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const Transaction = require('./models/Transaction'); // Ensure this path is correct
const cors = require('cors');



const app = express();
const PORT = 5000;

app.use(cors());

app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mydatabase', { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Route to initialize the database
app.post('/api/init-db', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;

        // Log the fetched data
        console.log('Fetched Data:', data);

        // Check if data was fetched successfully
        if (!data || data.length === 0) {
            console.error('No data fetched from the API');
            return res.status(500).send('No data fetched from the API');
        }

        // Save the fetched data into the MongoDB collection
        await Transaction.insertMany(data);

        res.status(200).send('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing the database:', error.message);
        res.status(500).send('Error initializing the database');
    }
});

// Basic route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the MERN Stack API!');
});

// Transactions
app.get('/api/transactions', async (req, res) => {
    try {
        const { month, search, page = 1, perPage = 10 } = req.query;

        console.log('Received query parameters:', { month, search, page, perPage }); // Log parameters

        // Mapping months to their respective numbers
        const monthMapping = {
            January: '01',
            February: '02',
            March: '03',
            April: '04',
            May: '05',
            June: '06',
            July: '07',
            August: '08',
            September: '09',
            October: '10',
            November: '11',
            December: '12'
        };

        const monthNumber = monthMapping[month];
        if (!monthNumber) {
            console.error('Invalid month parameter:', month);
            return res.status(400).send('Invalid month parameter');
        }

        // Create a date range for the specified month
        const startDate = new Date(`2021-${monthNumber}-01T00:00:00Z`);
        const endDate = new Date(`2021-${monthNumber}-01T00:00:00Z`);
        endDate.setMonth(endDate.getMonth() + 1); // Move to the first day of the next month

        // Create the filter object for date range
        const filter = {
            dateOfSale: { $gte: startDate, $lt: endDate }
        };

        // If search is provided, add to the filter
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        console.log('Final filter being used:', filter); // Log the filter object

        const skip = (page - 1) * perPage;
        const transactions = await Transaction.find(filter).skip(skip).limit(parseInt(perPage));
        const totalCount = await Transaction.countDocuments(filter);

        console.log('Fetched transactions:', transactions); // Log the fetched transactions

        res.status(200).json({
            transactions,
            totalPages: Math.ceil(totalCount / perPage),
            currentPage: page
        });
    } catch (error) {
        console.error('Error fetching transactions:', error); // Enhanced error logging
        res.status(500).send('Error fetching transactions');
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// statistics
app.get('/api/statistics', async (req, res) => {
    try {
        const { month } = req.query;

        // Map month names to numbers
        const monthMapping = {
            January: '01',
            February: '02',
            March: '03',
            April: '04',
            May: '05',
            June: '06',
            July: '07',
            August: '08',
            September: '09',
            October: '10',
            November: '11',
            December: '12'
        };

        const monthNumber = monthMapping[month];
        if (!monthNumber) {
            return res.status(400).send('Invalid month parameter');
        }

        // Create date range for the specified month
        const startDate = new Date(`2021-${monthNumber}-01T00:00:00Z`);
        const endDate = new Date(`2021-${monthNumber}-01T00:00:00Z`);
        endDate.setMonth(endDate.getMonth() + 1); // Move to the first day of the next month

        // Calculate total sales and sold items
        const soldItems = await Transaction.find({
            dateOfSale: { $gte: startDate, $lt: endDate },
            sold: true
        });

        const totalSales = soldItems.reduce((total, item) => total + item.price, 0);
        const totalSoldItems = soldItems.length;

        // Calculate total not sold items
        const totalNotSoldItems = await Transaction.countDocuments({
            dateOfSale: { $gte: startDate, $lt: endDate },
            sold: false
        });

        res.status(200).json({
            totalSales,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).send('Error fetching statistics');
    }
});


// Bar Chart
app.get('/api/bar-chart', async (req, res) => {
    try {
        const { month } = req.query;

        // Month mapping
        const monthMapping = {
            January: '01',
            February: '02',
            March: '03',
            April: '04',
            May: '05',
            June: '06',
            July: '07',
            August: '08',
            September: '09',
            October: '10',
            November: '11',
            December: '12'
        };

        const monthNumber = monthMapping[month];
        if (!monthNumber) {
            return res.status(400).send('Invalid month parameter');
        }

        // Create date range
        const startDate = new Date(`2021-${monthNumber}-01T00:00:00Z`);
        const endDate = new Date(`2021-${monthNumber}-01T00:00:00Z`);
        endDate.setMonth(endDate.getMonth() + 1);

        // Initialize price ranges
        const priceRanges = [
            { range: '0 - 100', count: 0 },
            { range: '101 - 200', count: 0 },
            { range: '201 - 300', count: 0 },
            { range: '301 - 400', count: 0 },
            { range: '401 - 500', count: 0 },
            { range: '501 - 600', count: 0 },
            { range: '601 - 700', count: 0 },
            { range: '701 - 800', count: 0 },
            { range: '801 - 900', count: 0 },
            { range: '901 and above', count: 0 },
        ];

        // Fetch items sold in the month
        const transactions = await Transaction.find({
            dateOfSale: { $gte: startDate, $lt: endDate },
            sold: true
        });

        // Count items in price ranges
        transactions.forEach(transaction => {
            const price = transaction.price;
            if (price <= 100) priceRanges[0].count++;
            else if (price <= 200) priceRanges[1].count++;
            else if (price <= 300) priceRanges[2].count++;
            else if (price <= 400) priceRanges[3].count++;
            else if (price <= 500) priceRanges[4].count++;
            else if (price <= 600) priceRanges[5].count++;
            else if (price <= 700) priceRanges[6].count++;
            else if (price <= 800) priceRanges[7].count++;
            else if (price <= 900) priceRanges[8].count++;
            else priceRanges[9].count++;
        });

        res.status(200).json(priceRanges);
    } catch (error) {
        console.error('Error fetching bar chart data:', error);
        res.status(500).send('Error fetching bar chart data');
    }
});

//PIE CHART
app.get('/api/pie-chart', async (req, res) => {
    try {
        const { month } = req.query;

        // Month mapping
        const monthMapping = {
            January: '01',
            February: '02',
            March: '03',
            April: '04',
            May: '05',
            June: '06',
            July: '07',
            August: '08',
            September: '09',
            October: '10',
            November: '11',
            December: '12'
        };

        const monthNumber = monthMapping[month];
        if (!monthNumber) {
            return res.status(400).send('Invalid month parameter');
        }

        // Create date range
        const startDate = new Date(`2021-${monthNumber}-01T00:00:00Z`);
        const endDate = new Date(`2021-${monthNumber}-01T00:00:00Z`);
        endDate.setMonth(endDate.getMonth() + 1);

        // Fetch transactions for the month
        const transactions = await Transaction.find({
            dateOfSale: { $gte: startDate, $lt: endDate },
            sold: true
        });

        // Count items by category
        const categoryCounts = {};
        transactions.forEach(transaction => {
            const category = transaction.category;
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        // Convert the counts object into an array
        const pieChartData = Object.keys(categoryCounts).map(category => ({
            category,
            count: categoryCounts[category]
        }));

        res.status(200).json(pieChartData);
    } catch (error) {
        console.error('Error fetching pie chart data:', error);
        res.status(500).send('Error fetching pie chart data');
    }
});



