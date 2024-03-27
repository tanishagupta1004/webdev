// // import React from 'react';

// // const TopNewsTab=()=>{
// //     return (
// //         <div>TopNews</div>
// //     );
// // }

// // export default TopNewsTab;


// import React, { useState } from 'react';
// import {
//   Card,
//   CardActionArea,
//   CardMedia,
//   CardContent,
//   Typography,
//   Modal,
//   Box,
//   IconButton
// } from '@mui/material';
// import { Share as ShareIcon } from '@mui/icons-material';

// // Define a component for individual news cards
// const NewsCard = ({ newsItem, onOpen }) => {
//   return (
//     <Card sx={{ maxWidth: 345, m: 2 }}>
//       <CardActionArea onClick={() => onOpen(newsItem)}>
//         <CardMedia
//           component="img"
//           height="140"
//           image={newsItem.image}
//           alt={newsItem.title}
//         />
//         <CardContent>
//           <Typography gutterBottom variant="h5" component="div">
//             {newsItem.title}
//           </Typography>
//         </CardContent>
//       </CardActionArea>
//     </Card>
//   );
// };

// // Define a component for the Modal containing the detailed news information
// const NewsModal = ({ open, onClose, newsItem }) => {
//   const shareOnTwitter = () => {
//     const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(newsItem.title)} ${encodeURIComponent(newsItem.url)}`;
//     window.open(twitterUrl, '_blank');
//   };

//   const shareOnFacebook = () => {
//     const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(newsItem.url)}`;
//     window.open(facebookUrl, '_blank');
//   };

//   return (
//     <Modal
//       open={open}
//       onClose={onClose}
//       aria-labelledby="news-modal-title"
//       aria-describedby="news-modal-description"
//     >
//       <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, outline: 'none' }}>
//         <Typography id="news-modal-title" variant="h6" component="h2">
//           {newsItem.title}
//         </Typography>
//         <Typography id="news-modal-description" sx={{ mt: 2 }}>
//           {newsItem.description}
//         </Typography>
//         <Typography sx={{ mt: 2 }}>
//           Source: {newsItem.source} <br />
//           Published Date: {new Date(newsItem.datetime).toLocaleDateString()}
//         </Typography>
//         <Typography sx={{ mt: 2 }}>
//           For more details click <a href={newsItem.url} target="_blank" rel="noopener noreferrer">here</a>.
//         </Typography>
//         <Box sx={{ mt: 2 }}>
//           <IconButton onClick={shareOnTwitter}><ShareIcon /></IconButton>
//           <IconButton onClick={shareOnFacebook}><ShareIcon /></IconButton>
//         </Box>
//       </Box>
//     </Modal>
//   );
// };

// // The main component to export
// const TopNewsTab = ({ news }) => {
//   const [selectedNews, setSelectedNews] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);

//   const handleOpenModal = (newsItem) => {
//     setSelectedNews(newsItem);
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//   };

//   return (
//     <div>
//       {news.map((newsItem, index) => (
//         <NewsCard key={index} newsItem={newsItem} onOpen={handleOpenModal} />
//       ))}
//       {selectedNews && (
//         <NewsModal
//           open={modalOpen}
//           onClose={handleCloseModal}
//           newsItem={selectedNews}
//         />
//       )}
//     </div>
//   );
// };

// export default TopNewsTab;
// import React, { useState } from 'react';
// import { Modal, Box, Typography, IconButton } from '@mui/material';
// import TwitterIcon from '@mui/icons-material/Twitter';
// import FacebookIcon from '@mui/icons-material/Facebook';

// const TopNewsTab = ({ newsData }) => {
//   console.log("NewsData", newsData);

//     const topNews = [];
//     let count = 0;

//     // Iterate over the newsData array
//     for (let i = 0; i < newsData.length; i++) {
//         const news = newsData[i];
        
//         // Check if the news object contains all required fields and isConfirmed
//         if (
//             // news.image != " " &&
//             // // news.title &&
//             // // news.datetime &&
//             // news.summary != " " 
//             // // news.url &&
//             // // news.source
//             news.image && // Check if image exists
//     news.image.trim() !== "" && // Check if image is not empty
//     news.summary && // Check if summary exists
//     news.summary.trim() !== "" 
            
//         ) {
//             // Add the news to the topNews array
//             topNews.push(news);
//             count++;

//             // If we have found 20 news articles, stop iterating
//             if (count === 20) {
//                 break;
//             }
//         }
//     }

//   const modalStyle = {
//     position: 'absolute',
//     top: '25%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     backgroundColor: 'white',
//     border: '2px solid #000',
//     boxShadow: 24,
//     p: 4,
//   };
//     console.log(newsData)
//   const [open, setOpen] = useState(false);
//   const [selectedNews, setSelectedNews] = useState(null);

// //   const TopNewsTab = ({ newsData = [] }) => { // Set default to empty array
// //     const [open, setOpen] = useState(false);
// //     const [selectedNews, setSelectedNews] = useState({}); // Initialize as empty object
  

//   const handleOpen = (news) => {
//     setSelectedNews(news);
//     setOpen(true);
//   };

//   const handleClose = () => setOpen(false);

//   const openInNewTab = (url) => {
//     const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
//     if (newWindow) newWindow.opener = null;
//   };

//   const shareOnTwitter = (title, url) => {
//     const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
//     openInNewTab(tweetUrl);
//   };

//   const shareOnFacebook = (url) => {
//     const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
//     openInNewTab(facebookUrl);
//   };

//   return (
//     <div>
//       {Array.isArray(topNews) && topNews.map((news, index) => (
//     //   newsData.map((news, index) => (
//         <div key={index} onClick={() => handleOpen(news)}>
//           <img src={news.image} alt={news.title} />
//           <h3>{news.headline}</h3>
//         </div>
//       ))}

//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="news-details-title"
//         aria-describedby="news-details-description"
//       >
//          <div style={modalStyle}>
//         <Box>
//           {selectedNews && (
//             <div>
//               <Typography id="news-details-title">{selectedNews.headline}</Typography>
//               <Typography id="news-details-description">{selectedNews.summary}</Typography>
//               <Typography>Read more <a href={selectedNews.url} target="_blank" rel="noopener noreferrer">here</a>.</Typography>
//               <IconButton onClick={() => shareOnTwitter(selectedNews.headline, selectedNews.url)}>
//                 <TwitterIcon />
//               </IconButton>
//               <IconButton onClick={() => shareOnFacebook(selectedNews.url)}>
//                 <FacebookIcon />
//               </IconButton>
//             </div>
//           )}
//         </Box>
//         </div>
//       </Modal>
//     </div>
    
//   );
// };

// export default TopNewsTab;


import React, { useState } from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';

const TopNewsTab = ({ newsData }) => {
  console.log("NewsData", newsData);

  const topNews = [];
  let count = 0;

  // Iterate over the newsData array
  for (let i = 0; i < newsData.length; i++) {
    const news = newsData[i];

    // Check if the news object contains all required fields and isConfirmed
    if (
      news.image && // Check if image exists
      news.image.trim() !== "" && // Check if image is not empty
      news.summary && // Check if summary exists
      news.summary.trim() !== ""
    ) {
      // Add the news to the topNews array
      topNews.push(news);
      count++;

      // If we have found 20 news articles, stop iterating
      if (count === 20) {
        break;
      }
    }
  }

  const modalStyle = {
    position: 'absolute',
    top: '25%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  const handleOpen = (news) => {
    setSelectedNews(news);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  const shareOnTwitter = (title, url) => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    openInNewTab(tweetUrl);
  };

  const shareOnFacebook = (url) => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    openInNewTab(facebookUrl);
  };

  return (
    <div className="row">
      {topNews.map((news, index) => (
        <div key={index} className="col-md-6 mb-3">
          <div className="card" onClick={() => handleOpen(news)}>
            <div className="row g-0">
              <div className="col-md-4">
                <img src={news.image} alt={news.title} className="img-fluid" />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{news.headline}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="news-details-title"
        aria-describedby="news-details-description"
      >
        <div style={modalStyle}>
          <Box>
            {selectedNews && (
              <div>
                <Typography id="news-details-title">{selectedNews.headline}</Typography>
                <Typography id="news-details-description">{selectedNews.summary}</Typography>
                <Typography>Read more <a href={selectedNews.url} target="_blank" rel="noopener noreferrer">here</a>.</Typography>
                <IconButton onClick={() => shareOnTwitter(selectedNews.headline, selectedNews.url)}>
                  <TwitterIcon />
                </IconButton>
                <IconButton onClick={() => shareOnFacebook(selectedNews.url)}>
                  <FacebookIcon />
                </IconButton>
              </div>
            )}
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default TopNewsTab;
