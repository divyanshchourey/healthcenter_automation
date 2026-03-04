import React, { useState, useRef, useEffect } from 'react'

export default function TimePicker({ isOpen, onClose, onSelect, initialTime = null }) {
    const [selectedHour, setSelectedHour] = useState('03')
    const [selectedMinute, setSelectedMinute] = useState('30')
    const [selectedPeriod, setSelectedPeriod] = useState('PM')

    const hourRef = useRef(null)
    const minuteRef = useRef(null)

    const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
    const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']

    useEffect(() => {
        if (initialTime) {
            const match = initialTime.match(/(\d{1,2}):(\d{2})(AM|PM)/)
            if (match) {
                setSelectedHour(match[1].padStart(2, '0'))
                setSelectedMinute(match[2])
                setSelectedPeriod(match[3])
            }
        }
    }, [initialTime])

    useEffect(() => {
        if (isOpen && hourRef.current) {
            const hourIndex = hours.indexOf(selectedHour)
            hourRef.current.scrollTop = hourIndex * 40
        }
        if (isOpen && minuteRef.current) {
            const minuteIndex = minutes.indexOf(selectedMinute)
            minuteRef.current.scrollTop = minuteIndex * 40
        }
    }, [isOpen])

    const handleScroll = (ref, items, setter) => {
        const scrollTop = ref.current.scrollTop
        const index = Math.round(scrollTop / 40)
        const clampedIndex = Math.max(0, Math.min(index, items.length - 1))
        setter(items[clampedIndex])
    }

    const handleOk = () => {
        const timeString = `${selectedHour}:${selectedMinute}${selectedPeriod}`
        onSelect(timeString)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-96">
                <div className="flex justify-center items-center gap-4 mb-6">
                    {/* Hour Selector */}
                    <div className="flex flex-col items-center">
                        <div
                            ref={hourRef}
                            className="h-48 w-24 overflow-y-scroll scrollbar-hide relative"
                            onScroll={() => handleScroll(hourRef, hours, setSelectedHour)}
                            style={{ scrollSnapType: 'y mandatory' }}
                        >
                            <div className="h-20"></div>
                            {hours.map((hour) => (
                                <div
                                    key={hour}
                                    className={`h-10 flex items-center justify-center text-lg cursor-pointer ${hour === selectedHour
                                            ? 'bg-blue-600 text-white font-semibold'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    style={{ scrollSnapAlign: 'center' }}
                                    onClick={() => {
                                        setSelectedHour(hour)
                                        const index = hours.indexOf(hour)
                                        hourRef.current.scrollTop = index * 40
                                    }}
                                >
                                    {hour}
                                </div>
                            ))}
                            <div className="h-20"></div>
                        </div>
                    </div>

                    <div className="text-2xl font-bold text-gray-400">:</div>

                    {/* Minute Selector */}
                    <div className="flex flex-col items-center">
                        <div
                            ref={minuteRef}
                            className="h-48 w-24 overflow-y-scroll scrollbar-hide relative"
                            onScroll={() => handleScroll(minuteRef, minutes, setSelectedMinute)}
                            style={{ scrollSnapType: 'y mandatory' }}
                        >
                            <div className="h-20"></div>
                            {minutes.map((minute) => (
                                <div
                                    key={minute}
                                    className={`h-10 flex items-center justify-center text-lg cursor-pointer ${minute === selectedMinute
                                            ? 'bg-blue-600 text-white font-semibold'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    style={{ scrollSnapAlign: 'center' }}
                                    onClick={() => {
                                        setSelectedMinute(minute)
                                        const index = minutes.indexOf(minute)
                                        minuteRef.current.scrollTop = index * 40
                                    }}
                                >
                                    {minute}
                                </div>
                            ))}
                            <div className="h-20"></div>
                        </div>
                    </div>

                    {/* AM/PM Selector */}
                    <div className="flex flex-col gap-2">
                        <button
                            type="button"
                            className={`px-6 py-2 rounded font-semibold ${selectedPeriod === 'AM'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            onClick={() => setSelectedPeriod('AM')}
                        >
                            AM
                        </button>
                        <button
                            type="button"
                            className={`px-6 py-2 rounded font-semibold ${selectedPeriod === 'PM'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            onClick={() => setSelectedPeriod('PM')}
                        >
                            PM
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded"
                    >
                        CANCEL
                    </button>
                    <button
                        type="button"
                        onClick={handleOk}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 rounded"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    )
}
