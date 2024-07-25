import { AddNotes } from "../Interfaces/Interfaces";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

function AddNote({ open, onClose }: AddNotes) {
    return (
        <div>
            <>
                <Modal open={open} onClose={onClose}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, border: '1px solid #000', p: 4, backgroundColor: 'background.paper', }}>
                        <Typography className="text-center text-white">
                            Create New Note
                        </Typography>
                        <TextField fullWidth label="Note Title" margin="normal" />
                        <TextField fullWidth label="Note Text" margin="normal" />

                        <Button variant="contained" fullWidth sx={{ mt: 2 }} className="rounded-xl">
                            Save
                        </Button>
                    </Box>
                </Modal>
            </>
        </div>
    )
}

export default AddNote;