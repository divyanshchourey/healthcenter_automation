import React from "react";

export default function RoleSelection() {
	return (
		<div className="min-h-[40vh] flex items-center justify-center bg-gray-50">
			<div className="bg-white shadow rounded-lg p-6 w-full max-w-md">
				<h2 className="text-xl font-semibold mb-4">Select your role</h2>
				<div className="grid grid-cols-1 gap-3">
					<a href="#admin" className="px-4 py-2 rounded border text-center hover:bg-gray-50">Admin</a>
					<a href="#doctor" className="px-4 py-2 rounded border text-center hover:bg-gray-50">Doctor</a>
					<a href="#staff" className="px-4 py-2 rounded border text-center hover:bg-gray-50">Staff</a>
				</div>
			</div>
		</div>
	);
}



