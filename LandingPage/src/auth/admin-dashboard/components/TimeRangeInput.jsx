import React, { useState } from 'react'
import TimePicker from './TimePicker'

export default function TimeRangeInput({ value, onChange, label = "Availability Schedule" }) {
    const [showStartPicker, setShowStartPicker] = useState(false)
    const [showEndPicker, setShowEndPicker] = useState(false)
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')

    // Parse existing value on mount
    React.useEffect(() => {
        if (value && value.includes('-')) {
            const [start, end] = value.split('-')
            setStartTime(start.trim())
            setEndTime(end.trim())
        }
    }, [value])

    const handleStartTimeSelect = (time) => {
        setStartTime(time)
        updateValue(time, endTime)
    }

    const handleEndTimeSelect = (time) => {
        setEndTime(time)
        updateValue(startTime, time)
    }

    const updateValue = (start, end) => {
        if (start && end) {
            onChange(`${start}-${end}`)
        } else if (start) {
            onChange(start)
        } else if (end) {
            onChange(end)
        } else {
            onChange('')
        }
    }

    const formatDisplayTime = (time) => {
        if (!time) return 'Select Time'
        return time
    }

    return (
        <div>
            <label className="block text-sm text-gray-600 mb-2">{label}</label>
            <div className="flex gap-4 items-center">
                {/* Start Time */}
                <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                    <button
                        type="button"
                        onClick={() => setShowStartPicker(true)}
                        className="w-full px-3 py-2 border rounded-lg bg-blue-50 text-left focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-blue-100"
                    >
                        {formatDisplayTime(startTime)}
                    </button>
                </div>

                <div className="text-gray-400 mt-5">—</div>

                {/* End Time */}
                <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">End Time</label>
                    <button
                        type="button"
                        onClick={() => setShowEndPicker(true)}
                        className="w-full px-3 py-2 border rounded-lg bg-blue-50 text-left focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-blue-100"
                    >
                        {formatDisplayTime(endTime)}
                    </button>
                </div>
            </div>

            {/* Display combined value */}
            {startTime && endTime && (
                <div className="mt-2 text-sm text-gray-600">
                    Schedule: <span className="font-semibold text-blue-600">{startTime}-{endTime}</span>
                </div>
            )}

            {/* Time Pickers */}
            <TimePicker
                isOpen={showStartPicker}
                onClose={() => setShowStartPicker(false)}
                onSelect={handleStartTimeSelect}
                initialTime={startTime}
            />
            <TimePicker
                isOpen={showEndPicker}
                onClose={() => setShowEndPicker(false)}
                onSelect={handleEndTimeSelect}
                initialTime={endTime}
            />
        </div>
    )
}
