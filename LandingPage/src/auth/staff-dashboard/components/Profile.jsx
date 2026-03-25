import React, { useState, useEffect } from 'react';
import { getUser, getEmployeeProfile, getEmployeeProfileImage, uploadEmployeeProfileImage, createOrUpdateStaffProfile } from '../../services/apiService';

const Profile = ({ user }) => {
  const [formData, setFormData] = useState({
    photoUrl: '',
    photoFile: null,
    name: '',
    email: '',
    gender: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    joinDate: '',
    role: '',
    department: '',
    aadharNumber: '',
    panNumber: '',
    accountNumber: '',
    ifscCode: ''
  });
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.userId) return;
      try {
        setIsLoading(true);
        // Fetch personal details from User table
        const userDetails = await getUser(user.userId);
        
        // Fetch professional and financial details from Employees table
        let employeeProfile = null;
        try {
          employeeProfile = await getEmployeeProfile(user.userId);
        } catch (error) {
          console.log('Employee profile not found, will be created on save:', error);
        }

        // Fetch profile image from backend
        let fetchedPhotoUrl = '';
        try {
          const imageRes = await getEmployeeProfileImage();
          if (imageRes?.DownloadURL) {
            fetchedPhotoUrl = imageRes.DownloadURL;
          }
        } catch (error) {
          console.log('Failed to fetch profile image:', error);
        }
        
        const formatDateForInput = (value) => {
          if (!value) return '';
          try {
            const iso = typeof value === 'string' ? value : new Date(value).toISOString();
            return iso.slice(0, 10);
          } catch {
            return '';
          }
        };

        setFormData((prev) => ({
          ...prev,
          // Personal information from User table
          name: `${userDetails?.FirstName || ''} ${userDetails?.LastName || ''}`.trim() || '',
          email: userDetails?.Email || user?.email || '',
          phoneNumber: userDetails?.Phone || '',
          gender: userDetails?.Gender || '',
          address: userDetails?.Address || '',
          dateOfBirth: formatDateForInput(userDetails?.DOB),
          photoUrl: fetchedPhotoUrl || prev.photoUrl || '',
          // Professional information from Employees table
          department: employeeProfile?.Division || '',
          joinDate: formatDateForInput(employeeProfile?.JoinDate),
          role: employeeProfile?.Designation || '',
          // Financial information from Employees table
          aadharNumber: employeeProfile?.AadharNumber || '',
          panNumber: employeeProfile?.PANNumber || '',
          accountNumber: employeeProfile?.AccountNumber || '',
          ifscCode: employeeProfile?.IFSCCode || '',
        }));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user?.userId) return;

    try {
      setIsLoading(true);
      let finalPhotoUrl = formData.photoUrl;

      // 1. Handle image upload if a new file was selected
      if (formData.photoFile) {
        try {
          console.log('Uploading staff profile image...');
          const uploadRes = await uploadEmployeeProfileImage(formData.photoFile);
          if (uploadRes?.DownloadURL) {
            finalPhotoUrl = uploadRes.DownloadURL;
            setFormData(prev => ({ ...prev, photoUrl: finalPhotoUrl, photoFile: null }));
            if (onPhotoUpdate) onPhotoUpdate(finalPhotoUrl);
          }
        } catch (error) {
          console.error('Failed to upload profile image:', error);
          alert('Failed to upload profile image. Details will be saved without the new photo.');
        }
      }

      // 2. Save professional and financial details
      const payload = {
        EmployeeID: Number(user.userId),
        Division: formData.department || '',
        Designation: formData.role || '',
        JoinDate: formData.joinDate || null,
        AadharNumber: formData.aadharNumber || '',
        PANNumber: formData.panNumber || '',
        AccountNumber: formData.accountNumber || '',
        IFSCCode: formData.ifscCode || ''
      };

      console.log('Saving staff profile:', payload);
      await createOrUpdateStaffProfile(user.userId, payload);
      
      setIsSaved(true);
      alert('Profile saved successfully!');
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({
          ...prev,
          photoUrl: reader.result,
          photoFile: file
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const initials = (formData.name || user?.name || 'Staff')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="">
      <div className="bg-white rounded-xl shadow-md p-8">
        <h3 className="text-xl font-semibold text-blue-700 mb-6 border-b pb-3">
          Staff Information
        </h3>

        <form onSubmit={handleSave}>
          {/* Personal Information */}
          <h4 className="text-lg font-semibold mb-3">Personal Information</h4>

          {/* Profile Photo */}
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center overflow-hidden">
              {formData.photoUrl ? (
                <img
                  src={formData.photoUrl}
                  alt="Staff profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-blue-700">
                  {initials}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Profile Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="block text-sm text-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />
              <p className="text-xs text-gray-500">
                Upload a clear headshot. This photo will appear in the staff sidebar.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm text-gray-500">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500">Email</label>
              <p className="mt-1 text-gray-800 font-medium p-3 rounded-lg bg-blue-50">
                {formData.email || user?.email || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-500">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-500">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                placeholder="Enter address"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500">Date Of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500">Join Date</label>
              <input
                type="date"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Professional Information */}
          <h4 className="text-lg font-semibold mb-3">Professional Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm text-gray-500">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Role</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-500">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Department name"
              />
            </div>
          </div>

          {/* Financial Information */}
          <h4 className="text-lg font-semibold mb-3">Financial Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm text-gray-500">Aadhar Number</label>
              <input
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="xxxx-xxxx-xxxx"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500">PAN Number</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="ABCDE1234F"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter account number"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500">IFSC Code</label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="SBIN0001234"
              />
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4 justify-end">
            <button
              type="button"
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Save
            </button>
            {isSaved && (
              <span className="text-green-600 font-medium">
                ✓ Profile saved successfully!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

