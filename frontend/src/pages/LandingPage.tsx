import { useState, useEffect } from 'react';
import Skeleton from '@mui/material/Skeleton';
import { Link } from "react-router-dom";
import mynote from '/mynote.png'

function LandingPage() {

    // State to track if the image is loaded
    const [imageLoaded, setImageLoaded] = useState(false);

    // Simulate loading state
    useEffect(() => {
        // Simulate image loading
        const timer = setTimeout(() => setImageLoaded(true), 2000); // Simulate a 2-second load
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="flex flex-col justify-center items-center p-4 sm:h-screen sm:justify-center">
                        <h1 className="text-3xl font-bold text-center mb-4">Enjoy note taking with your friends</h1>
                        <p className="text-center text-lg mb-12">Put down your thoughts down in one app, share with your friends and loved ones.</p>
                        <Link to={"/login"}>
                            <button type="button" className="px-20 py-2 mb-4 rounded-3xl text-white leading-6" style={{ backgroundColor: '#0087BD' }}>Log In</button>
                        </Link>
                        <h2 className="text-center text-xl">Don't have an Account? Register <Link to={"/register"}><u className="text-sky-700">Here</u></Link></h2>
                    </div>
                    <div className="flex justify-center items-center p-4 sm:h-screen sm:py-6">
                        {imageLoaded ? (
                            <img src={mynote} alt="Home landing page" className="object-contain max-w-full max-h-full" />
                        ) : (
                            <Skeleton variant="rectangular" width={450} height={550} />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default LandingPage;