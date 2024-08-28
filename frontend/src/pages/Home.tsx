import NewNote from './AddNote';
import EditNote from './EditNote';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { user } from '../assets/authSlice';
import Spinner from "../components/Spinner";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Note } from "../Interfaces/Interfaces";
import React, { useState, useEffect } from "react";
import { logoutSuccess } from '../assets/authSlice';
import { formatDate } from "../utilities/Datefunc";
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, useNavigate } from 'react-router-dom';
import PushPinIcon from '@mui/icons-material/PushPin';
import { AuthResponse } from '../Interfaces/Interfaces';
import { Fab, IconButton, Tooltip } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useGetUserQuery, useLogoutMutation } from '../api/userAPISlice';
import { useGetNotesQuery, useDeleteNoteMutation, usePinNoteMutation, useUnPinNoteMutation } from '../api/notesAPISlice';


function Home() {

    // State Hooks
    const userInfo = useSelector(user) as AuthResponse; // Extract user information

    const userId = userInfo?.user?._id; // Extract user ID from user Slice


    // Use the user ID to fetch user details from the API(Specifically Profile Photo)
    const { data: userDetails } = useGetUserQuery(userId!);
    const userPhoto = userDetails?.photo;

    const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false); // Manage Add Modal
    const [editModalOpen, setEditModalOpen] = useState(false); // Manages the open/close state of the edit modal.
    const [selectedNoteId, setSelectedNoteId] = useState<string>(''); // Stores the ID of the note being edited
    const [notes, setNotes] = useState<Note[]>([]);
    const { data, isLoading, isError } = useGetNotesQuery(userId); // Pass Id to the Hook to Get All Notes
    const [deleteNote] = useDeleteNoteMutation();
    const [logout] = useLogoutMutation();
    const [pin] = usePinNoteMutation();
    const [unPin] = useUnPinNoteMutation();

    // Modals Functions
    const handleOpen = () => setModalOpen(true);
    const handleClose = () => { setModalOpen(false); setEditModalOpen(false); };// Closes both the add and edit modals and resets the selectedNoteId.
    const handleEditOpen = (noteId: string) => { setSelectedNoteId(noteId); setEditModalOpen(true); };// Sets the selectedNoteId and opens the edit modal.
    const handleEditClose = () => setEditModalOpen(false);


    const handleToggleExpand = (noteId: string) => {
        setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
    };

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


    // User Logout Logic
    async function handleLogout(event: React.FormEvent) {
        event.preventDefault();

        try {
            const user = await logout().unwrap();
            dispatch(logoutSuccess(user));
            toast.success("Logged Out Succesfully!");
            navigate("/");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error Logging Out', error);
            if (error?.data?.message) {
                toast.error(error.data.message);
            }
        }
    }

    // Handle Any Errors if any
    if (isError) {
        console.error("Error Occurred");
        toast.error("Sorry, an error occurred.");
    }

    //Handle pin Note
    async function handlePinNote(noteId: string) {
        try {
            await pin(noteId).unwrap();
        } catch (error) {
            console.error('Failed to pin the note:', error);
            toast.error("Failed to Pin Note")
        }
    }

    //Handle Un Pin Note
    async function handleUnpinNote(noteId: string) {
        try {
            await unPin(noteId).unwrap();
        } catch (error) {
            console.error('Failed to Unpin the note:', error);
            toast.error("Failed to Pin Note")
        }
    }

    // Sort notes so that pinned notes come first
    const sortedNotes = notes.slice().sort((a, b) => {
        const pinnedA = a.pinned ?? false;
        const pinnedB = b.pinned ?? false;

        // Sort so that pinned notes come first
        return (pinnedB ? 1 : 0) - (pinnedA ? 1 : 0);
    });

    return (
        <div className="p-4 relative min-h-screen">
            {isLoading ? (
                <Spinner loading={false} />
            ) : (
                <>
                    <div className="flex justify-between my-2 mx-6">
                        <div className="logout">
                            <Tooltip title="Log Out">
                                <button onClick={handleLogout} className='text-base text-white px-5 py-1 rounded-3xl' style={{ background: '#1976D2' }}><LogoutIcon /></button>
                            </Tooltip>
                        </div>

                        <div className="profile">
                            <Tooltip title="My Profile">
                                <Link to={"/me/profile"}>
                                    {userPhoto ? (
                                        <img
                                            src={userPhoto}
                                            alt="Profile"
                                            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                        />
                                    ) : (
                                        <AccountCircleIcon sx={{ fontSize: 40 }} />
                                    )}
                                </Link>
                            </Tooltip>
                        </div>
                    </div>

                    {notes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-4 mb-4">
                            {sortedNotes.map((note: Note) => (
                                <div
                                    key={note._id}
                                    className={`p-4 rounded-md cursor-pointer ${expandedNoteId === note._id ? 'bg-gray-200' : 'bg-gray-100'}`}
                                    style={{ background: expandedNoteId === note._id ? '#EDEAE0' : '#F5F5F5' }}
                                    onClick={() => handleToggleExpand(note._id as string)}>
                                    <div className="flex justify-between">
                                        <h1 className="text-xl font-bold mb-2">{note.title}</h1>
                                        {note.pinned ? (
                                            <Tooltip title="UnPin">
                                                <button type="button" onClick={(e) => { e.stopPropagation(); handleUnpinNote(note._id as string); }}>
                                                    <PushPinIcon />
                                                </button>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="Pin">
                                                <button type="button" onClick={(e) => { e.stopPropagation(); handlePinNote(note._id as string); }}>
                                                    <PushPinIcon sx={{ opacity: 0.2 }} />
                                                </button>
                                            </Tooltip>
                                        )}
                                    </div>
                                    <p className="text-gray-700">{note.text}</p>
                                    {expandedNoteId === note._id && (
                                        <section className="text-left text-sm flex justify-between sm:text-right sm:text-base border-t-2 border-y-white space-y-2">
                                            <div className="icon mt-2">
                                                <IconButton onClick={(e) => { e.stopPropagation(); note._id && handleEditOpen(note._id); }}>
                                                    <Tooltip title="Edit">
                                                        <EditIcon />
                                                    </Tooltip>
                                                </IconButton>
                                                <IconButton onClick={(e) => { e.stopPropagation(); note._id && handleDelete(note._id); }} style={{ color: '#FF0000' }}>
                                                    <Tooltip title="Delete">
                                                        <DeleteIcon />
                                                    </Tooltip>
                                                </IconButton>
                                            </div>
                                            <div className="timeStamp">
                                                {note.updatedAt && note.createdAt ? (
                                                    note.updatedAt > note.createdAt ? (
                                                        `Updated: ${formatDate(note.updatedAt)}`
                                                    ) : (
                                                        `${formatDate(note.createdAt)}`
                                                    )
                                                ) : (
                                                    `Created: ${formatDate(note.createdAt ?? '')}`
                                                )}
                                            </div>
                                        </section>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center text-2xl font-bold">
                                No Notes available
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