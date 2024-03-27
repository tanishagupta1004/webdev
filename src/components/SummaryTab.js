// src/components/SummaryTab.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import isMarketOpen from '../utils/isMarketOpen';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Grid from '@mui/material/Grid';
const SummaryTab = ({ stockPrice, peers, profile, highchartsOptions, hourData }) => {
  const navigate = useNavigate();
  
  const marketOpen = isMarketOpen(stockPrice.t);

  const chartData = hourData.map(data => ({
    x: new Date(data.t),
    y: data.c // Closing price
  }));


//   const companyPeers =peers.split(', ');
const options = {
    title: {
      text: 'Stock Price Variation'
    },
    xAxis: {
      type: 'datetime',
      title: {
      }
    },
    yAxis: {
      title: {
      }
    },
    series: [
      {
        data: chartData
      }
    ]
  };

  return (
    <Grid container spacing={2}>
      {/* Column 1 for text data */}
      <Grid item xs={12} md={6}>
        {/* <p>High Price: {stockPrice.h}</p>
        <p>Low Price: {stockPrice.l}</p>
        <p>Open Price: {stockPrice.o}</p>
        <p>Previous Close: {stockPrice.pc}</p> */}
        <p style={{ margin: 0 }}>High Price: {stockPrice.h}</p>
        <p style={{ margin: 0 }}>Low Price: {stockPrice.l}</p>
        <p style={{ margin: 0 }}>Open Price: {stockPrice.o}</p>
        <p style={{ margin: '0 0 20px 0' }}>Prev Close: {stockPrice.pc}</p>
        <h5 style={{ textDecoration: 'underline', marginBottom: '0.5rem' }}><u>About the Company</u></h5>
        <p>IPO Start Date: {profile.ipo}</p>
        <p>Industry: {profile.finnhubIndustry}</p>
        <p>Webpage: <a href={profile.weburl} target="_blank" rel="noopener noreferrer">{profile.weburl}</a></p>
        <p>Company peers:</p>
        <div>
          {peers.map((peer, index) => (
            <span key={index} onClick={() => navigate(`/search/${peer}`)} 
            style={{
              cursor: 'pointer',
              color: 'blue', /* This sets the text color to blue */
              textDecoration: 'underline' /* This underlines the text */
            }}>
              {peer}{index < peers.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      </Grid>

      {/* Column 2 for chart */}
      <Grid item xs={12} md={6} style={{ paddingLeft: 0 }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
        {/* Insert chart component here if needed */}
      </Grid>
    </Grid>
  );
};


export default SummaryTab;


// src/components/SummaryTab.js
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import isMarketOpen from '../utils/isMarketOpen';

// function SummaryTab({stockPrice, peers, profile,hourData}) {
//   const navigate = useNavigate();
  
//   const marketOpen = isMarketOpen(stockPrice.t);




// //   const companyPeers =peers.split(', ');
// const options = {
//     title: {
//       text: 'Stock Price Variation'
//     },
//     xAxis: {
//       type: 'datetime',
//       title: {
//         text: 'Time'
//       }
//     },
//     yAxis: {
//       title: {
//         text: 'Stock Price'
//       }
//     },
//     series: [
//       {
//         name: 'Stock Price',
//       }
//     ]
//   };

//   return (
//     <div>
//       <h3>Summary</h3>
//       <p>High Price: {stockPrice.h}</p>
//       <p>Low Price: {stockPrice.l}</p>
//       <p>Open Price: {stockPrice.o}</p>
//       <p>Previous Close: {stockPrice.pc}</p>
//       <p>Last Timestamp: {marketOpen ? stockPrice.t : null}</p>
//       <h3>About the Company</h3>
//       <p>IPO Start Date: {profile.ipo}</p>
//       <p>Industry: {profile.finnhubIndustry}</p>
//       <p>Webpage: <a href={profile.weburl} target="_blank" rel="noopener noreferrer">{profile.weburl}</a></p>
//       <h3>Company Peers</h3>
//       {peers.map((peer, index) => (
//         <span key={index} onClick={() => navigate(`/search/${peer}`)} style={{ cursor: 'pointer' }}>
//           {peer}{index < peers.length - 1 ? ', ' : ''}
//         </span>
//       ))}
//       {/* Insert chart component here if needed */}
//     </div>
//   );
// };

// export default SummaryTab;
