
// Higher-level component or hook to fetch data
import { useState, useEffect } from "react";

const useCardData = () => {
  const [cardData, setCardData] = useState([]);

  useEffect(() => {
    fetch('http://163.125.102.142:5000/api/cards')
      .then(response => response.json())
      .then(data => setCardData(data))
      .catch(error => console.error('Error fetching card data:', error));
  }, []);

  return cardData;
};

export default useCardData;
