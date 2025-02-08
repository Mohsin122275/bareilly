const express = require('express');
const axios = require('axios');
const { PythonShell } = require('python-shell');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;  // Render ke liye port dynamic rakha hai

// Middleware to serve static frontend files
app.use(express.static('frontend'));

// Route to get stock prediction
app.get('/predict', async (req, res) => {
    try {
        // Fetch live stock data from Yahoo Finance
        const response = await axios.get('https://query1.finance.yahoo.com/v7/finance/quote?symbols=RELIANCE.NS');
        const stockPrice = response.data.quoteResponse.result[0].regularMarketPrice;

        // Run Python script for prediction
        const scriptPath = path.join(__dirname, 'backend', 'stock_prediction.py');
        const options = { args: [stockPrice] };

        PythonShell.run(scriptPath, options, (err, result) => {
            if (err) {
                console.error("Python script error:", err);
                return res.status(500).json({ error: "Python script failed" });
            }
            res.json({ currentPrice: stockPrice, prediction: result[0] });
        });
    } catch (error) {
        console.error("Stock API Error:", error);
        res.status(500).json({ error: "Failed to fetch stock data" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(Server running at http://localhost:${port});
});