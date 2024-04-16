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
  let { pageId, since, until, limit } = req.body;
  limit = 10;
  try {
      const postsResponse = await axios.get(`https://graph.facebook.com/v12.0/${pageId}/feed?access_token=${process.env.ACCESS_TOKENN}&fields=id&since=${new Date(since).getTime() / 1000}&until=${new Date(until).getTime() / 1000}&limit=${limit}`);
      const posts = postsResponse.data.data;

      // Fetch insights for each post
      const insightsPromises = posts.map(async (post) => {
          const postId = post.id;
          const insightsResponse = await axios.get(`https://graph.facebook.com/v19.0/${postId}/insights?metric=post_impressions_unique,post_impressions&access_token=${process.env.ACCESS_TOKENN}`);
          console.log(`https://graph.facebook.com/v19.0/${postId}/insights?metric=post_impressions_unique,post_impressions&access_token=${process.env.ACCESS_TOKENN}`);
          return insightsResponse.data.data;
      });

      // Wait for all insights requests to complete
      const insightsData = await Promise.all(insightsPromises);

      // Combine posts with their insights
      const postsWithInsights = posts.map((post, index) => {
          return {
              ...post,
              insights: insightsData[index]
          };
      });

      res.json(postsWithInsights);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



 
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});