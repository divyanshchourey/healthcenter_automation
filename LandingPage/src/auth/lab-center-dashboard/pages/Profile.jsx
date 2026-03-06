import React from 'react';
import { Building2, MapPin, Phone, Award, CheckCircle2, Calendar } from 'lucide-react';

const Profile = () => {
    // Mock data for the Lab Center
    const labData = {
        LabID: "LAB-2024-001",
        Name: "Apollo Diagnostics Center",
        Address: "123 Healthcare Blvd, Medical District, City - 560001",
        Contact: "+91 98765 43210",
        AccreditationNumber: "NABL-2023-8892",
        ApprovedByAdmin: true,
        CreatedAt: "2024-01-15T10:30:00Z"
    };

    const InfoCard = ({ icon: Icon, label, value, color = "blue" }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 transition-all hover:shadow-md">
            <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-600`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{value}</p>
            </div>
        </div>
    );

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
                                    <CheckCircle2 className="w-4 h-4 text-green-400 fill-green-400/20" />
                                    <span className="text-sm font-medium">Verified & Approved Lab Center</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20">
                            <p className="text-xs text-blue-100 uppercase font-bold tracking-widest mb-1">Status</p>
                            <span className="bg-green-400/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold border border-green-400/30">
                                ACTIVE
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
                        <InfoCard icon={Calendar} label="Registered On" value={new Date(labData.CreatedAt).toLocaleDateString()} color="indigo" />
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-1">Admin Approval</p>
                                <p className="text-blue-600 font-medium">Approved by Health System Admin</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200">
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
