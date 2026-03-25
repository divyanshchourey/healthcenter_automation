import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Phone, Award, CheckCircle2, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { getLabCenterById } from '../../services/apiService';
import API_BASE_URL from '../../config/apiConfig';

const Profile = ({ user }) => {
    const [labData, setLabData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLabData = async () => {
            if (!user?.userId) {
                setError('User session invalid. Please log in again.');
                setLoading(false);
                return;
            }

            const token = localStorage.getItem('access_token');
            if (!token) {
                setError('No authentication token found. Please log in again.');
                setLoading(false);
                return;
            }

            try {
                // 1. Fetch list of all labs (returns LabID but NOT OwnerUserID)
                const res = await fetch(`${API_BASE_URL}/admin/labcenters`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    setError(`Could not fetch lab centers (status ${res.status}).`);
                    setLoading(false);
                    return;
                }

                const allLabsData = await res.json();
                const allLabs = Array.isArray(allLabsData) ? allLabsData : (allLabsData?.data || []);

                if (allLabs.length === 0) {
                    setError('No lab centers found in the system.');
                    setLoading(false);
                    return;
                }

                // 2. The list endpoint doesn't include OwnerUserID, so fetch each lab individually
                console.log(`Checking ${allLabs.length} labs for OwnerUserID=${user.userId}...`);
                let myLab = null;
                for (const lab of allLabs) {
                    const labId = lab.LabID || lab.id;
                    if (!labId) continue;
                    const details = await getLabCenterById(labId);
                    console.log(`  Lab ${labId}: OwnerUserID=${details?.OwnerUserID}`);
                    if (details && String(details.OwnerUserID) === String(user.userId)) {
                        myLab = details;
                        break;
                    }
                }

                if (!myLab) {
                    setError(`No lab center found for your account (UserID: ${user.userId}). Please contact your administrator.`);
                    setLoading(false);
                    return;
                }

                // Store LabID for other pages (Tests Booked, etc.)
                localStorage.setItem('lab_id', myLab.LabID);
                setLabData(myLab);
            } catch (err) {
                console.error("Error fetching lab profile:", err);
                setError(`Failed to fetch lab center data: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchLabData();
    }, [user]);

    const InfoCard = ({ icon: Icon, label, value, color = "blue" }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 transition-all hover:shadow-md">
            <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-600`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{value || 'N/A'}</p>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-blue-600">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="text-lg font-medium text-gray-600">Loading your profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-600">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p className="text-lg font-medium">{error}</p>
            </div>
        );
    }

    if (!labData) return null;

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                                <Building2 className="w-12 h-12 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">{labData.Name}</h1>
                                <div className="flex items-center gap-2 mt-2 text-blue-100">
                                    <CheckCircle2 className={`w-4 h-4 ${labData.ApprovedByAdmin ? 'text-green-400 fill-green-400/20' : 'text-yellow-400 fill-yellow-400/20'}`} />
                                    <span className="text-sm font-medium">
                                        {labData.ApprovedByAdmin ? 'Verified & Approved Lab Center' : 'Pending Admin Approval'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20">
                            <p className="text-xs text-blue-100 uppercase font-bold tracking-widest mb-1">Status</p>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold border ${labData.ApprovedByAdmin ? 'bg-green-400/20 text-green-400 border-green-400/30' : 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30'}`}>
                                {labData.ApprovedByAdmin ? 'ACTIVE' : 'PENDING'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InfoCard icon={Building2} label="Lab ID" value={labData.LabID} />
                        <InfoCard icon={Award} label="Accreditation No." value={labData.AccreditationNumber} color="purple" />
                        <InfoCard icon={Phone} label="Contact Number" value={labData.Contact} color="green" />
                        <InfoCard icon={MapPin} label="Office Address" value={labData.Address} color="orange" />
                        {labData.CreatedAt && (
                            <InfoCard icon={Calendar} label="Registered On" value={new Date(labData.CreatedAt).toLocaleDateString()} color="indigo" />
                        )}
                        <div className={`p-6 rounded-xl border flex items-center justify-between ${labData.ApprovedByAdmin ? 'bg-blue-50 border-blue-100' : 'bg-yellow-50 border-yellow-100'}`}>
                            <div>
                                <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${labData.ApprovedByAdmin ? 'text-blue-800' : 'text-yellow-800'}`}>Admin Approval</p>
                                <p className={`font-medium ${labData.ApprovedByAdmin ? 'text-blue-600' : 'text-yellow-600'}`}>
                                    {labData.ApprovedByAdmin ? 'Approved by Health System Admin' : 'Awaiting confirmation'}
                                </p>
                            </div>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg ${labData.ApprovedByAdmin ? 'bg-blue-600 shadow-blue-200' : 'bg-yellow-500 shadow-yellow-200'}`}>
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

