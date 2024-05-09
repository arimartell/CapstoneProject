import React, { useState } from 'react';
import axios from 'axios';

function FoodLookup() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [detailedInfo, setDetailedInfo] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null); // Track which item is active
    const [selectedMeasureIndex, setSelectedMeasureIndex] = useState(null); // Track which measurement is selected

    const handleSearch = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/lookup', { ingr: query });
            const modifiedResults = response.data.hints.map(item => ({
                ...item,
                image: item.food.image,
                uri: item.food.uri
            }));
            setResults(modifiedResults);
            setDetailedInfo(null);
            setActiveIndex(null);
            setSelectedMeasureIndex(null);
        } catch (error) {
            console.error('Error during lookup:', error);
            alert('Error during lookup');
        }
    };

    const fetchDetailedInfo = async (foodId, measureURI, measureIdx) => {
        try {
            const url = `https://api.edamam.com/api/food-database/v2/nutrients?app_id=dca363b5&app_key=6b400d1db41322ce8fc5cd0e892b418d`;
            const data = {
                ingredients: [
                    {
                        quantity: 1,
                        measureURI: measureURI,
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
            setSelectedMeasureIndex(measureIdx); // Set selected measure index
        } catch (error) {
            console.error('Error fetching detailed info:', error);
            alert('Error fetching detailed info');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
            <h1 style={{ margin: '20px', fontSize: '24px', fontWeight: 'bold' }}>Food Lookup</h1>
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
                        <div onClick={() => setActiveIndex(index)} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                            {item.food.label} - {item.food.category}
                        </div>
                        {activeIndex === index && (
                          <div>
                              <img src={item.image} alt={item.food.label} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                              <ul style={{ paddingLeft: '20px' }}>
                                  {item.measures.map((measure, idx) => (
                                      <li key={idx} onClick={() => fetchDetailedInfo(item.food.foodId, measure.uri, idx)} style={{
                                          listStyleType: 'none', 
                                          cursor: 'pointer', 
                                          padding: '5px',
                                          backgroundColor: selectedMeasureIndex === idx && activeIndex === index ? '#4CAF50' : 'transparent', // Change color when selected
                                          color: selectedMeasureIndex === idx && activeIndex === index ? 'white' : 'white'
                                      }}>
                                          {measure.label}
                                      </li>
                                  ))}
                              </ul>
                              {detailedInfo && activeIndex === index && (
                                  <div style={{ paddingLeft: '20px', paddingBottom: '10px', borderBottom: '1px solid #ccc' }}>
                                      <p>Calories: {Math.floor(detailedInfo.totalNutrients.ENERC_KCAL.quantity)} kcal</p>
                                      <p>Protein: {Math.floor(detailedInfo.totalNutrients.PROCNT.quantity)} g</p>
                                      <p>Fat: {Math.floor(detailedInfo.totalNutrients.FAT.quantity)} g</p>
                                      <p>Saturated Fat: {Math.floor(detailedInfo.totalNutrients.FASAT.quantity)} g</p>
                                      <p>Carbs: {Math.floor(detailedInfo.totalNutrients.CHOCDF.quantity)} g</p>
                                      <p>Sugars: {Math.floor(detailedInfo.totalNutrients.SUGAR.quantity)} g</p>

                                  </div>
                              )}
                          </div>
                      )}

                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FoodLookup;
