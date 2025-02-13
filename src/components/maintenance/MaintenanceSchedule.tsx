import React, { FC } from "react";

interface MaintenanceItem {
  id: number;
  date: string;
  description: string;
}

interface MaintenanceScheduleProps {
  items: MaintenanceItem[];
}

const MaintenanceSchedule: FC<MaintenanceScheduleProps> = ({ items }) => {
  return (
    <div className="space-y-2">
      {items.length === 0 ? (
        <p className="text-gray-500 italic">No upcoming maintenance tasks.</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="border p-4 rounded-md shadow">
            <p className="font-bold">{item.date}</p>
            <p>{item.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default MaintenanceSchedule;
