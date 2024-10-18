# My MERN Project

A web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) that provides insights through statistics and visualizations of sales data.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [User Interface](#user-interface)
- [Contributing](#contributing)


## Features

- User-friendly interface to view and filter sales statistics.
- Interactive charts (bar and pie charts) for data visualization.
- API endpoints for fetching sales data.
- Pagination controls for better navigation of transaction data.

## Installation

1. Clone the repository:

2. Navigate to the project directory:

   ```bash
   cd my-mern-project
   ```

3. Install the backend dependencies:

   ```bash
   cd backend
   npm install
   ```

4. Install the frontend dependencies:

   ```bash
   cd ../client
   npm install
   ```

5. Ensure MongoDB is running on your machine.

6. Create a `.env` file in the `backend` directory and add the necessary environment variables (if applicable).

## Usage

1. Start the backend server:

   ```bash
   cd backend
   npm start
   ```

2. Start the frontend application:

   ```bash
   cd ../client
   npm start
   ```

3. Open your web browser and navigate to `http://localhost:3000` to access the application.

## API Endpoints

### Statistics API

- **GET /api/statistics**
  - Returns total sales, total sold items, and total not sold items.

### Transaction API

- **GET /api/transactions**
  - Fetches a list of transactions with pagination.

### Bar Chart API

- **GET /api/charts/bar**
  - Returns data for the bar chart visualization.

### Pie Chart API

- **GET /api/charts/pie**
  - Returns data for the pie chart visualization.

## User Interface

The user interface includes:

- A dropdown to filter transactions by month.
- A search bar to filter transactions.
- A table to display transaction details (Title, Description, Price, Date of Sale).
- Pagination controls to navigate through transaction data.

### CSS Styling

The project is styled using custom CSS for a clean and modern look, with responsive design principles applied.

## Contributing

If you would like to contribute to this project, please fork the repository and create a pull request. Ensure that your code adheres to the project's coding standards and passes any existing tests.

## Self

In case of any queries feel free to reach out to me at rushikeshpatil2100@gmail.com
