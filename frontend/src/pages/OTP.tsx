import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { VerifyOTP } from '../Interfaces/Interfaces';
import React, { useState, useRef, useEffect } from 'react';
import { useVerifyOTPMutation } from '../api/userAPISlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, TextField, Typography } from '@mui/material';

function OTPPage() {
    // Custom Hooks
    const navigate = useNavigate();
    const location = useLocation();

    // Refs for each OTP input
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Verify OTP Hook
    const [verifyOTP, { isLoading }] = useVerifyOTPMutation();

    // Destructure Email from URL
    const email = new URLSearchParams(location.search).get('email') || '';

    // OTP state Hook for 6 separate inputs
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);

    // Handle OTP input change
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        index: number
    ) => {
        const value = event.target.value;
        if (/^\d$/.test(value) || value === '') { // Ensure only digits are entered
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Focus next input if a digit was entered and it's not the last input
            if (value !== '' && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    // Focus the first input on initial render
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Verify OTP Logic
    async function handleVerifyOTP(event: React.FormEvent) {
        event.preventDefault();

        // Basic Validation
        if (!otp) {
            toast.error("Please enter the OTP.");
            return;
        }

        // Combine the 6 digits into a single string
        const fullOtp = otp.join('');

        if (fullOtp.length !== 6) {
            toast.error('Please enter a 6-digit OTP.');
            return;
        }

        const user: VerifyOTP = { email, otp: Number(fullOtp) }; // Ensure OTP is a number

        try {
            await verifyOTP(user).unwrap();
            toast.success("User Verified Successfully");
            navigate(`/new-password?email=${encodeURIComponent(email)}`);
        } catch (error) {
            console.log("Error Occurred", error);
            toast.error('Invalid or Expired OTP. Try again.');
        }
    }

    return (
        <>
            {isLoading ? (
                <Spinner loading={isLoading} />
            ) : (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="p-8 rounded-lg shadow-lg max-w-sm w-full">
                        <Typography variant="h5" className="text-center mb-6" style={{ color: '#000000', marginBottom: '0.5rem' }}>
                            Enter OTP
                        </Typography>

                        <form onSubmit={handleVerifyOTP}>

                            <div className="flex justify-between mb-4">
                                {otp.map((digit, index) => (
                                    <TextField
                                        key={index}
                                        id={`otp-${index}`}
                                        variant="outlined"
                                        inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: '1.5rem' }, }}
                                        value={digit}
                                        required
                                        onChange={(event) => handleChange(event, index)}
                                        style={{ width: '3rem', height: '3rem', marginRight: index < 5 ? '0.5rem' : '0', }}
                                        inputRef={el => (inputRefs.current[index] = el)}
                                    />
                                ))}
                            </div>
                            
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                color="primary"
                                style={{ marginTop: '1rem' }}>Verify OTP
                            </Button>
                        </form>

                    </div>
                </div>
            )}
        </>
    )
}

export default OTPPage;