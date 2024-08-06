import { toast } from "react-toastify";
import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import Spinner from '../components/Spinner';
import { GoogleOriginal } from 'devicons-react';
import { loginSuccess } from "../api/authSlice";
// import { SERVER_API } from '../config/constants';
import { Link, useNavigate } from 'react-router-dom';
import { UserInfo } from '../Interfaces/Interfaces';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useLoginMutation, useGoogleStratergyQuery } from '../api/userAPISlice';
import { Button, Modal, Box, Typography, TextField, InputAdornment, IconButton } from '@mui/material';

function LoginPage() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();
    const { data: user, error, refetch } = useGoogleStratergyQuery();


    //Modal States
    const [open, setOpen] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);


    // Form Login States
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');


    // Passport Local Login
    async function handleLogin(event: React.FormEvent) {
        event.preventDefault();

        // Basic validation
        if (!email || !password) {
            toast.error("Please fill all required fields.")
            return;
        }

        const userInfo: UserInfo = { email, password };

        try {
            const user = await login(userInfo).unwrap();
            dispatch(loginSuccess(user));
            toast.success("Welcome Back");
            navigate("/home");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error Loggin In", error);
            if (error?.data.message) {
                toast.error(error?.data.message);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        }
    }

    // Google OAuth Login
    async function handleGoogleLogin() {
        refetch(); // Trigger the query to fetch the user data
    }

    useEffect(() => {
        if (user) {
            dispatch(loginSuccess(user));
            toast.success("Logged in successfully!");
        }
        if (error) {
            toast.error("Error logging in with Google.");
        }
    }, [user, error, dispatch]);

    return (
        <div onClick={handleOpen}>
            {isLoading ? (
                <Spinner loading={isLoading} />
            ) : (
                <Modal open={open} onClose={handleClose} aria-labelledby="sign-in-modal-title">
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '1px solid #000', p: 4 }}>
                        <Typography id="sign-in-modal-title" variant="h6" component="h2" className='text-center'>
                            Welcome Back.
                        </Typography>


                        <TextField
                            fullWidth
                            required
                            label="email"
                            value={email}
                            margin="normal"
                            onChange={(event) => setEmail(event.target.value)}
                        />


                        <TextField
                            fullWidth
                            required
                            margin="normal"
                            label="password"
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

                        <Button onClick={handleLogin} variant="contained" color="primary" fullWidth sx={{ mt: 2, mb: 1 }}>
                            Login
                        </Button>

                        <hr className='my-3 border-y- border-black' />
                        <p className='text-base font-semibold ml-40 leading-8 mb-1'>Or</p>


                        <Button variant="outlined" fullWidth onClick={handleGoogleLogin}
                            sx={{ borderRadius: '50px', backgroundColor: 'white', color: 'black', fontSize: '14px', ":hover": { backgroundColor: 'aliceblue' } }}>
                            <div className="flex gap-3">
                                <GoogleOriginal size="20" />
                                <p>Continue with Google.</p>
                            </div>
                        </Button>

                        <h5 className='font-semibold ml-2 mt-2'>Dont't have an account.? Register <Link to={"/register"} className='text-sky-600'>Here</Link></h5>
                    </Box>
                </Modal>
            )}
        </div>
    )
}

export default LoginPage;