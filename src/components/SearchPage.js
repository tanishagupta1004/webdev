// src/components/SearchPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import { Box, Tabs, Tab, IconButton } from '@mui/material';
import SummaryTab from './SummaryTab';
import TopNewsTab from './TopNewsTab';
import ChartsTab from './ChartsTab';
import InsightsTab from './InsightsTab';
import { Button, Modal, Form } from 'react-bootstrap';





function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


function SearchPage() {
  const {ticker} = useParams(); // Extracting ticker from the URL
  const [stockData, setStockData] = useState(null);
  const [marketStatus, setMarketStatus] = useState('Closed');
  const [tabValue, setTabValue] = useState(0);
  const [inWatchlist, setInWatchlist] = useState(null);
  const [stockCurrent,setStockCurrent]=useState(null);
  const [inPortfolio, setInPortfolio] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false); // State to control modal visibility
  const [showBuyModal, setShowBuyModal] = useState(false); // State to control modal visibility
  const [quantity, setQuantity] = useState(0);
  const [total, setTotal] = useState(0);
  const [walletBalance, setWalletBalance] = useState(null);
  const [portfolioItem, setPortfolioItem] = useState(null);


  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await axios.get('/api/wallet');
        console.log("wallet",response.data);
        setWalletBalance(response.data.balance);
      } catch (error) {
        console.error('Error fetching wallet items:', error);
      }
    };

    fetchWalletBalance();
  }, []);

  
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };
  // State to store watchlist items
  const [watchlistItems, setWatchlistItems] = useState([]);

  // Fetch watchlist items from the backend when the component mounts
  useEffect(() => {
    const fetchWatchlistItems = async () => {
      try {
        const response = await axios.get('/api/watchlist');
        console.log("watchlist",response.data);
        setWatchlistItems(response.data);
        if (response.data.some(item => item.symbol === ticker)) {
          setInWatchlist(true);
        } else {
          setInWatchlist(false);
        }
      } catch (error) {
        console.error('Error fetching watchlist items:', error);
      }
    };

    fetchWatchlistItems();
  }, [ticker,inWatchlist]);

  useEffect(() => {
    const fetchPortfolioItem = async () => {
      try {
        const response = await axios.get(`/api/portfolio/stock/${ticker}`);
        console.log("portresponse",response.data)
        if (response.data !== 'Portfolio item not found') {
          setPortfolioItem(response.data)
          setInPortfolio(true); // If item is found in portfolio, set inPortfolio to true
        } else {
          setInPortfolio(false); // If item is not found in portfolio, set inPortfolio to false
        }
      } catch (error) {
        console.error('Error checking portfolio:', error);
      }
    };

    fetchPortfolioItem();
  }, [ticker]);



  useEffect(() => {
    const getFormattedDate = (date) => {
      return date.toISOString().split('T')[0]; // Formats date as 'YYYY-MM-DD'
    };
  
    const toDate = new Date();
    const fromDateTwoYears = new Date(new Date().setFullYear(new Date().getFullYear() - 2));
    const fromHourOneDayBack = new Date(new Date().setDate(new Date().getDate() - 1));
    const fromOneWeekBack = new Date(new Date().setDate(new Date().getDate() - 7));

  
    const fetchData = async () => {
      const toDateStr = getFormattedDate(toDate);
      const fromDateTwoYearsStr = getFormattedDate(fromDateTwoYears);
      const fromHourOneDayBackStr = getFormattedDate(fromHourOneDayBack);
      const fromOneWeekBackStr = getFormattedDate(fromOneWeekBack);
  
      try {
        // Modify the request URL to include the new date parameters
        const response = await axios.get(`/api/stockAllData/${ticker.toUpperCase()}?from=${fromOneWeekBackStr}&to=${toDateStr}&fromHour=${fromHourOneDayBackStr}&toHour=${toDateStr}`);
        console.log("Stock data:", response.data);
        setStockData(response.data);
        // Check if the item is in the watchlist
     
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };
  
    fetchData();

    const fetchCurrentPrice=async()=>{
      try {
        // Modify the request URL to include the new date parameters
        const response = await axios.get(`/api/stockAllData/stockCurrent/${ticker}`);
        console.log("Stock current data:", response.data);
        setStockCurrent(response.data.latestPrice);
        console.log(new Date(response.data.latestPrice).toLocaleString())
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }

    }

    fetchCurrentPrice();
    const intervalId = setInterval(fetchCurrentPrice, 15000); // Fetch data every 15 seconds

    return () => {
        clearInterval(intervalId); // Clear interval on component unmount
      };
  }, [ticker]); // Dependency array, ensures the effect runs only when the ticker changes
  function convertUnixToHumanReadable(unixTimestamp) {
    const date = new Date(); // Convert to milliseconds by multiplying by 1000
    const humanReadable = date.toLocaleString(); // Converts to local date string
    const reqdate=convertDateToISO(humanReadable);
    return reqdate;
  }
  function convertDateToISO(dateString) {
    const parts = dateString.split(', '); // Split date and time
    const dateParts = parts[0].split('/'); // Split date into day, month, year
    const time = parts[1]; // Get the time part
    const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]} ${time}`; // Rearrange and concatenate parts
    return isoDate;
}
  const hasStocks = false;

  const handleToggleWatchlist = async () => {
    // Check if the item is already in the watchlist
    console.log("toggle watchlist")
    if (inWatchlist) {
      try {
        // Delete item from the watchlist
        await axios.delete(`/api/watchlist/${stockData.companyProfile.ticker}`); // Assuming you have the ID of the item stored somewhere
        setInWatchlist(false); // Update state to reflect removal from watchlist
      } catch (error) {
        console.error('Error removing item from watchlist:', error);
      }
    } else {
      try {
        // Add item to the watchlist
        const newItem = {
          symbol: stockData.companyProfile.ticker,
          name: stockData.companyProfile.name,
          curPrice: stockCurrent.c,
          diff: stockCurrent.d,
          diffPer: stockCurrent.dp
        };
        await axios.post('/api/watchlist', newItem);
        setInWatchlist(true); // Update state to reflect addition to watchlist
      } catch (error) {
        console.error('Error adding item to watchlist:', error);
      }
    }
  };

  const handleSellModalClose = () => setShowSellModal(false);
  const handleBuyModalClose = () => setShowBuyModal(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleBuy = async() => {
    // Assume you've already defined these state variables at the top of your component
  

    // Logic for buying the stock
    try {
      // Retrieve the existing portfolio item for the ticker
      // const { data: portfolioItem } = await axios.get(`/api/portfolio/stock/${ticker}`);
      const wall = await axios.get('/api/wallet');
      console.log("wallet",wall.data);
      setWalletBalance(wall.data.balance);
      const response = await axios.get(`/api/portfolio/stock/${ticker}`);
      console.log("portresponse",response.data)
        let portfolioItem=response.data;

      
      // Check if the stock is already in the portfolio
      let newQuantity = quantity;
      let newTotalCost = stockCurrent.c * quantity;
      let updatebalance=stockCurrent.c * quantity
  
      if (portfolioItem !== 'Portfolio item not found') {
        // Update the existing item
        newQuantity += portfolioItem.quantity;
        newTotalCost += portfolioItem.totalCost;
  
        const updatedItem = {
          quantity: newQuantity,
          totalCost: newTotalCost,
          averageCostPerShare: newTotalCost / newQuantity,
          currentPrice: stockCurrent.c,
          change: (newTotalCost / newQuantity) - stockCurrent.c,
          marketValue: stockCurrent.c * newQuantity
        };
  
        await axios.put(`/api/portfolio/${ticker}`, updatedItem);
        
      } else {
        // Add a new item
        const newItem = {
          stockSymbol: ticker,
          quantity: newQuantity,
          totalCost: newTotalCost,
          averageCostPerShare: newTotalCost / newQuantity,
          currentPrice: stockCurrent.c,
          change: 0, // Since it's a new purchase, there's no change yet
          marketValue: stockCurrent.c * newQuantity
        };
  
        await axios.post(`/api/portfolio`, newItem);
      }
  
      // Update the wallet balance after the purchase
      const newWalletBalance = walletBalance - updatebalance;
      await axios.post(`/api/wallet/update`, { amount: newWalletBalance });
  
      // Close the modal and reset state
      setQuantity(0);
      setTotal(0);
      setShowBuyModal(false);
      setSuccessMessage(`${ticker.toUpperCase()} bought successfully!`);
    setShowSuccessAlert(true); // Show success alert
  
      // ...additional code to update client state if necessary...
    } catch (error) {
      console.error('Error during stock purchase:', error.response.data.message);
      // Handle errors, such as showing a message to the user
    }
   
  };

  const handleSell = async () => {
    try {
        const wall = await axios.get('/api/wallet');
        setWalletBalance(wall.data.balance);
        const response = await axios.get(`/api/portfolio/stock/${ticker}`);
        let portfolioItem = response.data;


        // Ensure we have the stock in the portfolio and sufficient quantity to sell
        if (portfolioItem !== 'Portfolio item not found' && quantity <= portfolioItem.quantity) {
            let newQuantity = portfolioItem.quantity - quantity;
            let sellTotalCost = stockCurrent.c * quantity;
            let updatebalance=stockCurrent.c * quantity


            // Update or remove the portfolio item based on the remaining quantity
            if (newQuantity > 0) {
                const updatedItem = {
                    quantity: newQuantity,
                    totalCost: portfolioItem.totalCost - sellTotalCost,
                    averageCostPerShare: (portfolioItem.totalCost - sellTotalCost) / newQuantity,
                    currentPrice: stockCurrent.c,
                    change: ((portfolioItem.totalCost - sellTotalCost) / newQuantity) - stockCurrent.c,
                    marketValue: stockCurrent.c * newQuantity
                };

                await axios.put(`/api/portfolio/${ticker}`, updatedItem);
            } else {
                // If the quantity goes to 0, remove the stock from the portfolio
                await axios.delete(`/api/portfolio/${ticker}`);
            }

            // Update the wallet balance after the sale
            const newWalletBalance = walletBalance + updatebalance;
            await axios.post(`/api/wallet/update`, { amount: newWalletBalance });

            // Close the modal and reset state
            setQuantity(0);
            setTotal(0);
            setShowSellModal(false);
            setSuccessMessage(`${ticker.toUpperCase()} sold successfully!`);
            setShowSuccessAlert(true);
        } else {
            console.error('Error during stock sale: Insufficient quantity or stock not found');
        }
    } catch (error) {
        console.error('Error during stock sale:', error.response ? error.response.data.message : error.message);
    }
};


  const handleQuantityChange = (e) => {
    const qty = Number(e.target.value);
    setQuantity(qty);
    setTotal(qty *stockCurrent.c);
  };

  return (
    <div className="container my-4">
    <h2 className="text-center mb-3">STOCK SEARCH</h2>
    <div className="row justify-content-center">
      {/* ... rest of your component */}
      


     
      {stockData ? (
          <div className="container">
            {showSuccessAlert && (
    <div style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>
      {successMessage}
    </div>
  )}
          <div className="row align-items-center my-3">
            {/* Stock Symbol, Company Name, Exchange, Buy/Sell Buttons */}
            <div className="col-md-4 text-center">
              
              <h1 className="display-4" style={{ marginRight: '10px' }}>{stockData.companyProfile.ticker}
              <p className="lead">{stockData.companyProfile.companyName}</p>
              
              <IconButton onClick={handleToggleWatchlist}  aria-label="add to watchlist" className={inWatchlist ? 'text-warning' : null}>
              {inWatchlist ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
              </svg>
            )}
    </IconButton></h1>
              <h2>{stockData.companyProfile.companyName}</h2>
              <p>{stockData.companyProfile.exchange}</p>
              <button className="btn btn-primary me-2"onClick={() => setShowBuyModal(true)}>Buy</button>
              {inPortfolio && <button className="btn btn-danger"onClick={() => setShowSellModal(true)}>Sell</button>}

             
              <Modal show={showSellModal} onHide={handleSellModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sell {ticker}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Current Price:</Form.Label>
              <Form.Control type="text" readOnly value={stockCurrent.c} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Money in Wallet:</Form.Label>
              <Form.Control type="text" readOnly value={walletBalance.toFixed(2)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Quantity:</Form.Label>
              <Form.Control type="number" value={quantity} onChange={handleQuantityChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Total:</Form.Label>
              <Form.Control type="text" readOnly value={total.toFixed(2)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSellModalClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSell}
            disabled={quantity > portfolioItem?.quantity || quantity <= 0}
          >
            Sell
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Buy Modal */}
      <Modal show={showBuyModal} onHide={handleBuyModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Buy {ticker}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Current Price:</Form.Label>
              <Form.Control type="text" readOnly value={stockCurrent.c} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Money in Wallet:</Form.Label>
             
              <Form.Control type="text" readOnly value={walletBalance !== null ? walletBalance.toFixed(2) : 'Loading...'} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Quantity:</Form.Label>
              <Form.Control type="number" value={quantity} onChange={handleQuantityChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Total:</Form.Label>
              <Form.Control type="text" readOnly value={total.toFixed(2)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleBuyModalClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleBuy}
            disabled={total > walletBalance || quantity <= 0}
          >
            Buy
          </Button>
        </Modal.Footer>
      </Modal>

     
            </div>
     {/* Company Logo and Market Status */}
    
<div className="col-md-4 text-center" style={{
  // display: 'flex', 
  // alignItems: 'center', // Vertically centers the image and text in the flex container
  // justifyContent: 'center', // Horizontally centers the items in the container, remove if not needed
}}>
  <img 
    src={stockData.companyProfile.logo} 
    alt="Company Logo" 
    style={{ width: '100px', marginRight: 'auto' }} // Set width and margin-right, adjust as needed
  />
  <p 
    className={`market-status ${marketStatus === 'Open' ? 'text-success' : 'text-danger'}`}
    style={{
      marginTop: '10px'
      // margin: 0, // Removes default margin
      // display: 'inline-block', // Ensures that the line-height is applied
      // verticalAlign: 'middle', // Aligns the text in the middle relative to the image
    }}>
    Market {marketStatus}
  </p>
</div>
        
    
{/* <div style={{
  display: 'flex', 
  alignItems: 'center', // This will vertically align the flex items (your image and text)
  justifyContent: 'center' // This will horizontally align the flex items
}}>
  <img 
    src={stockData.companyProfile.logo} 
    alt="Company Logo" 
    style={{ maxWidth: '100px', marginRight: '10px', height: '100px' }} // Adjust max-width as necessary
  />
  <p style={{
    margin: 0, // Remove default margin
    lineHeight: '1.5' // Adjust line-height to align with the height of the image
  }} 
  className={`market-status ${marketStatus === 'Open' ? 'text-success' : 'text-danger'}`}>
    Market {marketStatus}
  </p>
</div> */}


            {/* Last Price, Change, etc. */}
            <div className="col-md-4 text-center">
              <h3>{stockCurrent.c}</h3>
              <IconButton onClick={handleToggleWatchlist} aria-label="add to watchlist" className={inWatchlist ? 'text-warning' : null}>
            {/* Check if stockCurrent is not null before accessing its properties */}
            {stockCurrent && stockCurrent.c !== null ? (
              <>
                {inWatchlist ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
                  </svg>
                )}
              </>
            ) : null}
          </IconButton>
              <p className={stockCurrent.d > 0 ? 'text-success' : 'text-danger'}>
                {stockCurrent.d > 0 ? '▲' : '▼'} {stockCurrent.d} ({stockCurrent.dp}%)
              </p>
              <p>{convertUnixToHumanReadable(stockCurrent.t)}</p>
            </div>
            </div>
    
           
          
          
          <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }} className="customTabs">
  {/* <Tabs
    value={tabValue}
    onChange={handleChangeTab}
    aria-label="stock detail tabs"
    variant="standard"
    TabIndicatorProps={{ style: { background: 'blue' } }} // Example of styling the indicator
  >
    <Tab label="Summary" {...a11yProps(0)} className="customTab" />
    <Tab label="Top News" {...a11yProps(1)} className="customTab" />
    <Tab label="Charts" {...a11yProps(2)} className="customTab" />
    <Tab label="Insights" {...a11yProps(3)} className="customTab" />
  </Tabs> */}

<Tabs
  value={tabValue}
  onChange={handleChangeTab}
  aria-label="stock detail tabs"
  variant="fullWidth" // This will make each tab take up equal space
  TabIndicatorProps={{ style: { background: 'blue' } }}
  style={{ justifyContent: 'space-between' }} // This spreads out the tabs evenly across the container
>
  <Tab label="Summary" {...a11yProps(0)} style={{ width: '24%', margin: '0' }} className="customTab" />
  <Tab label="Top News" {...a11yProps(1)} style={{ width: '24%', margin: '0' }} className="customTab" />
  <Tab label="Charts" {...a11yProps(2)} style={{ width: '24%', margin: '0' }} className="customTab" />
  <Tab label="Insights" {...a11yProps(3)} style={{ width: '24%', margin: '0' }} className="customTab" />
</Tabs>



      
      <TabPanel value={tabValue} index={0}>
        <SummaryTab stockPrice={stockData.latestPrice} peers={stockData.peers} profile={stockData.companyProfile} hourData={stockData.hourpolygon.results}/>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <TopNewsTab newsData={stockData?.companyNews} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <ChartsTab ticker={ticker} />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <InsightsTab sentiment={stockData.insiderSentiment} earnings={stockData.earnings} recommendationTrends={stockData.recommendationTrends} />
      </TabPanel>
      </Box>
      </Box>
        </div>
       
      ) : (
        <p>Loading...</p>
      )}
    </div>
    </div>
    
        
  );
}

export default SearchPage;
// src/components/SearchPage.js
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from '../utils/axios';

// function SearchPage() {
//   const { ticker } = useParams();
//   console.log("ticker",ticker)
//   const [stockData, setStockData] = useState({});
//   // Assuming your API returns a market status, otherwise you'll need to implement this
//   const [marketStatus, setMarketStatus] = useState('Closed');

//   useEffect(() => {
//     const getFormattedDate = (date) => {
//       return date.toISOString().split('T')[0]; // Formats date as 'YYYY-MM-DD'
//     };

//     const toDate = new Date();
//     const fromDate = new Date();
//     fromDate.setDate(toDate.getDate() - 7); // Set 'from' date to one week before today

//     const fetchData = async () => {
//       const fromDateString = getFormattedDate(fromDate);
//       const toDateString = getFormattedDate(toDate);

//       try {
//         // Use `from` and `to` as query parameters in the request URL
//         const response = await axios.get(`/api/stockAllData/${ticker}?from=${fromDateString}&to=${toDateString}`);
//         console.log("Stock data:", response.data);
//         setStockData(response.data);
//       } catch (error) {
//         console.error('Error fetching stock data:', error);
//       }
//     };

//     fetchData();
//   }, [ticker]); // Dependency array, ensures the effect runs only when the ticker changes

//   // Placeholder, replace with actual condition to determine if stocks are owned
//   const hasStocks = false;

//   return (
    // <div className="container">
    //   <div className="row align-items-center my-3">
    //     {/* Stock Symbol, Company Name, Exchange, Buy/Sell Buttons */}
    //     <div className="col-12 col-md-4">
    //       <h1>{stockData.companyProfile.symbol}</h1>
    //       <h2>{stockData.companyProfile.companyName}</h2>
    //       <p>{stockData.companyProfile.exchange}</p>
    //       <button className="btn btn-primary me-2">Buy</button>
    //       {hasStocks && <button className="btn btn-danger">Sell</button>}
    //     </div>

    //     {/* Last Price, Change, etc. */}
    //     <div className="col-12 col-md-4 text-center">
    //       <h3>{stockData.latestPrice.c}</h3>
    //       <p className={stockData.latestPrice.d > 0 ? 'text-success' : 'text-danger'}>
    //         {stockData.latestPrice.d > 0 ? '▲' : '▼'} {stockData.latestPrice.d} ({stockData.latestPrice.dp}%)
    //       </p>
    //       <p>{new Date(stockData.latestPrice.t).toLocaleString()}</p>
    //     </div>

    //     {/* Company Logo and Market Status */}
    //     <div className="col-12 col-md-4 text-center">
    //       <img src={stockData.companyProfile.logo} alt="Company Logo" className="img-fluid" />
    //       <p>Market {marketStatus}</p>
    //     </div>
    //   </div>

    //   {/* Summary, Top News, Charts, and Insights */}
    //   {/* You would use Tabs from Bootstrap for this part and switch content accordingly */}
    //   <div className="row">
    //     {/* ... */}
    //   </div>
    // </div>
//   );
// }

// export default SearchPage;
