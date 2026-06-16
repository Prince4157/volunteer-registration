import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const AdminDashboard = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const fetchVolunteers = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/volunteers`);
            setVolunteers(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch volunteers.');
            setLoading(false);
        }
    };

    const handleExport = () => {
        window.location.href = `${API_BASE_URL}/api/reports/volunteers`;
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard - Volunteers</h2>
                <button
                    onClick={handleExport}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Export to CSV
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interests</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {volunteers.map((v) => (
                            <tr key={v.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{v.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.phone || 'N/A'}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{v.interests || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(v.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {volunteers.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No volunteers found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
