import NewNote from './AddNote';
import EditNote from './EditNote';
import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Note } from "../Interfaces/Interfaces";
import { formatDate } from "../utilities/Datefunc";
import DeleteIcon from '@mui/icons-material/Delete';
import { Fab, IconButton, Tooltip } from "@mui/material";
import { useGetNotesQuery, useDeleteNoteMutation } from '../api/notesAPISlice';

function Home() {
    const [modalOpen, setModalOpen] = useState(false); // Manage Add Modal
    const [editModalOpen, setEditModalOpen] = useState(false); // Manages the open/close state of the edit modal.
    const [selectedNoteId, setSelectedNoteId] = useState<string>(''); // Stores the ID of the note being edited
    const [notes, setNotes] = useState<Note[]>([]);
    const { data, isLoading, isError } = useGetNotesQuery();
    const [deleteNote] = useDeleteNoteMutation();

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => { setModalOpen(false); setEditModalOpen(false); };// Closes both the add and edit modals and resets the selectedNoteId.


    const handleEditOpen = (noteId: string) => { setSelectedNoteId(noteId); setEditModalOpen(true); };//  Sets the selectedNoteId and opens the edit modal.
    const handleEditClose = () => setEditModalOpen(false);

    // Populate form state with the fetched Note data on initial render
    useEffect(() => {
        if (data) {
            setNotes(data.Notes);
        }
    }, [data]);


    //Delete Note Logic
    async function handleDelete(_id: string) {
        if (window.confirm("This Action is Irreversible!")) {
            try {
                await deleteNote(_id).unwrap();
                // Update the notes state after deletion
                setNotes(notes.filter(note => note._id !== _id));
                toast.success("Note deleted successfully");
            } catch (error) {
                console.error('Failed to delete Note: ', error);
                toast.error("Error Deleting Note");
            }
        }
    }

    // Handle Any Errors if any
    if (isError) {
        console.error("Error Occurred");
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
                                            <IconButton onClick={() => note._id && handleEditOpen(note._id)}>
                                                <Tooltip title="Edit">
                                                    <EditIcon />
                                                </Tooltip>
                                            </IconButton>
                                            <IconButton onClick={() => note._id && handleDelete(note._id)} style={{ color: '#FF0000' }}>
                                                <Tooltip title="Delete">
                                                    <DeleteIcon />
                                                </Tooltip>
                                            </IconButton>
                                        </div>
                                        <div className="timeStamp">
                                            {note.updatedAt && note.createdAt ? (
                                                note.updatedAt > note.createdAt ? (
                                                    `Updated At: ${formatDate(note.updatedAt)}`
                                                ) : (
                                                    `${formatDate(note.createdAt)}`
                                                )
                                            ) : (
                                                `Created At: ${formatDate(note.createdAt ?? '')}`
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
                <Tooltip title="New" style={{ position: 'fixed', bottom: '16px', right: '16px' }}>
                    <Fab color="primary" aria-label="add" onClick={handleOpen}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
            )}
            <NewNote open={modalOpen} onClose={handleClose} />
            <EditNote open={editModalOpen} onClose={handleEditClose} noteId={selectedNoteId} />
        </div>
    );
}

export default Home;