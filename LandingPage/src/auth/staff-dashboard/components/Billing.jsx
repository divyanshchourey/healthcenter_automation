import React, { useState } from 'react';

const initialBills = [
  {
    id: 'BILL-001',
    patientName: 'Rahul Sharma',
    doctorName: 'Dr. John Smith',
    service: 'Consultation + ECG',
    amount: 1200,
    method: 'UPI',
    date: '2026-03-01',
    status: 'Pending',
  },
  {
    id: 'BILL-002',
    patientName: 'Anita Verma',
    doctorName: 'Dr. Priya Rao',
    service: 'Lab tests (CBC + LFT)',
    amount: 1800,
    method: 'Cash',
    date: '2026-03-02',
    status: 'Paid',
  },
  {
    id: 'BILL-003',
    patientName: 'Sanjay Patel',
    doctorName: 'Dr. Amit Gupta',
    service: 'X-Ray Chest',
    amount: 950,
    method: 'Card',
    date: '2026-02-28',
    status: 'Pending',
  },
];

const statusClasses = (status) => {
  switch (status) {
    case 'Paid':
      return 'bg-green-100 text-green-700';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const Billing = () => {
  const [bills, setBills] = useState(initialBills);

  const handleStatusChange = (id, newStatus) => {
    setBills((prev) =>
      prev.map((bill) =>
        bill.id === id ? { ...bill, status: newStatus } : bill
      )
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-blue-700">
            Patient Billing
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            View mock billing records for patients and update payment status
            after collecting payment.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-700 text-sm font-semibold">
                Bill ID
              </th>
              <th className="text-left py-3 px-4 text-gray-700 text-sm font-semibold">
                Patient
              </th>
              <th className="text-left py-3 px-4 text-gray-700 text-sm font-semibold">
                Doctor
              </th>
              <th className="text-left py-3 px-4 text-gray-700 text-sm font-semibold">
                Service
              </th>
              <th className="text-left py-3 px-4 text-gray-700 text-sm font-semibold">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-gray-700 text-sm font-semibold">
                Method
              </th>
              <th className="text-left py-3 px-4 text-gray-700 text-sm font-semibold">
                Date
              </th>
              <th className="text-left py-3 px-4 text-gray-700 text-sm font-semibold">
                Status
              </th>
              <th className="text-left py-3 px-4 text-gray-700 text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr
                key={bill.id}
                className="border-b border-gray-100 hover:bg-blue-50/40 transition-colors"
              >
                <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                  {bill.id}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {bill.patientName}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {bill.doctorName}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {bill.service}
                </td>
                <td className="py-3 px-4 text-sm font-semibold text-blue-700">
                  ₹{bill.amount.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {bill.method}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {new Date(bill.date).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses(
                      bill.status
                    )}`}
                  >
                    {bill.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={bill.status}
                    onChange={(e) => handleStatusChange(bill.id, e.target.value)}
                    className="text-xs px-2 py-1 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Billing;

