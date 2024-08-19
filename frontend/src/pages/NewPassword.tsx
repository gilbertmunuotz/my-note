import { useState } from "react";
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { ResetPass } from '../Interfaces/Interfaces';
import { useNavigate, useLocation } from 'react-router-dom';
import { useResetPasswordMutation } from '../api/userAPISlice';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, IconButton, InputAdornment, Modal, TextField, Typography } from "@mui/material";

function PasswordReset() {
    // Custom Hooks
    const navigate = useNavigate();
    const location = useLocation();

    //Modal States
    const [open, setOpen] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);


    // Destructure Email from URL
    const email = new URLSearchParams(location.search).get('email') || '';

    // Reset Password Hook
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    // Form state Hook
    const [password, setPassword] = useState('');


    const handleResetPassword = async () => {

        // Basic validation
        if (!password) {
            toast.error("Field is Mandatory");
            return;
        }
        const userInfo: ResetPass = { email, password };

        try {
            await resetPassword(userInfo).unwrap();
            toast.success("Password reset successful!");
            navigate('/');
        } catch (error) {
            toast.error("Error resetting password.");
            console.error("Error Occured", error);
        }
    };

    return (
        <div onClick={handleOpen}>
            {isLoading ? (
                <Spinner loading={isLoading} />
            ) : (
                <Modal open={open} onClose={handleClose} aria-labelledby="resetpassword-modal-title">
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '1px solid #000', p: 4 }}>
                        <Typography sx={{ textAlign: 'center', fontSize: '1.5rem' }}>Reset Password</Typography>
                        <TextField
                            required
                            fullWidth
                            value={password}
                            label="Enter New Password"
                            type={showPassword ? 'text' : 'password'}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (<InputAdornment position='end'>
                                    <IconButton onClick={handleTogglePasswordVisibility} edge='end'>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>)
                            }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button onClick={handleResetPassword} variant="contained">
                                Reset Password
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            )}
        </div>
    );
}

export default PasswordReset;