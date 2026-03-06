import React, { useState } from 'react';
import { Search, Upload, CheckCircle2, Clock, AlertCircle, Filter } from 'lucide-react';

const TestsBooked = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const tests = [
        {
            id: "T-001",
            patientName: "John Doe",
            doctorName: "Dr. Sarah Wilson",
            testType: "Full Body Checkup",
            status: "Completed",
            billStatus: "Paid",
            date: "2024-03-05"
        },
        {
            id: "T-002",
            patientName: "Emily Brown",
            doctorName: "Dr. James Miller",
            testType: "Blood Glucose Test",
            status: "Pending",
            billStatus: "Pending",
            date: "2024-03-06"
        },
        {
            id: "T-003",
            patientName: "Michael Ross",
            doctorName: "Dr. Sarah Wilson",
            testType: "Lipid Profile",
            status: "In Progress",
            billStatus: "Paid",
            date: "2024-03-06"
        },
        {
            id: "T-004",
            patientName: "Jessica Lee",
            doctorName: "Dr. Robert Chen",
            testType: "Thyroid Profile (T3, T4, TSH)",
            status: "Pending",
            billStatus: "Paid",
            date: "2024-03-07"
        }
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Completed':
                return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> COMPLETED</span>;
            case 'Pending':
                return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> PENDING</span>;
            case 'In Progress':
                return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><AlertCircle className="w-3 h-3" /> IN PROGRESS</span>;
            default:
                return status;
        }
    };

    const getBillStatusBadge = (status) => {
        return status === 'Paid'
            ? <span className="text-green-600 font-bold text-xs uppercase tracking-wider">● Paid</span>
            : <span className="text-red-500 font-bold text-xs uppercase tracking-wider">● Unpaid</span>;
    };

    return (
        <div className="space-y-6">
            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search patient or test name..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium transition-colors">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                        Recent Bookings
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Patient & Doctor</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Test Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Billing</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tests.map((test) => (
                                <tr key={test.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900">{test.patientName}</span>
                                            <span className="text-xs text-gray-500 font-medium italic">{test.doctorName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-gray-800">{test.testType}</span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">ID: {test.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(test.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(test.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getBillStatusBadge(test.billStatus)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors title='Upload Report'">
                                                <Upload className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {tests.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <ClipboardList className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-medium">No test bookings found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestsBooked;
