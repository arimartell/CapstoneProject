import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SwipeAnimation from '../components/swipe';

export default function Recipe() {
    useEffect(() => {
        document.title = 'Recipe';
    }, []);

    const [formData, setFormData] = useState({
        ingredients: ''
    });
    const [nutrients, setNutrients] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('http://127.0.0.1:5000/recipe', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setNutrients(response.data.nutrients);
            alert('Recipe submitted successfully');
        } catch (error) {
            console.error('Error submitting recipe:', error);
            alert('Error submitting recipe');
        }
    };

    return (
        <>
            <SwipeAnimation />
            <div className="size-full min-h-screen flex flex-col items-center">
                <div className="hero bg-base-200 min-h-[20vh] md:w-[96rem] xl:[90rem] sm:w-[60rem] xs:w-[90rem]">
                    <div className="hero-content items-center text-center">
                        <div className="text-5xl text-wrap items-center text-center sm:text-left font-bold shingo">Look for a Recipe</div>
                    </div>
                </div>
                <div className='items-center'>
                    <form
                        onSubmit={handleSubmit}
                        className="flex size-full flex-col justify-start px-8 mt-48 items-center space-y-4 max-w-md"
                    >
                        <textarea
                            className="textarea textarea-success items-center h-96 md:w-[40rem] sm:w-[40rem] w-[34rem]"
                            placeholder="Enter ingredients on separate lines"
                            name="ingredients"
                            value={formData.ingredients}
                            onChange={handleChange}
                        ></textarea>
                        <button type="submit" className="btn btn-primary w-full max-w-[5rem]">
                            Submit
                        </button>
                    </form>
                </div>
                {nutrients && (
                    <div className="nutrients-info">
                        <h3>Nutrients Information</h3>
                        <table className="table-auto">
                            <thead>
                                <tr>
                                    <th>Nutrient</th>
                                    <th>Quantity</th>
                                    <th>Unit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(nutrients).map(key => (
                                    <tr key={key}>
                                        <td>{nutrients[key].label}</td>
                                        <td>{nutrients[key].quantity.toFixed(2)}</td>
                                        <td>{nutrients[key].unit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
