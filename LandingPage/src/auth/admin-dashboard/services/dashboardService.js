
import { getAllPatients, getAllDoctors, getAllStaff, getEmployeeAppointments, getAllLabCenters } from '../../services/apiService';

// Helper to format date as YYYY-MM-DD
const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

export const fetchDashboardStats = async () => {
    try {
        const [patients, doctors, staff, labCenters] = await Promise.all([
            getAllPatients(),
            getAllDoctors(),
            getAllStaff(),
            getAllLabCenters()
        ]);

        return {
            patients: patients?.length || 0,
            doctors: doctors?.length || 0,
            staff: staff?.length || 0,
            labCenters: (Array.isArray(labCenters) ? labCenters.length : (labCenters?.data?.length || 0)) || 0,
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return { patients: 0, doctors: 0, staff: 0, labCenters: 0 };
    }
};

export const fetchBloodGroupData = async () => {
    try {
        const patients = await getAllPatients();
        const distribution = {};

        patients.forEach(patient => {
            const bg = patient.BloodGroup || 'Unknown';
            distribution[bg] = (distribution[bg] || 0) + 1;
        });

        return Object.entries(distribution).map(([type, value]) => ({
            type,
            value
        }));
    } catch (error) {
        console.error('Error fetching blood group data:', error);
        return [];
    }
};

export const fetchAppointmentTrends = async () => {
    try {
        const today = new Date();
        const dates = [];

        // Upcoming 7 days including today
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const dateStr = formatDate(d);
            dates.push(dateStr);
        }

        // Fetch actual counts for all 7 days
        const counts = await Promise.all(dates.map(async (date) => {
            try {
                const data = await getEmployeeAppointments(date);
                return Array.isArray(data) ? data.length : 0;
            } catch (error) {
                console.error(`Error fetching appointments for ${date}:`, error);
                return 0;
            }
        }));

        return dates.map((date, index) => ({
            date,
            count: counts[index]
        }));
    } catch (error) {
        console.error('Error fetching appointment trends:', error);
        return [];
    }
};

export const fetchTodayAppointments = async () => {
    try {
        const today = formatDate(new Date()); // Use local time date
        const appointments = await getEmployeeAppointments(today);

        // Sort by time (assuming existing appointments have a time field or created_at)
        // If no specific time field, just return as is or sort by ID
        return appointments || [];
    } catch (error) {
        console.error('Error fetching today\'s appointments:', error);
        return [];
    }
};
