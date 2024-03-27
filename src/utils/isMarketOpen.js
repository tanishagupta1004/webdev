const isMarketOpen = (timestamp) => {
    const lastUpdate = new Date(timestamp * 1000); // Convert to milliseconds
    const now = new Date();
    const diffInMinutes = (now - lastUpdate) / 60000; // Convert difference to minutes
    return diffInMinutes <= 5; // Market is open if the last update was less than 5 minutes ago
  };
  
export default isMarketOpen;