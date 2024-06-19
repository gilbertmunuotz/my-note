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
        <div>
            {isloading ? (
                <Spinner loading={isloading} /> //Pass loading state to Spinner component
            ) : (
                notes.map(note => (
                    <div key={note._id}>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mx-12 mb-8">
                            <h1>{note.title}</h1>
                            <p>{note.text}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default Home