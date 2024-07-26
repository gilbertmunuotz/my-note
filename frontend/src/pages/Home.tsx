import NewNote from './AddNote';
import EditNote from './EditNote';
import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Fab, IconButton } from "@mui/material";
import { Note } from "../Interfaces/Interfaces";
import { formatDate } from "../utilities/Datefunc";
import { useGetNotesQuery } from '../app/APISlice';

function Home() {
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [notes, setNotes] = useState<Note[]>([]);
    const { data, isLoading, isError } = useGetNotesQuery();

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);

    const handleEditOpen = () => setEditModalOpen(true);
    const handleEditClose = () => setEditModalOpen(false);

    useEffect(() => {
        if (data) {
            setNotes(data.Notes);
            toast.success("Notes Fetched Successfully!");
        }
    }, [data]);

    if (isError) {
        toast.error("Sorry, an error occurred.");
    }

    return (
        <div className="p-4 relative min-h-screen">
            {isLoading ? (
                <Spinner loading={isLoading} />
            ) : (
                <>
                    {notes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-4 mb-4">
                            {notes.map((note: Note) => (
                                <div key={note._id} className="p-4 rounded-md" style={{ background: '#EDEAE0' }}>
                                    <h1 className="text-xl font-bold mb-2">{note.title}</h1>
                                    <p className="text-gray-700">{note.text}</p>
                                    <section className="text-left text-sm flex justify-between sm:text-right sm:text-base border-t-2 border-y-white space-y-2">
                                        <div className="icon mt-2 ">
                                            <IconButton onClick={handleEditOpen}>
                                                <EditIcon />
                                            </IconButton>
                                        </div>
                                        <div className="timeStamp">
                                            {note.updatedAt > note.createdAt ? (
                                                `Updated At: ${formatDate(note.updatedAt)}`
                                            ) : (
                                                `${formatDate(note.createdAt)}`
                                            )}
                                        </div>
                                    </section>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                                No notes available
                            </div>
                        </div>
                    )}
                </>
            )}
            {!isLoading && (
                <Fab color="primary" aria-label="add" onClick={handleOpen} style={{ position: 'fixed', bottom: '16px', right: '16px' }}>
                    <AddIcon />
                </Fab>
            )}
            <NewNote open={modalOpen} onClose={handleClose} />
            <EditNote open={editModalOpen} onClose={handleEditClose} />
        </div>
    );
}

export default Home;