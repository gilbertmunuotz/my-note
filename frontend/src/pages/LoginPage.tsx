import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, Modal, Box, Typography, TextField, InputAdornment, IconButton } from '@mui/material';

function LoginPage() {

    const [open, setOpen] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div onClick={handleOpen}>

            <Modal open={open} onClose={handleClose} aria-labelledby="sign-in-modal-title">
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '1px solid #000', p: 4 }}>
                    <Typography id="sign-in-modal-title" variant="h6" component="h2" className='text-center'>
                        Welcome Back.
                    </Typography>
                    <TextField fullWidth label="username" margin="normal" />
                    <TextField fullWidth label="password" margin="normal"
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                            endAdornment: (<InputAdornment position='end'>
                                <IconButton onClick={handleTogglePasswordVisibility} edge='end'>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>)
                        }}
                    />
                    <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Login
                    </Button>
                </Box>
            </Modal>
        </div>
    )
}

export default LoginPage;