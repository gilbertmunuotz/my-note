// import { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';


function OTPPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = new URLSearchParams(location.search).get('email');
    console.log(email);


    // const [otp, setOtp] = useState<number>();

    return (
        <div>
            <div className="flex justify-center items-center min-h-screen">
                <div className="p-8 rounded-lg shadow-lg max-w-sm w-full">
                    <Typography variant="h5" className="text-center mb-6" style={{ color: '#1e3a8a' }}>
                        Enter OTP
                    </Typography>
                    <div className="flex justify-between mb-4">
                        <TextField
                            variant="outlined"
                            inputProps={{
                                maxLength: 1,
                                style: { textAlign: 'center' },
                            }}
                            style={{
                                width: '3rem',
                                height: '3rem',
                                fontSize: '1.5rem',
                                borderColor: '#1e3a8a',
                            }}
                        />
                    </div>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ backgroundColor: '#1e3a8a' }}
                    >
                        Verify OTP
                    </Button>
                </div>
            </div>
        </div>
    )
}


export default OTPPage;