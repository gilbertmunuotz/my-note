import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { FetchedNotes } from "../Types/FetchedNotes";

function Home() {

    const [notes, setNotes] = useState<FetchedNotes[]>([])
    const [isloading, setIsLoading] = useState(true);
    const url = `/api/allNotes`

    useEffect(() => {
        setTimeout(() => {
            async function fetchData() {
                setIsLoading(true)
                try {
                    const response = await fetch(url, { method: 'GET' });
                    const data = await response.json()
                    setNotes(data.notes);
                } catch (error) {
                    console.error('Error Fetching Data', error);
                } finally {
                    setIsLoading(false) // Set loading to false regardless of success or error
                }
            }
            fetchData();
        }, 4 * 1000);
    }, [url])

    return (
        <div className="p-4">
            {isloading ? (
                <Spinner loading={isloading} /> // Pass loading state to Spinner component
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-4 mb-8">
                    {notes.map(note => (
                        <div key={note._id} className="p-4 bg-white rounded-lg shadow-md">
                            <h1 className="text-xl font-bold mb-2">{note.title}</h1>
                            <p className="text-gray-700">{note.text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Home