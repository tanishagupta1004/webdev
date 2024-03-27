// import React from 'react';

// const ChartsTab=()=>{
//     return (
//         <div>Chart</div>
//     );
// }

// export default ChartsTab;

// import React from 'react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import HC_more from 'highcharts/highcharts-more';
// import HC_stock from 'highcharts/modules/stock';

// // Initialize additional modules
// HC_more(Highcharts);
// HC_stock(Highcharts);

// const ChartsTab = ({ historicalData }) => {
//   // This would be your processed data, including dates, closing prices, volumes etc.
//   const processDataForChart = (data) => {
//     // Process the data and return the series data in the format Highcharts expects.
//     // This is where you would calculate your SMA and Volume by Price indicators.
//     // You'll have to replace this with actual logic based on your data format.
//     return {
//       priceData: data.map((item) => [item.date, item.close]),
//       volumeData: data.map((item) => [item.date, item.volume]),
//     };
//   };

//   const chartOptions = {
//     rangeSelector: {
//       selected: 1
//     },
//     title: {
//       text: `${historicalData?.symbol} Stock Price`
//     },
//     series: [{
//       name: historicalData?.symbol,
//       data: processDataForChart(historicalData?.historical).priceData,
//       tooltip: {
//         valueDecimals: 2
//       }
//     },
//     // Add more series for your SMA and Volume by Price indicators
//     ]
//   };

//   return (
//     <div>
//       <HighchartsReact
//         highcharts={Highcharts}
//         constructorType={'stockChart'}
//         options={chartOptions}
//       />
//     </div>
//   );
// };

// export default ChartsTab;

import React, { useEffect } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import Indicators from 'highcharts/indicators/indicators';
import VolumeByPrice from 'highcharts/indicators/volume-by-price';
import DragPanes from 'highcharts/modules/drag-panes';
import Exporting from 'highcharts/modules/exporting';
import Accessibility from 'highcharts/modules/accessibility';
import axios from '../utils/axios';

// Initialize the necessary Highcharts modules
Indicators(Highcharts);
VolumeByPrice(Highcharts);
DragPanes(Highcharts);
Exporting(Highcharts);
Accessibility(Highcharts);

const ChartsTab = ({ticker}) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentDate = new Date();
        const from = new Date(currentDate);
        from.setFullYear(from.getFullYear() - 2); // 2 years back
        const to = currentDate;
        
        console.log("From", from.toISOString().split('T')[0]); // Log the from date
        console.log("To", to.toISOString().split('T')[0]); 
      
           
            const response = await axios.get(`/api/stockAllData/chartData/${ticker}?fromDay=${from.toISOString().split('T')[0]}&toDay=${to.toISOString().split('T')[0]}`);
            console.log("response",response)
         const responseData = response.data.daypolygon.results;
      

        const ohlc = [],
          volume = [],
          dataLength = responseData.length,
          groupingUnits = [
            ['week', [1]],
            ['month', [1, 2, 3, 4, 6]]
          ];

          responseData.forEach(data => {
            ohlc.push([
              data.t, // the date
              data.o, // open
              data.h, // high
              data.l, // low
              data.c // close
            ]);
      
            volume.push([
              data.t, // the date
              data.v // the volume
            ]);
          });

        const options = {
          rangeSelector: {
            selected: 2
          },
          title: {
            text: `${ticker} Historical `
          },
          subtitle: {
            text: 'With SMA and Volume by Price technical indicators'
          },
          yAxis: [
            {
              startOnTick: false,
              endOnTick: false,
              labels: {
                align: 'right',
                x: -3
              },
              title: {
                text: 'OHLC'
              },
              height: '60%',
              lineWidth: 2,
              resize: {
                enabled: true
              }
            },
            {
              labels: {
                align: 'right',
                x: -3
              },
              title: {
                text: 'Volume'
              },
              top: '65%',
              height: '35%',
              offset: 0,
              lineWidth: 2
            }
          ],
          tooltip: {
            split: true
          },
          plotOptions: {
            series: {
              dataGrouping: {
                units: groupingUnits
              }
            }
          },
          series: [
            {
              type: 'candlestick',
              name: 'AAPL',
              id: 'aapl',
              zIndex: 2,
              data: ohlc
            },
            {
              type: 'column',
              name: 'Volume',
              id: 'volume',
              data: volume,
              yAxis: 1
            },
            {
              type: 'vbp',
              linkedTo: 'aapl',
              params: {
                volumeSeriesID: 'volume'
              },
              dataLabels: {
                enabled: false
              },
              zoneLines: {
                enabled: false
              }
            },
            {
              type: 'sma',
              linkedTo: 'aapl',
              zIndex: 1,
              marker: {
                enabled: false
              }
            }
          ]
        };

        Highcharts.stockChart('container', options);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return <div id="container"></div>;
};

export default ChartsTab;

// import React from 'react';

// const ChartsTab=()=>{
//     return (
//         <>Charts</>
//     );
// }
// export default ChartsTab;