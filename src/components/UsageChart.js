
import React from 'react';

const UsageChart = () => {
    const data = [
        { category: 'Deep Work', minutes: 120, color: 'bg-emerald-500' },
        { category: 'Learning', minutes: 45, color: 'bg-indigo-500' },
        { category: 'Admin/Meta', minutes: 30, color: 'bg-slate-400' },
        { category: 'Distracted', minutes: 60, color: 'bg-rose-500' },
    ];

    const total = data.reduce((acc, curr) => acc + curr.minutes, 0);

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] italic">Consumption Profile</h3>
                <span className="text-[10px] font-bold text-slate-400 italic">LAST 24 HOURS</span>
            </div>

            <div className="space-y-4">
                {data.map((item) => (
                    <div key={item.category} className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            <span>{item.category}</span>
                            <span>{Math.round((item.minutes / total) * 100)}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                            <div
                                className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                                style={{ width: `${(item.minutes / total) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-end">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Active Battle</p>
                    <p className="text-xl font-black text-slate-900 italic italic-bold italic-bold font-black">4h 15m</p>
                </div>
                <div className="text-right space-y-1">
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Cognitive Drain</p>
                    <p className="text-xl font-black text-rose-600 italic italic-bold italic-bold font-black">23%</p>
                </div>
            </div>
        </div>
    );
};

export default UsageChart;
