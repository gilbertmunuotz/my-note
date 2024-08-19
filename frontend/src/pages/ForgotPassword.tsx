import mynote from '/mail.jpg';
import { toast } from 'react-toastify';
import React, { useState } from "react";
import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router-dom';
import MailIcon from '@mui/icons-material/Mail';
import { GetOTP } from '../Interfaces/Interfaces';
import { useGetOTPMutation } from '../api/userAPISlice';
import { Box, Button, Modal, InputAdornment, TextField, Typography } from "@mui/material";

function ForgotPassword() {
    const navigate = useNavigate();
    const [getOTP, { isLoading }] = useGetOTPMutation();

    // Form Email State
    const [email, setEmail] = useState('');

    // Modal States
    const [open, setOpen] = useState(true);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Generate OTP
    async function handleGetOTP(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Basic validation
        if (!email) {
            toast.error("Please fill all required fields.");
            return;
        }
        const info: GetOTP = { email };

        try {
            await getOTP(info).unwrap();
            toast.success("OTP Sent Successfully!");
            setEmail('');
            navigate(`/otp-verify?email=${encodeURIComponent(email)}`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error Generating OTP", error);
            if (error?.data?.message) {
                toast.error(error.data.message);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        }
    }

    return (
        <div onClick={handleOpen}>
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                {isLoading ? (
                    <Spinner loading={isLoading} />
                ) : (
                    <Modal open={open} onClose={handleClose} aria-labelledby="forgot-password-modal-title">
                        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '1px solid #000', p: 4 }}>
                            <img
                                src={mynote}
                                alt="Reset Password"
                                className="rounded-full mb-4 shadow-md mx-auto" style={{ width: '250px', height: '250px', objectFit: 'cover' }} />

                            <form onSubmit={handleGetOTP}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Enter Email"
                                    value={email}
                                    margin="normal"
                                    onChange={(event) => setEmail(event.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <MailIcon />
                                            </InputAdornment>
                                        ),
                                    }} />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={isLoading}>Submit</Button>

                                <Typography id="forgot-password-modal-title" variant="h6" component="h2" sx={{ marginTop: '0.5rem', fontSize: '1rem', textAlign: 'center' }}>
                                    An OTP will be Sent to Your Email.
                                </Typography>
                            </form>

                        </Box>
                    </Modal>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;