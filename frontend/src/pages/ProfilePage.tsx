import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { user } from '../assets/authSlice';
import Spinner from '../components/Spinner';
import Skeleton from '@mui/material/Skeleton';
import React, { useState, useEffect } from 'react';
import { AuthResponse } from '../Interfaces/Interfaces';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SwipeLeftAltIcon from '@mui/icons-material/SwipeLeftAlt';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useGetUserQuery, useUpdateUserMutation } from '../api/userAPISlice';
import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';

function ProfilePage() {

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  // State to track if the image is loaded
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(null); // State for image preview


  // State to Manage password Visibility
  const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);

  const userInfo = useSelector(user) as AuthResponse;   // Extract user information

  const userId = userInfo?.user?._id;   // Extract user ID

  // Use the user ID to fetch user details from the API
  const { data: userDetails } = useGetUserQuery(userId!);
  const username = userDetails?.name;   // Access name property correctly

  // Update User Profile Info State Hook
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  // State to Manage Form Input Fields
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [photo, setPhoto] = useState<File | null>(null);

  //Image Error State
  const [error, setError] = useState<string | null>(null);

  // Simulate loading state
  useEffect(() => {
    // Simulate image loading
    const timer = setTimeout(() => {
      setImageLoaded(true)
    }, 5 * 1000); // Delay of 5 Seconds
    return () => clearTimeout(timer)
  }, [])

  // Pre Populate User Data
  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name || '');
      setEmail(userDetails.email || '');
      // Password field remains empty as per security best practices
      setPreviewImage(userDetails.photo || ''); // Initialize with existing photo URL
    }
  }, [userDetails]);

  // Handle file input change and set preview image
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError('File size exceeds the 10MB limit.');
        setPhoto(null);
        setPreviewImage(null);
        return;
      }

      setPhoto(file);
      // Clear any previous error
      setError(null);

      // Create a preview URL for the image
      const fileURL = URL.createObjectURL(file);
      setPreviewImage(fileURL);
    }
  };

  // Update User Logic
  async function handleUpdate(event: React.FormEvent) {
    event.preventDefault();

    // Create a form data object to store the updated fields
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (password) formData.append('password', password);
    if (photo) formData.append('photo', photo);

    try {
      // Include the user ID in the URL parameters
      await updateUser({ _id: userId, formData });
      toast.success("Profile Updated Successfully");
    } catch (error) {
      toast.error("Error Updating Profile");
      console.error("Error Occurred", error);
    }
  }


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
                  <img src={previewImage} alt="Tap Camera Icon to Add Photo" className='rounded-full' style={{ width: '250px', height: '250px', objectFit: 'cover', lineHeight: 10 }} />
                ) : (
                  <Skeleton variant="circular" animation="wave" height={250} width={250} />
                )}
                {error && <p style={{ color: 'red' }}>{error}</p>}
              </div>
              <div className="">
                <Tooltip title="Edit Picture">
                  <label htmlFor="fileInput">
                    <PhotoCameraIcon style={{ cursor: 'pointer', fontSize: 30 }} />
                  </label>
                </Tooltip>
                <input
                  type="file"
                  id="fileInput"
                  name="photo"
                  style={{ display: 'none' }}
                  onChange={handleFileChange} // Handle file input change
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="w-full sm:w-3/4 p-4 flex justify-center">
          <div className="w-full max-w-md">

            <form onSubmit={handleUpdate}>
              <div className="my-3">
                <label htmlFor="name" className="block text-lg font-semibold text-gray-900">Username</label>
                <input
                  type="text"
                  id="name"
                  onChange={(event) => setName(event.target.value)}
                  value={name}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="my-3">
                <label htmlFor="email" className="block text-lg font-semibold text-gray-900">Email</label>
                <input
                  required
                  type="email"
                  id="email"
                  onChange={(event) => setEmail(event.target.value)}
                  value={email}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="my-3">
                <label htmlFor="password" className="block text-lg font-semibold text-gray-900">Password</label>
                <TextField
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
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <div className="flex justify-end mt-4">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
              </div>

              <Spinner loading={isLoading} />
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage;