// import React, { useState } from 'react';
// import axios from 'axios';

// function WatchlistCard({ item }) {
//   const [isRemoving, setIsRemoving] = useState(false);

//   const handleRemoveFromWatchlist = async () => {
//     setIsRemoving(true);
//     try {
//       // Delete item from the watchlist
//       await axios.delete(`/api/watchlist/${item.symbol}`);
//       // If successful, you may want to trigger a reload of the watchlist or update the UI accordingly
//       setIsRemoving(false);
//     } catch (error) {
//       console.error('Error removing item from watchlist:', error);
//       setIsRemoving(false);
//     }
//   };

//   return (
//     <div className="col-md-4 mb-4">
//       <div className="card">
//         <div className="card-body">
//           <h5 className="card-title">{item.name}</h5>
//           <p className="card-text">{item.symbol}</p>
//           <p className="card-text">Current Price: ${item.curPrice}</p>
//           <p className="card-text">Difference: ${item.diff} ({item.diffPer}%)</p>
//           {/* Add additional fields as needed */}
//           <button
//             className="btn btn-danger"
//             onClick={handleRemoveFromWatchlist}
//             disabled={isRemoving}
//           >
//             {isRemoving ? 'Removing...' : 'Remove'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// export default WatchlistCard;

import React from 'react';

function WatchlistCard({ item, onRemove }) {
  const handleRemoveClick = () => {
    onRemove(item.symbol);
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{item.name}</h5>
          <p className="card-text">{item.symbol}</p>
          <p className="card-text">Current Price: ${item.curPrice}</p>
          <p className="card-text">Difference: ${item.diff} ({item.diffPer}%)</p>
          <button className="btn btn-danger" onClick={handleRemoveClick}>Remove</button>
        </div>
      </div>
    </div>
  );
}

export default WatchlistCard;

