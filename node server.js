const express = require('express');
const axios = require('axios');
const { PythonShell } = require('python-shell');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Static files serve करें
app.use(express.static('frontend'));

// Stock Prediction Route
app.get('/predict', async (req, res) => {
    try {
        const response = await axios.get('https://query1.finance.yahoo.com/v7/finance/quote?symbols=RELIANCE.NS');
        const stockPrice = response.data.quoteResponse.result[0].regularMarketPrice;

        const scriptPath = path.join(__dirname, 'backend', 'stock_prediction.py');
        console.log("Python script path:", scriptPath);

        let options = { args: [stockPrice] };

        // Python script execute करें
        PythonShell.run(scriptPath, options, (err, messages) => {
            if (err) {
                console.error("Python script error:", err);
                return res.status(500).json({ error: "Python script failed" });
            }

            res.json({ currentPrice: stockPrice, prediction: messages ? messages[0] : "No Prediction" });
        });

    } catch (error) {
        console.error("Stock API Error:", error);
        res.status(500).json({ error: "Failed to fetch stock data" });
    }
});

// Server Start
app.listen(port, () => {
    console.log(Server running at http://localhost:${port});
});