import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import spinner from '../components/Spinner';
import { SERVER_API } from '../config/constants'
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, Modal, Box, Typography, TextField, InputAdornment, IconButton } from '@mui/material';

function RegisterPage() {

    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);

    const URL = `${SERVER_API}/v1/Auth/auth/google`;


    // Google oauth Logic
    async function googleSignIn() {

        setLoading(true);
        try {
            const response = await fetch(URL, { method: 'GET' });

            const data = response.json();
            navigate("/home");
        } catch (error) {
            console.error("Error Signing In", error);
        }
        finally {
            setLoading(false); // Set loading to false regardless of success or error
        }
    }




    return (
        <div>
            <div onClick={handleOpen}>
                
                {loading ? (
                    <spinner loading={loading} />
                ) : (
                    <Modal open={open} onClose={handleClose} aria-labelledby="sign-in-modal-title">
                        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '1px solid #000', p: 4 }}>
                            <Typography id="sign-in-modal-title" variant="h6" component="h2" className='text-center'>
                                Sign In To Continue.
                            </Typography>
                            <TextField fullWidth label="username" margin="normal" />
                            <TextField fullWidth label="email" margin="normal" type='email' />
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
                                Sign In
                            </Button>
                            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onSubmit={googleSignIn}>
                                Google
                            </Button>
                        </Box>
                    </Modal>
                )}

            </div>
        </div>
    )
}

export default RegisterPage