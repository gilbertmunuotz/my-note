import { useState } from "react";
import { toast } from 'react-toastify';
import { Box, Button, TextField } from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';
// import { useResetPasswordMutation } from '../api/userAPISlice';

function PasswordReset() {
    // Custom Hooks
    const navigate = useNavigate();
    const location = useLocation();

    // Destructure Email from URL
    const email = new URLSearchParams(location.search).get('email') || '';
    console.log(email);

    const [password, setPassword] = useState('');
    // const [resetPassword] = useResetPasswordMutation();

    const handleResetPassword = async () => {
        try {
            // await resetPassword({ email, otp, newpassword: password }).unwrap();
            toast.success("Password reset successful!");
            navigate('/');
        } catch (error) {
            toast.error("Error resetting password.");
        }
    };

    return (
        <Box>
            <h1>Reset Password</h1>
            <TextField
                label="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                fullWidth
            />
            <Button onClick={handleResetPassword}>Reset Password</Button>
        </Box>
    );
}

export default PasswordReset;