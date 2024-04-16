const express = require('express');
const bodyParser = require('body-parser');
// const dashboardRoutes = require('./routes/dashboardRoutes');
const app = express();
const axios = require('axios');
const cors = require('cors');

require('dotenv').config();
 
const corsOptions = {
    origin: ['http://localhost/', 'http://localhost:3000/react_task', 'http://localhost:3000', 'http://localhost/', 'http://localhost:3001/react_task', 'http://localhost:3001', 'https://github.com/'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Fetch Pages associated with user's account
app.get('/api/pages', async (req, res) => {
    // console.log("a");
    try {
        const response = await axios.get(`https://graph.facebook.com/v19.0/me/accounts?access_token=${process.env.ACCESS_TOKEN}`);
        // console.log(response);
        res.json(response.data.data); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

app.post('/api/insights', async (req, res) => {
    try {
      const { pageId, since, until, limit } = req.body;
  
      // Validate input (optional, but recommended for robustness)
      if (!pageId || !since || !until) {
        return res.status(400).json({ message: 'Missing required parameters' });
      }
  
      // Build the Facebook Insights API request URL
      const url = `https://graph.facebook.com/v15.0/${pageId}/insights?fields=impressions,reach,clicks&since=${since}&until=${until}&limit=${limit}`; // Adjust fields as needed
  
      // Make the request using Axios
      const response = await axios.get(url, {
        params: { access_token: process.env.ACCESS_TOKEN } // Replace with your access token
      });
  
      // Check for errors or successful response
      if (response.status === 200) {
        res.json(response.data);
      } else {
        console.error('Error fetching insights:', response.data);
        res.status(500).json({ message: 'Error retrieving insights' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  


 
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});