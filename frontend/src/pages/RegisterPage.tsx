import { toast } from 'react-toastify';
import React, { useState } from 'react';
import Spinner from '../components/Spinner';
import { Link, useNavigate } from 'react-router-dom';
import { Credentials } from '../Interfaces/Interfaces';
import { useRegisterMutation } from '../api/userAPISlice';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, Modal, Box, Typography, TextField, InputAdornment, IconButton } from '@mui/material';

function RegisterPage() {

    const navigate = useNavigate();
    const [register, { isLoading }] = useRegisterMutation();

    //Modal States
    const [open, setOpen] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);

    //Form Register States
    const [name, setUsername] = useState<string>('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    // Passport Local Register
    async function handleRegister(event: React.FormEvent) {

        event.preventDefault();

        // Basic validation
        if (!name || !email || !password) {
            toast.error("Please fill all required fields.");
            return;
        }

        const credentials: Credentials = { name, email, password };

        try {
            await register(credentials).unwrap();
            toast.success("Login To Continue");
            navigate("/login")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error Registering", error);
            if (error?.data.message) {
                toast.error(error?.data.message);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        }
    }

    return (
        <div>
            <div onClick={handleOpen}>
                {isLoading ? (
                    <Spinner loading={isLoading} />
                ) : (
                    <Modal open={open} onClose={handleClose} aria-labelledby="sign-in-modal-title">
                        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '1px solid #000', p: 4 }}>
                            <Typography id="sign-in-modal-title" variant="h6" component="h2" className='text-center'>
                                Sign Up To Continue.
                            </Typography>


                            <TextField
                                fullWidth
                                label="username"
                                margin="normal"
                                value={name}
                                required
                                onChange={(event) => setUsername(event.target.value)}
                            />


                            <TextField
                                fullWidth
                                label="email"
                                margin="normal"
                                type='email'
                                value={email}
                                required
                                onChange={(event) => setEmail(event.target.value)}
                            />


                            <TextField
                                fullWidth
                                required
                                label="password"
                                margin="normal"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (<InputAdornment position='end'>
                                        <IconButton onClick={handleTogglePasswordVisibility} edge='end'>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>)
                                }}
                            />
                            <Button onClick={handleRegister} variant="contained" color="primary" fullWidth sx={{ mt: 2, borderRadius: '50px' }}>
                                Sign Up
                            </Button>

                            <hr className='my-3 border-y- border-black' />

                            <h5 className='ml-2 mt-2'>Dont't have an account.? Login <Link to={"/login"} className='text-sky-600'>Here</Link></h5>
                        </Box>
                    </Modal>
                )}
            </div>
        </div>
    )
}

export default RegisterPage;