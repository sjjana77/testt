// App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [sinceDate, setSinceDate] = useState('');
  const [untilDate, setUntilDate] = useState('');
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    // Fetch list of pages
    axios.get('http://localhost:3001/api/pages').then((response) => {
      setPages(response.data);
      if(response.data && response.data.length > 0){
        setSelectedPage(response.data[0].id);
      }
    });
  }, []);

  const handleFetchInsights = () => {
    // Fetch insights for the selected page and dates
    axios
      .post('http://localhost:3001/api/insights', {
        pageId: selectedPage,
        since: sinceDate,
        until: untilDate,
      })
      .then((response) => {
        setInsights(response.data);
      });
  };

  return (
    <div>
      <h1>Facebook Insights</h1>
      <label htmlFor="pageSelect">Select Page:</label>
      <select
        id="pageSelect"
        value={selectedPage}
        onChange={(e) => setSelectedPage(e.target.value)}
      >
        {pages.map((page) => (
          <option key={page.id} value={page.id}>
            {page.name}
          </option>
        ))}
      </select>
      <br />
      <label htmlFor="sinceDate">Since:</label>
      <input
        type="date"
        id="sinceDate"
        value={sinceDate}
        onChange={(e) => setSinceDate(e.target.value)}
      />
      <label htmlFor="untilDate">Until:</label>
      <input
        type="date"
        id="untilDate"
        value={untilDate}
        onChange={(e) => setUntilDate(e.target.value)}
      />
      <button onClick={handleFetchInsights}>Fetch Insights</button>
      <br />
      {insights && (
        <div>
          <h2>Insights</h2>
          <p>Page Likes: {insights.pageLikes}</p>
          <p>Country Demographics: {insights.countryDemographics}</p>
          <p>Reach: {insights.reach}</p>
          <p>Impressions: {insights.impressions}</p>
        </div>
      )}
    </div>
  );
};

export default App;
