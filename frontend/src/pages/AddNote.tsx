import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAddNewNoteMutation } from "../app/APISlice";
import { AddNotes, Note } from "../Interfaces/Interfaces";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

function AddNote({ open, onClose }: AddNotes) {

    const navigate = useNavigate();
    const [addNewNote, { isLoading, isError }] = useAddNewNoteMutation();
    const [text, setText] = useState<string>('');
    const [title, setTitle] = useState<string>('');


    async function handleSubmit(event: React.FormEvent) {

        event.preventDefault();

        const newNote: Note = { title, text };

        try {
            await addNewNote(newNote).unwrap();
            setText('');
            setTitle('');
            onClose();
            navigate("/");
        } catch (error) {
            console.error("Error Saving New Note");
            toast.error("Sorry, an error occurred.");
        }

        if (isError) {
            toast.error("Sorry, an error occurred.");
        }
    }

    return (
        <div>
            <>
                <Modal open={open} onClose={onClose}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, border: '1px solid #000', p: 4, backgroundColor: 'background.paper', boxShadow: 24 }}>
                        <Typography className="text-center">
                            Create New Note
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                required
                                value={title}
                                margin="normal"
                                variant="outlined"
                                label="Note Title"
                                placeholder="Enter your Note Title here"
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
                                placeholder="Enter your Note Text here"
                                onChange={(event) => setText(event.target.value)}
                            />

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                sx={{ mt: 2 }} className="rounded-xl"
                            >
                                {isLoading ? 'Savings....' : 'Save'}
                            </Button>
                        </form>
                    </Box>
                </Modal>
            </>
        </div >
    )
}

export default AddNote;