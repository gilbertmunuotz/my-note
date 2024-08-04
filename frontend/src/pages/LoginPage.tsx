import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { GoogleOriginal } from 'devicons-react';
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
                    <TextField fullWidth label="email" margin="normal" />
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
                    <Button variant="contained" color="primary" fullWidth sx={{ mt: 2, mb: 1 }}>
                        Login
                    </Button>

                    <hr className='my-3 border-y- border-black' />
                    <p className='text-md font-semibold ml-40 leading-loose mb-1'>Or</p>


                    <Button variant="outlined" fullWidth
                        sx={{ borderRadius: '50px', backgroundColor: 'white', color: 'black', fontSize: '14px', ":hover": { backgroundColor: 'aliceblue' } }}>
                        <div className="flex gap-3">
                            <GoogleOriginal size="20" />
                            <p>Continue with Google.</p>
                        </div>
                    </Button>
                </Box>
            </Modal>
        </div>
    )
}

export default LoginPage;