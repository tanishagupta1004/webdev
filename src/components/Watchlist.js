// import React, { useState, useEffect } from 'react';
// import axios from '../utils/axios';
// import WatchlistCard from './WatchlistCard';

// function Watchlist({watchlistItems}) {
//   const [watchItems, setWatItems] = useState(watchlistItems);

//   useEffect(() => {
//     const fetchWatchlistItems = async () => {
//       try {
//         const response = await axios.get('/api/watchlist');
//         setWatItems(response.data);
//       } catch (error) {
//         console.error('Error fetching watchlist items:', error);
//       }
//     };

//     fetchWatchlistItems();
//   }, []);

//   return (
//     <div className="container">
//       <h2>Watchlist</h2>
//       <div className="row">
//         {watchItems.map(item => (
//           <WatchlistCard key={item.symbol} item={item} />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Watchlist;

import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import WatchlistCard from './WatchlistCard';

function Watchlist() {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch watchlist items
  const fetchWatchlistItems = async () => {
    try {
      const response = await axios.get('/api/watchlist');
      console.log("watchlist",response.data)
      setWatchlistItems(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching watchlist items:', error);
      setIsLoading(false);
    }
  };

  // Initial fetch of watchlist items on component mount
  useEffect(() => {
    fetchWatchlistItems();
  }, []);

  // Function to handle item removal from watchlist
  const handleRemoveFromWatchlist = async (symbol) => {
    try {
      // Delete item from the watchlist
      await axios.delete(`/api/watchlist/${symbol}`);
      // Fetch updated watchlist items after successful deletion
      fetchWatchlistItems();
    } catch (error) {
      console.error('Error removing item from watchlist:', error);
    }
  };

  return (
    <div>
      <h2>Watchlist Component</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="row">
          {watchlistItems.map((item) => (
            <WatchlistCard
              key={item._id}
              item={item}
              onRemove={handleRemoveFromWatchlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;

