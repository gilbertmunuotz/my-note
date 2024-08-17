import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// import { useResetPasswordMutation } from '../api/userAPISlice';

function PasswordReset() {
    const navigate = useNavigate();

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