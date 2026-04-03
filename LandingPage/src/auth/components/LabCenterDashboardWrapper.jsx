import React from 'react';
import LabCenterLayout from '../lab-center-dashboard/layouts/LabCenterLayout.jsx';

const LabCenterDashboardWrapper = ({ user, onLogout, children }) => {
    return (
        <LabCenterLayout user={user} onLogout={onLogout}>
            {children}
        </LabCenterLayout>
    );
};

export default LabCenterDashboardWrapper;
