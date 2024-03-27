// // src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Navbar from './components/Navbar/Navbar.js';
// import Search from './components/SearchBar/Search.js';
// import Watchlist from './components/Watchlist';
// import Portfolio from './components/Portfolio';
// import Footer from './components/Footer';
// import SearchPage from './components/SearchPage';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import './App.css'; // Import your custom styles if any

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <div>
//       <Routes>
//         <Route path="/search/home" element={<Search/>} />
//         <Route path="/search/:ticker"  element={<SearchPage/>} />
//         <Route path="/watchlist"  element={<Watchlist/>} />
//         <Route path="/portfolio"  element={<Portfolio/>} />
//         <Route exact path="/"  element={<Search/>} />
//       </Routes>
//       </div>
//       <Footer />
//     </Router>
//   );
// }

// export default App;

// // import React from 'react';
// // const App=()=>{
// //   return <>App</>
// // }

// // export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.js';
import Search from './components/SearchBar/Search.js';
import Watchlist from './components/Watchlist';
import Portfolio from './components/Portfolio';
import Footer from './components/Footer';
import SearchPage from './components/SearchPage';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './App.css'; // Import your custom styles if any
import axios from './utils/axios.js';


function App() {
  // State to store watchlist items
  const [walletBalance, setWalletBalance] = useState(null);

  // Fetch watchlist items from the backend when the component mounts
 

  return (
    <Router>
      <Navbar />
      <div>
        <Routes>
          <Route path="/search/home" element={<Search />} />
          <Route path="/search/:ticker" element={<SearchPage  />} />
          <Route path="/watchlist" element={<Watchlist/>}/>
          <Route path="/portfolio" element={<Portfolio  />}/>
          <Route exact path="/" element={<Search />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
