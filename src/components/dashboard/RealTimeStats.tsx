import React, { FC } from "react";

const RealTimeStats: FC = () => {
  const status = "Running";
  const delay = "0 min";
  const nextStop = "Central Station";

  return (
    <div className="bg-white p-4 rounded-md shadow">
      <h2 className="text-xl font-semibold mb-2">Real-Time Train Status</h2>
      <div className="flex justify-between">
        <p>Status:</p>
        <span className="font-semibold text-green-600">{status}</span>
      </div>
      <div className="flex justify-between mt-2">
        <p>Delay:</p>
        <span className="font-semibold">{delay}</span>
      </div>
      <div className="flex justify-between mt-2">
        <p>Next Stop:</p>
        <span className="font-semibold">{nextStop}</span>
      </div>
    </div>
  );
};

export default RealTimeStats;
