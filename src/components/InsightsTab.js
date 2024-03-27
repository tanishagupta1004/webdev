// import React from 'react';

// const InsightsTab=()=>{
//     return (
//         <div>Insight</div>
//     );
// }

// export default InsightsTab;

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Grid from '@mui/material/Grid';




// The main component for the Insights tab
const InsightsTab = ({sentiment, earnings, recommendationTrends}) => {
    console.log("sentiment",sentiment)
    // console.log(sentiment, earnings, recommendationTrends)
//   if (error) {
//     return <ErrorAlert message="No data found. Please enter a valid Ticker" />;
//   }

  // HighCharts options for recommendation trends and earnings data
  // Extracting data for actual and estimate series
  const actualData = earnings.map(data => [`${data.period} ${data.surprise}`, data.actual]);
  const estimateData = earnings.map(data => [`${data.period} ${data.surprise}`, data.estimate]);

//   const actualData = earnings.map(data => {
//     const label = `${data.period}<br>Surprise: ${data.surprise}`;
//     return { name: label, y: data.actual };
//   });
  
//   const estimateData = earnings.map(data => {
//     const label = `${data.period}<br>Surprise: ${data.surprise}`;
//     return { name: label, y: data.estimate };
//   });

//   // Chart options for earnings chart
//   const earningsChartOptions = {
//     chart: {
//       type: 'spline'
//     },
//     title: {
//       text: 'Earnings Data'
//     },
//     xAxis: {
//       type: 'category',
//       title: {
//         text: 'Date'
//       }
//     },
//     yAxis: {
//       title: {
//         text: 'Earnings'
//       }
//     },
//     tooltip: {
//       shared: true
//     },
//     series: [
//       {
//         name: 'Actual',
//         data: actualData
//       },
//       {
//         name: 'Estimate',
//         data: estimateData
//       }
//     ]
//   };

const earningsChartOptions = {
    chart: {
      type: 'spline'
    },
    title: {
      text: 'Historical EPS Surprises'
    },
    xAxis: {
      type: 'category',
      labels: {
        useHTML: true, // Enable HTML in labels to use line break
        formatter: function() {
            const labelParts = this.value.split(' ');
            // Return the formatted label with the surprise on a new line
            return `${labelParts[0]}<br/>Surprise: ${labelParts[1]}`;
        }
      }
    },
    yAxis: {
      title: {
        text: 'Quarterly EPS'
      }
    },
    tooltip: {
      pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
      valueSuffix: ' ',
      shared: true
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        },
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: 3
        }
      }
    },
    series: [
      {
        name: 'Actual',
        data: actualData // Ensure actualData is defined properly
      },
      {
        name: 'Estimate',
        data: estimateData // Ensure estimateData is defined properly
      }
    ],
    credits: {
      enabled: false
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    }
  };
  

//Extract and format data for Highcharts
  console.log("recommendation",recommendationTrends)
  const categories = recommendationTrends.map(data => data.period);
  const seriesData = [
    { name: 'Strong Buy', color: '#167b3d', data: recommendationTrends.map(data => data.strongBuy) },
    { name: 'Buy', color: '#20c05d', data: recommendationTrends.map(data => data.buy) },
    { name: 'Hold', color: '#c29620', data: recommendationTrends.map(data => data.hold) },
    { name: 'Sell', color: '#f66667', data: recommendationTrends.map(data => data.sell) },
    { name: 'Strong Sell', color: '#8c3838', data: recommendationTrends.map(data => data.strongSell) }
  ];



const options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Recommendation Trends'
    },
    xAxis: {
      categories: categories,
      
    },
    yAxis: {
      min: 0,
      title: {
        text: '# Analysts'
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: ( // theme
            Highcharts.defaultOptions.title.style &&
            Highcharts.defaultOptions.title.style.color
          ) || 'gray'
        }
      }
    },

    legend: {
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal'
      },
    // legend: {
    //   align: 'right',
    //   x: -30,
    //   verticalAlign: 'top',
    //   y: 25,
    //   floating: true,
    //   backgroundColor:
    //     Highcharts.defaultOptions.legend.backgroundColor || // theme
    //     'white',
    //   borderColor: '#CCC',
    //   borderWidth: 1,
    //   shadow: false
    // },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          color: (Highcharts.defaultOptions.plotOptions &&
                  Highcharts.defaultOptions.plotOptions.column &&
                  Highcharts.defaultOptions.plotOptions.column.dataLabels &&
                  Highcharts.defaultOptions.plotOptions.column.dataLabels.color) || 'white'
        }
      }
    },
    series: seriesData
  };
  
  

  // Aggregate the values
  const totalMSPR = sentiment.data.reduce((acc, curr) => acc + curr.mspr, 0);
  const positiveMSPR = sentiment.data.filter(item => item.mspr > 0).reduce((acc, curr) => acc + curr.mspr, 0);
  const negativeMSPR = sentiment.data.filter(item => item.mspr < 0).reduce((acc, curr) => acc + curr.mspr, 0);

  const totalChange = sentiment.data.reduce((acc, curr) => acc + curr.change, 0);
  const positiveChange = sentiment.data.filter(item => item.change > 0).reduce((acc, curr) => acc + curr.change, 0);
  const negativeChange = sentiment.data.filter(item => item.change < 0).reduce((acc, curr) => acc + curr.change, 0);

  return (
    <div style={{ marginTop: '1rem', textAlign: 'center'}}>
      <h2>Insider Sentiments</h2>
      <table style={{ width: '100%', textAlign: 'center' }}>
        <thead>
          <tr>
          <th style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>compname</th> 
          <th style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>MSPR</th>
          <th style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Change</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Total MSPR</td>
            <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{totalMSPR.toFixed(2)}</td>
            <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{totalChange.toFixed(2)}</td>
          </tr>
          <tr>
            <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Positive MSPR</td>
            <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{positiveMSPR.toFixed(2)}</td>
            <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{positiveChange.toFixed(2)}</td>
          </tr>
          <tr>
            <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Negative MSPR</td>
            <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{negativeMSPR.toFixed(2)}</td>
            <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{negativeChange.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* Charts container */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {/* First Chart */}
          <HighchartsReact highcharts={Highcharts} options={options} />
        </Grid>
        <Grid item xs={12} md={6}>
          {/* Second Chart */}
          <HighchartsReact highcharts={Highcharts} options={earningsChartOptions} />
        </Grid>
      </Grid>
  

      {/* <AggregatedDataTable data={insightsData} />
      <HighchartsReact
        highcharts={Highcharts}
        options={recommendationOptions}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={earningsOptions}
      /> */}
    </div>
  );
};


// return (
//   <div>
//       <div>
//     <h2>Insider Sentiments</h2>
//     <table>
//       <thead>
//         <tr>
//           <th>MSPR</th>
//           <th>Change</th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr>
//           <td>Total MSPR: {totalMSPR.toFixed(2)}</td>
//           <td>Total Change: {totalChange.toFixed(2)}</td>
//         </tr>
//         <tr>
//           <td>Positive MSPR: {positiveMSPR.toFixed(2)}</td>
//           <td>Positive Change: {positiveChange.toFixed(2)}</td>
//         </tr>
//         <tr>
//           <td>Negative MSPR: {negativeMSPR.toFixed(2)}</td>
//           <td>Negative Change: {negativeChange.toFixed(2)}</td>
//         </tr>
//       </tbody>
//     </table>
//   </div>
//       <HighchartsReact highcharts={Highcharts} options={options} />
//       <HighchartsReact highcharts={Highcharts} options={earningsChartOptions} />

//     {/* <AggregatedDataTable data={insightsData} />
//     <HighchartsReact
//       highcharts={Highcharts}
//       options={recommendationOptions}
//     />
//     <HighchartsReact
//       highcharts={Highcharts}
//       options={earningsOptions}
//     /> */}
//   </div>
// );
// };

export default InsightsTab;
