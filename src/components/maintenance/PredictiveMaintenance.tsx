import React, { FC } from "react";

interface PredictionItem {
  component: string;
  probability: number;
}

interface PredictiveMaintenanceProps {
  predictions: PredictionItem[];
}

const PredictiveMaintenance: FC<PredictiveMaintenanceProps> = ({
  predictions,
}) => {
  return (
    <div className="space-y-2">
      {predictions.length === 0 ? (
        <p className="text-gray-500 italic">
          No predictive maintenance warnings.
        </p>
      ) : (
        predictions.map((prediction, idx) => (
          <div key={idx} className="border p-4 rounded-md shadow">
            <p className="font-bold">{prediction.component}</p>
            <p>
              Failure Probability: {(prediction.probability * 100).toFixed(1)}%
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default PredictiveMaintenance;
