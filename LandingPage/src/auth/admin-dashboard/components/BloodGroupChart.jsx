import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#FF6B6B'];

export default function BloodGroupChart({ data }) {
    return (
        <div className="bg-white rounded-xl shadow-soft p-4 h-[320px] flex flex-col">
            <div className="text-sm text-gray-600 mb-2 font-medium italic underline underline-offset-4">Patient Blood Group Distribution</div>
            {data.length > 0 ? (
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                nameKey="type"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend layout="vertical" verticalAlign="middle" align="right" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                    No blood group data available
                </div>
            )}
        </div>
    )
}
