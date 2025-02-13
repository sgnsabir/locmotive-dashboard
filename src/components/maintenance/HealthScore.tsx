import React, { FC } from "react";

interface HealthScoreProps {
  score: number;
}

const HealthScore: FC<HealthScoreProps> = ({ score }) => {
  const color =
    score >= 80
      ? "text-green-600"
      : score >= 50
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="border p-4 rounded-md shadow">
      <p className="text-gray-500 text-sm">Train Health Score</p>
      <p className={`text-3xl font-bold ${color}`}>{score}</p>
    </div>
  );
};

export default HealthScore;
