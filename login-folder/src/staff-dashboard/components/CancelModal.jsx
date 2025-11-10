import React from 'react';

const CancelModal = ({ patient, onCancel, onGoBack }) => {
  if (!patient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Want to cancel Appointment of {patient.name}?
        </h2>
        
        <div className="flex gap-4 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Cancel Appointment
          </button>
          <button
            onClick={onGoBack}
            className="flex-1 bg-blue-700 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;

