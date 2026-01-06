import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function AppointmentChart({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-soft p-6 h-[320px] flex flex-col">
      <div className="text-sm text-gray-600 mb-4 font-medium italic underline underline-offset-4">Upcoming Appointments (Next 7 Days)</div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const d = new Date(value);
                return `${d.getDate()}/${d.getMonth() + 1}`;
              }}
            />
            <YAxis width={40} tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#0077B6"
              strokeWidth={3}
              dot={{ r: 4, fill: '#0077B6', strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
