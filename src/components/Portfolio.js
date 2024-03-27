// import React, { useState, useEffect } from 'react';
// import axios from '../utils/axios';

// function Portfolio() {
//   const [portfolioItems, setPortfolioItems] = useState([]);

//   useEffect(() => {
//     const fetchPortfolioItems = async () => {
//       try {
//         const response = await axios.get('/api/portfolio');
//         setPortfolioItems(response.data);
//       } catch (error) {
//         console.error('Error fetching portfolio items:', error);
//       }
//     };

//     fetchPortfolioItems();
//   }, []);

//   // State to store watchlist items
//   const [walletBalance, setWalletBalance] = useState(null);

//   // Fetch watchlist items from the backend when the component mounts
//   useEffect(() => {
//     const fetchWalletBalance = async () => {
//       try {
//         const response = await axios.get('/api/wallet');
//         console.log("wallet",response.data);
//         setWalletBalance(response.data.balance);
//       } catch (error) {
//         console.error('Error fetching wallet items:', error);
//       }
//     };

//     fetchWalletBalance();
//   }, []);

//   return (
//     <div>
//       <h2>Portfolio Component</h2>
//       <p>Money in wallet: {walletBalance}</p>
//       <div>
//         <h3>Portfolio Items</h3>
//         <ul>
//           {portfolioItems.map(item => (
//             <li key={item._id}>
//               {/* Display portfolio item details */}
//               <p>Item Name: {item.name}</p>
//               <p>Quantity: {item.quantity}</p>
//               {/* Add more details as needed */}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default Portfolio;


// To keep

// import React, { useState, useEffect } from 'react';
// import axios from '../utils/axios';

// import Card from 'react-bootstrap/Card';
// import { Row, Col } from 'react-bootstrap';
// import { Button, Modal, Form } from 'react-bootstrap';


// function Portfolio() {
//   const [portfolioItems, setPortfolioItems] = useState([]);
//   const [walletBalance, setWalletBalance] = useState(0);
//   const [stockCurrent,setStockCurrent]=useState(null);
//   const [inPortfolio, setInPortfolio] = useState(false);
//   const [showSellModal, setShowSellModal] = useState(false); // State to control modal visibility
//   const [showBuyModal, setShowBuyModal] = useState(false); // State to control modal visibility
//   const [quantity, setQuantity] = useState(0);
//   const [total, setTotal] = useState(0);
//   const [portfolioItem, setPortfolioItem] = useState(null);

//   // const fetchCurrentPrice=async(ticker)=>{
//   //   try {
//   //     // Modify the request URL to include the new date parameters
//   //     const response = await axios.get(`/api/stockAllData/stockCurrent/${ticker}`);
//   //     console.log("Stock current data:", response.data);
//   //     setStockCurrent(response.data.latestPrice);
//   //     // console.log(new Date(response.data.latestPrice).toLocaleString())
//   //   } catch (error) {
//   //     console.error('Error fetching stock data:', error);
//   //   }

//   // }
//   useEffect(() => {
//     const fetchPortfolioItems = async () => {
//       try {
//         const response = await axios.get('/api/portfolio');
//         setPortfolioItems(response.data);
//       } catch (error) {
//         console.error('Error fetching portfolio items:', error);
//       }
//     };

//     fetchPortfolioItems();
//   }, []);

//   useEffect(() => {
//     const fetchWalletBalance = async () => {
//       try {
//         const response = await axios.get('/api/wallet');
//         setWalletBalance(response.data.balance);
//       } catch (error) {
//         console.error('Error fetching wallet balance:', error);
//       }
//     };

//     fetchWalletBalance();
//   }, []);

//   const handleSellModalClose = async(ticker) => {
//     const response = await axios.get(`/api/stockAllData/stockCurrent/${ticker}`);
//       console.log("Stock current data:", response.data);
//       setStockCurrent(response.data.latestPrice);
//     setShowSellModal(false)
//   };
//   const handleBuyModalClose =async (ticker) => {
//     const response = await axios.get(`/api/stockAllData/stockCurrent/${ticker}`);
//       console.log("Stock current data:", response.data);
//       setStockCurrent(response.data.latestPrice);
   
//     setShowBuyModal(false)
//   };
//   const [showSuccessAlert, setShowSuccessAlert] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleBuy = async(ticker) => {
//     // Assume you've already defined these state variables at the top of your component
  

//     // Logic for buying the stock
//     try {
//       // Retrieve the existing portfolio item for the ticker
//       // const { data: portfolioItem } = await axios.get(`/api/portfolio/stock/${ticker}`);
//       const wall = await axios.get('/api/wallet');
//       console.log("wallet",wall.data);
//       setWalletBalance(wall.data.balance);
//       const response = await axios.get(`/api/portfolio/stock/${ticker}`);
//       console.log("portresponse",response.data)
//         let portfolioItem=response.data;

      
//       // Check if the stock is already in the portfolio
//       let newQuantity = quantity;
//       let newTotalCost = stockCurrent.c * quantity;
//       let updatebalance=stockCurrent.c * quantity
  
//       if (portfolioItem !== 'Portfolio item not found') {
//         // Update the existing item
//         newQuantity += portfolioItem.quantity;
//         newTotalCost += portfolioItem.totalCost;
  
//         const updatedItem = {
//           quantity: newQuantity,
//           totalCost: newTotalCost,
//           averageCostPerShare: newTotalCost / newQuantity,
//           currentPrice: stockCurrent.c,
//           change: (newTotalCost / newQuantity) - stockCurrent.c,
//           marketValue: stockCurrent.c * newQuantity
//         };
  
//         await axios.put(`/api/portfolio/${ticker}`, updatedItem);
        
//       } else {
//         // Add a new item
//         const newItem = {
//           stockSymbol: ticker,
//           quantity: newQuantity,
//           totalCost: newTotalCost,
//           averageCostPerShare: newTotalCost / newQuantity,
//           currentPrice: stockCurrent.c,
//           change: 0, // Since it's a new purchase, there's no change yet
//           marketValue: stockCurrent.c * newQuantity
//         };
  
//         await axios.post(`/api/portfolio`, newItem);
//       }
  
//       // Update the wallet balance after the purchase
//       const newWalletBalance = walletBalance - updatebalance;
//       await axios.post(`/api/wallet/update`, { amount: newWalletBalance });
  
//       // Close the modal and reset state
//       setQuantity(0);
//       setTotal(0);
//       setShowBuyModal(false);
//       setSuccessMessage(`${ticker.toUpperCase()} bought successfully!`);
//     setShowSuccessAlert(true); // Show success alert
  
//       // ...additional code to update client state if necessary...
//     } catch (error) {
//       console.error('Error during stock purchase:', error.response.data.message);
//       // Handle errors, such as showing a message to the user
//     }
   
//   };
  




//   const handleSell = async (ticker) => {
//     try {
//       // fetchCurrentPrice(ticker)
//         const wall = await axios.get('/api/wallet');
//         setWalletBalance(wall.data.balance);
//         const response = await axios.get(`/api/portfolio/stock/${ticker}`);
//         let portfolioItem = response.data;


//         // Ensure we have the stock in the portfolio and sufficient quantity to sell
//         if (portfolioItem !== 'Portfolio item not found' && quantity <= portfolioItem.quantity) {
//             let newQuantity = portfolioItem.quantity - quantity;
//             let sellTotalCost = stockCurrent.c * quantity;
//             let updatebalance=stockCurrent.c * quantity


//             // Update or remove the portfolio item based on the remaining quantity
//             if (newQuantity > 0) {
//                 const updatedItem = {
//                     quantity: newQuantity,
//                     totalCost: portfolioItem.totalCost - sellTotalCost,
//                     averageCostPerShare: (portfolioItem.totalCost - sellTotalCost) / newQuantity,
//                     currentPrice: stockCurrent.c,
//                     change: ((portfolioItem.totalCost - sellTotalCost) / newQuantity) - stockCurrent.c,
//                     marketValue: stockCurrent.c * newQuantity
//                 };

//                 await axios.put(`/api/portfolio/${ticker}`, updatedItem);
//             } else {
//                 // If the quantity goes to 0, remove the stock from the portfolio
//                 await axios.delete(`/api/portfolio/${ticker}`);
//             }

//             // Update the wallet balance after the sale
//             const newWalletBalance = walletBalance + updatebalance;
//             await axios.post(`/api/wallet/update`, { amount: newWalletBalance });

//             // Close the modal and reset state
//             setQuantity(0);
//             setTotal(0);
//             setShowSellModal(false);
//             setSuccessMessage(`${ticker.toUpperCase()} sold successfully!`);
//             setShowSuccessAlert(true);
//         } else {
//             console.error('Error during stock sale: Insufficient quantity or stock not found');
//         }
//     } catch (error) {
//         console.error('Error during stock sale:', error.response ? error.response.data.message : error.message);
//     }
// };


//   const handleQuantityChange = (e) => {
//     const qty = Number(e.target.value);
//     setQuantity(qty);
//     setTotal(qty *stockCurrent.c);
//   };

//   return (
//     <div>
//       <h2>My Portfolio</h2>
//       <p>Money in Wallet: ${walletBalance.toFixed(2)}</p>
//       <div>
//         {portfolioItems.map(item => (
       
//         <Card className="mb-3" key={item._id}>
//   <Card.Header as="h5">{item.stockSymbol} - {item.name}</Card.Header>
//   <Card.Body>
//     <Row>
//       <Col xs={6} lg={3}><Card.Text>Quantity:</Card.Text></Col>
//       <Col xs={6} lg={3}><Card.Text>{item.quantity}</Card.Text></Col>
//       <Col xs={6} lg={3}><Card.Text>Change:</Card.Text></Col>
//       <Col xs={6} lg={3}><Card.Text className={item.change >= 0 ? "text-success" : "text-danger"}>{item.change.toFixed(2)}</Card.Text></Col>
//     </Row>
//     <Row>
//       <Col xs={6} lg={3}><Card.Text>Avg. Cost / Share:</Card.Text></Col>
//       <Col xs={6} lg={3}><Card.Text>${item.averageCostPerShare.toFixed(2)}</Card.Text></Col>
//       <Col xs={6} lg={3}><Card.Text>Current Price:</Card.Text></Col>
//       <Col xs={6} lg={3}><Card.Text>${item.currentPrice.toFixed(2)}</Card.Text></Col>
//     </Row>
//     <Row>
//       <Col xs={6} lg={3}><Card.Text>Total Cost:</Card.Text></Col>
//       <Col xs={6} lg={3}><Card.Text>${item.totalCost.toFixed(2)}</Card.Text></Col>
//       <Col xs={6} lg={3}><Card.Text>Market Value:</Card.Text></Col>
//       <Col xs={6} lg={3}><Card.Text>${item.marketValue.toFixed(2)}</Card.Text></Col>
//     </Row>
//     <Row>
//       <Col className="d-flex justify-content-end pt-2">
//         <Button variant="success" className="me-2" onClick={() => setShowBuyModal(true)}>Buy</Button>
//         <Button variant="danger" onClick={() => setShowSellModal(true)}>Sell</Button>
//       </Col>
//       <Modal show={showSellModal} onHide={handleSellModalClose(item.stockSymbol)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Sell {item.stockSymbol}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group>
//               <Form.Label>Current Price:</Form.Label>
//               <Form.Control type="text" readOnly value={stockCurrent?.c} />
//             </Form.Group>
//             <Form.Group>
//               <Form.Label>Money in Wallet:</Form.Label>
//               <Form.Control type="text" readOnly value={walletBalance.toFixed(2)} />
//             </Form.Group>
//             <Form.Group>
//               <Form.Label>Quantity:</Form.Label>
//               <Form.Control type="number" value={quantity} onChange={handleQuantityChange} />
//             </Form.Group>
//             <Form.Group>
//               <Form.Label>Total:</Form.Label>
//               <Form.Control type="text" readOnly value={total.toFixed(2)} />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleSellModalClose(item.stockSymbol)}>
//             Cancel
//           </Button>
//           <Button 
//             variant="primary" 
//             onClick={handleSell(item.stockSymbol)}
//             disabled={quantity > portfolioItem?.quantity || quantity <= 0}
//           >
//             Sell
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Buy Modal */}
//       <Modal show={showBuyModal} onHide={handleBuyModalClose(item.stockCurrent)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Buy {item.stockSymbol}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group>
//               <Form.Label>Current Price:</Form.Label>
//               <Form.Control type="text" readOnly value={stockCurrent?.c} />
//             </Form.Group>
//             <Form.Group>
//               <Form.Label>Money in Wallet:</Form.Label>
//               <Form.Control type="text" readOnly value={walletBalance.toFixed(2)} />
//             </Form.Group>
//             <Form.Group>
//               <Form.Label>Quantity:</Form.Label>
//               <Form.Control type="number" value={quantity} onChange={handleQuantityChange} />
//             </Form.Group>
//             <Form.Group>
//               <Form.Label>Total:</Form.Label>
//               <Form.Control type="text" readOnly value={total.toFixed(2)} />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleBuyModalClose(item.stockSymbol)}>
//             Cancel
//           </Button>
//           <Button 
//             variant="primary" 
//             onClick={handleBuy(item.stockSymbol)}
//             disabled={total > walletBalance || quantity <= 0}
//           >
//             Buy
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Row>
//   </Card.Body>
// </Card>

//       // </Card>
//     ))}
//   </div>
// </div>
//   )}

// export default Portfolio;

// Done

// src/components/Portfolio.js
import React from 'react';

function Portfolio() {
  return (
    <div>
      <h2>Portfolio Component</h2>
      {/* Implement your portfolio functionality here */}
    </div>
  );
}

export default Portfolio;
