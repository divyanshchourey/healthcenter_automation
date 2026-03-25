import React from 'react'

const Profile = ({ profileData, onProfileChange, onSave }) => {
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onProfileChange('photoUrl', reader.result)
      }
    }
    reader.readAsDataURL(file)

    // Store file object for upload
    onProfileChange('photoFile', file)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
      
      <div className="space-y-8">
        {/* Personal Information Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>

          {/* Profile Photo */}
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center overflow-hidden">
              {profileData.photoUrl ? (
                <img
                  src={profileData.photoUrl}
                  alt="Doctor profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-blue-700">
                  {(profileData?.name || 'Doctor')
                    .split(' ')
                    .filter(Boolean)
                    .map((p) => p[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
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
                Upload a clear headshot. This photo will appear in the sidebar.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => onProfileChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number:</label>
              <input
                type="tel"
                value={profileData.phoneNumber}
                onChange={(e) => onProfileChange('phoneNumber', e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender:</label>
              <select
                value={profileData.gender}
                onChange={(e) => onProfileChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address:</label>
              <textarea
                value={profileData.address}
                onChange={(e) => onProfileChange('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Of Birth:</label>
              <input
                type="date"
                value={profileData.dateOfBirth}
                onChange={(e) => onProfileChange('dateOfBirth', e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Professional Information Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Qualification:</label>
              <select
                value={profileData.qualification}
                onChange={(e) => onProfileChange('qualification', e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Qualification</option>
                <option value="MBBS">MBBS</option>
                <option value="MD">MD</option>
                <option value="MS">MS</option>
                <option value="DM">DM</option>
                <option value="MCh">MCh</option>
                <option value="DNB">DNB</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization:</label>
              <input
                type="text"
                value={profileData.specialization}
                onChange={(e) => onProfileChange('specialization', e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your specialization"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number:</label>
              <input
                type="text"
                value={profileData.registrationNumber}
                onChange={(e) => onProfileChange('registrationNumber', e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter registration number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years Experience:</label>
              <input
                type="number"
                value={profileData.yearsExperience}
                onChange={(e) => onProfileChange('yearsExperience', e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter years of experience"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Address:</label>
              <textarea
                value={profileData.clinicAddress}
                onChange={(e) => onProfileChange('clinicAddress', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter clinic address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability Schedule:</label>
              <input
                type="text"
                value={profileData.availabilitySchedule}
                onChange={(e) => onProfileChange('availabilitySchedule', e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Mon-Fri 9AM-5PM"
              />
            </div>
          </div>
        </div>

        {/* Financial Information Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number:</label>
              <input
                type="text"
                value={profileData.aadharNumber}
                onChange={(e) => onProfileChange('aadharNumber', e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Aadhar number"
                maxLength={12}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number:</label>
              <input
                type="text"
                value={profileData.panNumber}
                onChange={(e) => onProfileChange('panNumber', e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter PAN number"
                maxLength={10}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Number:</label>
              <input
                type="text"
                value={profileData.accountNumber}
                onChange={(e) => onProfileChange('accountNumber', e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter account number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code:</label>
              <input
                type="text"
                value={profileData.IFSCCode}
                onChange={(e) => onProfileChange('IFSCCode', e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter IFSC Code"
                maxLength={12}
              />
            </div>

          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            onClick={onSave}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile