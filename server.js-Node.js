const express = require('express');
const axios = require('axios');
const { PythonShell } = require('python-shell');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;  // Render के लिए Dynamic Port

// Middleware: Static Files
app.use(express.static('frontend'));

// Stock Prediction Route
app.get('/predict', async (req, res) => {
    try {
        // Live Stock Price Yahoo Finance से
        const response = await axios.get('https://query1.finance.yahoo.com/v7/finance/quote?symbols=RELIANCE.NS');
        const stockPrice = response.data.quoteResponse.result[0].regularMarketPrice;

        // Python Script Path
        const scriptPath = path.join(__dirname, 'backend', 'stock_prediction.py');
        console.log("Running Python Script:", scriptPath);

        const options = { args: [stockPrice] };

        // Python Script Run करो
        PythonShell.run(scriptPath, options, (err, result) => {
            if (err) {
                console.error("Python script error:", err);
                return res.status(500).json({ error: "Python script failed" });
            }
            console.log("Python Output:", result);
            res.json({ currentPrice: stockPrice, prediction: result ? result[0] : "N/A" });
        });
    } catch (error) {
        console.error("Stock API Error:", error);
        res.status(500).json({ error: "Failed to fetch stock data" });
    }
});

// Server Start
app.listen(PORT, () => {
    console.log(Server running at http://localhost:${PORT});
});