import React, { FC } from "react";

interface KPICardProps {
  title: string;
  value: string;
  unit?: string;
}

const KPICard: FC<KPICardProps> = ({ title, value, unit }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow hover:shadow-lg transition duration-200">
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <div className="text-3xl font-bold">{value}</div>
      {unit && <p className="text-gray-500 text-xs">{unit}</p>}
    </div>
  );
};

export default KPICard;
