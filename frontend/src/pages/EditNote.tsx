import { useState } from 'react';
import { AddNotes } from "../Interfaces/Interfaces";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";


function EditNote({ open, onClose }: AddNotes) {

    // Initialize Hooks

    // Manage state for form inputs 
    const [text, setText] = useState<string>('');
    const [title, setTitle] = useState<string>('');

    // Populate form state with the fetched todo data on initial render


    return (
        <div>
            <>
                <Modal open={open} onClose={onClose}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, border: '1px solid #000', p: 4, backgroundColor: 'background.paper', boxShadow: 24 }}>
                        <Typography className="text-center">
                            Edit Note
                        </Typography>
                        <form>
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

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                sx={{ mt: 2 }} className="rounded-xl"
                            >
                                Update
                            </Button>
                        </form>
                    </Box>
                </Modal>
            </>
        </div>
    )
}

export default EditNote