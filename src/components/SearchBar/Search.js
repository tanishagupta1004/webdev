// // src/components/Search.js
// import React, { useState } from 'react';
// import axios from '../../utils/axios.js';
// import { useNavigate } from 'react-router-dom';
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
// import './Search.css';

// function Search() {
//   const [options, setOptions] = useState([]);
//   const [inputValue, setInputValue] = useState('');
//   const navigate = useNavigate(); // Hook from react-router-dom to navigate programmatically

//   const fetchSuggestions = async (value) => {
//     if (value.length > 0 && !value.includes('.')) {
//       try {
//         const response = await axios.get(`/api/suggestions/${value}`);
//         setOptions(response.data.result);
//       } catch (error) {
//         console.error('Error fetching suggestions:', error);
//         setOptions([]);
//       }
//     } else {
//       setOptions([]);
//     }
//   };

//   const handleInputChange = (event, newInputValue) => {
//     setInputValue(newInputValue);
//   };

//   // Triggered when the search (magnifying glass) icon is clicked
//   const handleSearchClick = () => {
//     if (inputValue.trim()) {
//       navigate(`/search/${inputValue.trim()}`);
//     }
//   };

//   // Clears the input field
//   const handleClearInput = () => {
//     setInputValue('');
//     setOptions([]);
//   };

//   return (
//     <div className="container my-4">
//       <h2 className="text-center mb-3">STOCK SEARCH</h2>
//       <div className="row justify-content-center">
//         <div className="col-lg-6 col-md-8 col-sm-10">
//           <Autocomplete
//             freeSolo
//             id="stock-search"
//             inputValue={inputValue}
//             options={options.filter(
//               (option) => option.type === 'Common Stock' && !option.symbol.includes('.')
//             )}
//             onInputChange={(event, newInputValue, reason) => {
//               if (reason === 'input') handleInputChange(event, newInputValue);
//             }}
//             getOptionLabel={(option) => `${option.symbol} | ${option.description}`}
//             onSelect={handleSearchClick} // When an option is selected
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="Enter stock ticker symbol"
//                 variant="outlined"
//                 InputProps={{
//                   ...params.InputProps,
//                   endAdornment: (
//                     <React.Fragment>
//                       {params.InputProps.endAdornment}
//                       <FontAwesomeIcon icon={faMagnifyingGlass} onClick={handleSearchClick} />
//                       <FontAwesomeIcon icon={faXmark} onClick={handleClearInput} />
//                     </React.Fragment>
//                   ),
//                 }}
//               />
//             )}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Search;

// src/components/Search.js
import React, { useState } from 'react';
import axios from '../../utils/axios.js';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import './Search.css';
import { Spinner } from 'react-bootstrap';



function Search() {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State to manage loading status
  const navigate = useNavigate();

  const fetchSuggestions = async (value) => {
    setIsLoading(true); // Start loading
    if (value.length > 0 && !value.includes('.')) {
      try {
        const response = await axios.get(`/api/suggestions/${value}`);
        console.log("Suggest",response.data)
        setOptions(response.data.result); // Adjusted based on expected API response structure
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setOptions([]);
      }
    } else {
      setOptions([]);
    }
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    fetchSuggestions(newInputValue);
  };

  const handleSearchClick = () => {
    if (inputValue.trim()) {
      navigate(`/search/${inputValue.trim()}`);
    }
  };

  const handleClearInput = () => {
    setInputValue('');
    setOptions([]);
  };

  // 
  return (
    <div className="container my-4">
      <h2 className="text-center mb-3">STOCK SEARCH</h2>
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10 position-relative">
          {isLoading && (
            <div className="spinner-container">
              <Spinner animation="border" variant="primary" />
            </div>
          )}
          <Autocomplete
            freeSolo
            id="stock-search"
            inputValue={inputValue}
            onInputChange={handleInputChange}
            options={options.filter(option => option.type === 'Common Stock' && !option.symbol.includes('.'))}
            getOptionLabel={option => `${option.symbol} | ${option.description}`}
            onChange={(event, newValue) => {
              if (newValue) {
                navigate(`/search/${newValue.symbol}`);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Enter stock ticker symbol"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: isLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : null,
                  endAdornment: (
                    <>
                      <FontAwesomeIcon icon={faMagnifyingGlass} onClick={handleSearchClick} />
                      {inputValue && <FontAwesomeIcon icon={faXmark} onClick={handleClearInput} />}
                    </>
                  ),
                }}
                className={`search-field ${isLoading ? 'loading' : ''}`}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}


export default Search;
