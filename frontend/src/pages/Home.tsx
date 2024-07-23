import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { FetchedNotes } from "../Interfaces/FetchedNotes";

function Home() {

    const [notes, setNotes] = useState<FetchedNotes[]>([])
    const [isloading, setIsLoading] = useState(true);
    const url = `/api/notes/all`;

    useEffect(() => {
        setTimeout(() => {
            async function fetchData() {
                setIsLoading(true);
                try {
                    const response = await fetch(url, { method: 'GET' });
                    const data = await response.json();
                    setNotes(data.Notes); //Update The notes variable
                } catch (error) {
                    console.error('Error Fetching Data', error);
                    throw error; // Throw the error to be caught by toast.promise
                } finally {
                    setIsLoading(false); // Set loading to false regardless of success or error
                }
            }
            //Handling Promises By React Toastify
            toast.promise(fetchData(), {
                pending: 'Fetching Notes...',
                success: 'Notes fetched Successfully',
                error: 'Failed to fetch Notes. Please try again.',
            });
        }, 3 * 1000); // Set Timeout for 3 Seconds
    }, [url]);


    return (
        <div className="p-4">
            {isloading ? (
                <Spinner loading={isloading} /> //Pass loading state to Spinner component
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-4 mb-8">
                    {notes.map(note => (
                        <div key={note._id} className="p-4 rounded-lg shadow-md" style={{ background: '#828E8C' }}>
                            <h1 className="text-xl font-bold mb-2">{note.title}</h1>
                            <p className="text-gray-700">{note.text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Home;