import mynote from '/mynote.png';
import { toast } from 'react-toastify';
import React, { useState } from "react";
import Spinner from '../components/Spinner';
import { useGetOTPMutation } from '../api/userAPISlice';
import { Box, Button, TextField, Typography } from "@mui/material";

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [getOTP, { isLoading }] = useGetOTPMutation();

    // Generate OTP
    async function handleGetOTP(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Basic validation
        if (!email) {
            toast.error("Please fill all required fields.");
            return;
        }

        try {
            await getOTP(email).unwrap();
            toast.success("OTP Generated Succesfully");
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
        <div>
            {isLoading ? (
                <Spinner loading={isLoading} /> // Ensure Spinner component accepts 'loading' prop
            ) : (
                <div className="flex flex-col items-center sm:flex-row sm:justify-center p-3">
                    <div className="w-full sm:w-1/5 p-4 flex justify-center">
                        <div className="w-full h-full max-w-xs">
                            <img
                                src={mynote}
                                alt="Reset Password Image"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                    <div className="w-full sm:w-3/4 p-4 flex justify-center">
                        <form onSubmit={handleGetOTP}>
                            <Box sx={{ padding: '2em' }}>
                                <h1 className="text-xl mb-4">Verify Your Identity</h1>
                                <p className="text-3xl font-semibold text-blue-500 mb-14 font-serif">My Note</p>
                                <p className="font-serif text-xl">
                                    We Need to Verify your identity Before Password Resetting.
                                </p>

                                <TextField
                                    fullWidth
                                    required
                                    label="Enter Email"
                                    value={email}
                                    margin="normal"
                                    sx={{ borderRadius: '1em' }}
                                    onChange={(event) => setEmail(event.target.value)}
                                />

                                <Button
                                    type="submit" // Ensure button submits the form
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2, mb: 1, borderRadius: '1em' }}
                                    disabled={isLoading}
                                >Submit
                                </Button>

                                <Typography
                                    variant="h6"
                                    component="h2"
                                    sx={{ fontFamily: 'serif', fontStyle: 'semi-bold' }}
                                >
                                    An OTP will be sent to the above-entered email.
                                </Typography>
                            </Box>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ForgotPassword;
