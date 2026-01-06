
export default function TodayAppointmentsTable({ items }) {
    return (
        <div className="bg-white rounded-xl shadow-soft p-4">
            <div className="text-sm text-gray-600 mb-4">Today's Appointments</div>
            {items.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-600 border-b">
                                <th className="py-2 px-2">Time</th>
                                <th className="py-2 px-2">Patient</th>
                                <th className="py-2 px-2">Doctor</th>
                                <th className="py-2 px-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((it) => (
                                <tr key={it.AppointmentID || it.id} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="py-2 px-2 text-gray-700">
                                        {it.AppointmentDate ? new Date(it.AppointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                    </td>
                                    <td className="py-2 px-2 font-medium">
                                        {it.PatientName || `Patient #${it.PatientID}`}
                                    </td>
                                    <td className="py-2 px-2 text-gray-600">
                                        {it.DoctorName || `Doctor #${it.DoctorID}`}
                                    </td>
                                    <td className="py-2 px-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${it.Status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                it.Status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {it.Status || 'Scheduled'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    No appointments scheduled for today.
                </div>
            )}
        </div>
    )
}
