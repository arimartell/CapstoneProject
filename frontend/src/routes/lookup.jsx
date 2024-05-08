import React, { useState } from 'react';
import axios from 'axios';

function FoodLookup() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [detailedInfo, setDetailedInfo] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null); // Track which item is active

    const handleSearch = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/lookup', { ingr: query });
            const modifiedResults = response.data.hints.map(item => ({
                ...item,
                image: item.food.image // Save the image URL from the search result
            }));
            setResults(modifiedResults);
            setDetailedInfo(null); // Reset detailed info on new search
            setActiveIndex(null); // Reset active index on new search
        } catch (error) {
            console.error('Error during lookup:', error);
            alert('Error during lookup');
        }
    };

    const fetchDetailedInfo = async (foodId, index) => {
        try {
            const url = `https://api.edamam.com/api/food-database/v2/nutrients?app_id=dca363b5&app_key=6b400d1db41322ce8fc5cd0e892b418d`;
            const data = {
                ingredients: [
                    {
                        quantity: 100,
                        measureURI: "http://www.edamam.com/ontologies/edamam.owl#Measure_gram",
                        foodId: foodId
                    }
                ]
            };
            const headers = {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            };
            const response = await axios.post(url, data, { headers });
            setDetailedInfo(response.data);
            setActiveIndex(index); // Set active index to control display logic
        } catch (error) {
            console.error('Error fetching detailed info:', error);
            alert('Error fetching detailed info');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
            <h1 style={{ margin: '20px', fontSize: '24px', fontWeight: 'bold' }}>Food Lookup (per 100g)</h1>
            <div>
                <input
                    style={{ padding: '10px', width: '300px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter food item"
                />
                <button 
                    style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
                    onClick={handleSearch}>
                    Search
                </button>
            </div>
            <ul style={{ listStyleType: 'none', padding: '0', width: '100%' }}>
                {results.map((item, index) => (
                    <li key={index} style={{ width: '100%', cursor: 'pointer' }}>
                        <div onClick={() => fetchDetailedInfo(item.food.foodId, index)} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                            {item.food.label} - {item.food.category}
                        </div>
                        {activeIndex === index && detailedInfo && (
                            <div style={{ paddingLeft: '20px', paddingBottom: '10px', borderBottom: '1px solid #ccc' }}>
                                <img src={item.image} alt={item.food.label} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                <p>Calories: {detailedInfo.totalNutrients.ENERC_KCAL.quantity} kcal</p>
                                <p>Protein: {detailedInfo.totalNutrients.PROCNT.quantity} g</p>
                                <p>Fat: {detailedInfo.totalNutrients.FAT.quantity} g</p>
                                <p>Carbs: {detailedInfo.totalNutrients.CHOCDF.quantity} g</p>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FoodLookup;
