import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { EditNoteProps } from "../Interfaces/Interfaces";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { useGetNoteIdQuery, useUpdateNoteMutation } from '../api/notesAPISlice';


function EditNote({ open, onClose, noteId }: EditNoteProps) {
    // Initialize Hooks
    const { data: note, isError } = useGetNoteIdQuery(noteId!, { skip: !noteId });
    const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();

    // Manage state for form inputs 
    const [text, setText] = useState<string>('');
    const [title, setTitle] = useState<string>('');

    // Populate form state with the fetched Note data on initial render
    useEffect(() => {
        if (note) {
            setText(note.text);
            setTitle(note.title);
        }
    }, [note])

    // Handle form submission to update Note
    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        try {
            await updateNote({ _id: noteId, title, text }).unwrap();
            toast.success("Note updated successfully!");
            onClose();
        } catch (error) {
            console.error("Error Updating Note", error);
            toast.error("Error Occured, Try Again");
        }
    }


    // Handle Errors if Any
    if (isError) {
        console.error("Error Occurred");
        toast.error("Sorry, an error occurred.");
    }

    return (
        <div>
            <>
                <Modal open={open} onClose={onClose}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, border: '1px solid #000', p: 4, backgroundColor: 'background.paper', boxShadow: 24 }}>
                        <Typography className="text-center">
                            Edit Note
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                required
                                value={title}
                                margin="normal"
                                variant="outlined"
                                label="Note Title"
                                onChange={(event) => setTitle(event.target.value)}
                            />
                            <TextField
                                fullWidth
                                required
                                multiline
                                value={text}
                                margin="normal"
                                label="Note Text"
                                variant="outlined"
                                onChange={(event) => setText(event.target.value)}
                            />


                            {isUpdating ?
                                <button
                                    className="my-2 py-2 px-32 rounded-md cursor-not-allowed text-white uppercase" style={{ backgroundColor: '#1565c0' }}>Updating.</button>
                                : <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    sx={{ mt: 2 }} className="rounded-xl">Update</Button>
                            }
                        </form>
                    </Box>
                </Modal>
            </>
        </div>
    )
}

export default EditNote;