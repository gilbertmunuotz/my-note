import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { user } from '../assets/authSlice';
import { useState, useEffect } from 'react';
import Skeleton from '@mui/material/Skeleton';
import { AuthResponse } from '../Interfaces/Interfaces';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SwipeLeftAltIcon from '@mui/icons-material/SwipeLeftAlt';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';

function ProfilePage() {

  // State to track if the image is loaded
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);
  const userInfo = useSelector(user) as AuthResponse;  // Extract user infomation
  const username = userInfo?.user?.name;  // Access name property correctly


  // Simulate loading state
  useEffect(() => {
    // Simulate image loading
    const timer = setTimeout(() => {
      setImageLoaded(true)
    }, 5 * 1000); // Delay of 5 Seconds
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="mx-4 font-serif sm:mx-10 mt-5 p-4">
      <div className="block sm:flex justify-between items-center">
        <Tooltip title="Home">
          <Link to={"/home"}> <SwipeLeftAltIcon sx={{ fontSize: 45, color: '#1565c0' }} /></Link>
        </Tooltip>
        <h1 className="text-2xl font-semibold text-center sm:text-left">Welcome {username}</h1>
      </div>

      <hr className='my-3 border-y border-gray-400' />

      <div className="flex flex-col items-center sm:flex-row sm:justify-center">
        {/* Image */}
        <div className="w-full sm:w-1/4 p-4 flex justify-center">
          <div className="w-full max-w-xs">
            <div className="flex justify-between">
              <div className="">
                {imageLoaded ? (
                  <img src="" alt="Tap Camera Icon to Add Photo" style={{ width: '250px', height: '250px', objectFit: 'cover' }} // Ensure it fits within the specified dimensions
                  />
                ) : (
                  <Skeleton variant="circular" animation="wave" height={250} width={250} />
                )}
              </div>
              <div className="">
                <Tooltip title="Edit Picture">
                  <PhotoCameraIcon />
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="w-full sm:w-3/4 p-4 flex justify-center">
          <div className="w-full max-w-md">

            <form>
              <div className="my-3">
                <label htmlFor="name" className="block text-lg font-semibold text-gray-900">Username;</label>
                <input
                  required
                  type="text"
                  id="name"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="my-3">
                <label htmlFor="email" className="block text-lg font-semibold text-gray-900">Email;</label>
                <input
                  required
                  type="email"
                  id="email"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="my-3">
                <label htmlFor="password" className="block text-lg font-semibold text-gray-900">Password;</label>
                <TextField
                  required
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (<InputAdornment position='end'>
                      <IconButton onClick={handleTogglePasswordVisibility} edge='end'>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>)
                  }}
                  className="block w-full px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end mt-4">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage;