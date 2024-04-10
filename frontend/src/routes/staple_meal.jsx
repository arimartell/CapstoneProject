import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SwipeAnimation from '../components/swipe';
import egg from "../egg.png";
import bagel from "../bagel.png";
import chicken from "../chicken.png";
import steak from "../steak.png";
import bread from "../bread.png";
import rice from "../rice.png";

export default function Staple() {
    useEffect(() => {
        document.title = 'Staple';
    }, []);

    const [formData, setFormData] = useState({
        eggs: '',
        bagel: '',
        chicken: '',
        steak: '',
        bread: '',
        rice: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');  // Retrieve the token from local storage

        try {
            const response = await axios.post('http://127.0.0.1:5000/staple_meal', formData, {
                headers: {
                    Authorization: `Bearer ${token}`  // Use the token in the Authorization header
                }
            });
            alert('Staple meal added successfully');
        } catch (error) {
            console.error('Error adding staple meal:', error);
            alert('Error adding staple meal');
        }
    };

    return (
        <>
            <SwipeAnimation />
            <div className="size-full min-h-screen flex flex-col justify-center items-center">
                <div className="hero bg-base-200 ">
                    <div className="hero-content text-center">
                        <div className="max-w-md">
                            <div className="text-5xl font-bold">
                                Add a staple food
                            </div>
                            <p className="text-2xl py-4">
                                Here you can quickly add a common staple food
                            </p>
                        </div>
                    </div>
                </div>

                <form
                    className="flex w-full flex-col justify-center py-8 items-center h-full space-y-4 max-w-md"
                    onSubmit={handleSubmit}
                >
                    <label className="flex justify-around flex-row items-center form-control gap-2 w-full">
                        <img src={egg} className='w-8 h-8' alt="Egg"/>
                        <input
                            className="input input-bordered w-full"
                            type="number"
                            min={0}
                            name="eggs"
                            value={formData.eggs}
                            onChange={handleChange}
                            placeholder="Eggs"
                        />
                    </label>

                    <label className="flex justify-around flex-row items-center form-control gap-2 w-full">
                        <img src={bagel} className='w-8 h-8' alt="Bagel"/>
                        <input
                            className="input input-bordered w-full"
                            type="number"
                            min={0}
                            name="bagel"
                            value={formData.bagel}
                            onChange={handleChange}
                            placeholder="Bagel"
                        />
                    </label>

                    <label className="flex justify-around flex-row items-center form-control gap-2 w-full">
                        <img src={chicken} className='w-8 h-8' alt="Chicken"/>
                        <input
                            className="input input-bordered w-full"
                            type="number"
                            min={0}
                            name="chicken"
                            value={formData.chicken}
                            onChange={handleChange}
                            placeholder="Chicken (120g)"
                        />
                    </label>

                    <label className="flex justify-around flex-row items-center form-control gap-2 w-full">
                        <img src={steak} className='w-8 h-8' alt="Steak"/>
                        <input
                            className="input input-bordered w-full"
                            type="number"
                            min={0}
                            name="steak"
                            value={formData.steak}
                            onChange={handleChange}
                            placeholder="Steak (220g)"
                        />
                    </label>

                    <label className="flex justify-around flex-row items-center form-control gap-2 w-full">
                        <img src={bread} className='w-8 h-8' alt="Bread"/>
                        <input
                            className="input input-bordered w-full"
                            type="number"
                            min={0}
                            name="bread"
                            value={formData.bread}
                            onChange={handleChange}
                            placeholder="Bread (1 slice)"
                        />
                    </label>

                    <label className="flex justify-around flex-row items-center form-control gap-2 w-full">
                        <img src={rice} className='w-8 h-8' alt="Rice"/>
                        <input
                            className="input input-bordered w-full"
                            type="number"
                            min={0}
                            name="rice"
                            value={formData.rice}
                            onChange={handleChange}
                            placeholder="Rice (160g)"
                        />
                    </label>

                    <button className="btn btn-primary w-full max-w-sm">Submit</button>
                </form>
            </div>
        </>
    );
}
