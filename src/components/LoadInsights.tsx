import React, { FC } from "react";

interface AxleData {
  axle: string;
  load: number;
}

interface ForceData {
  x: number;
  y: number;
  force: number;
}

interface LoadInsightsProps {
  axleData: AxleData[];
  forceData: ForceData[];
}

const LoadInsights: FC<LoadInsightsProps> = ({ axleData, forceData }) => {
  const totalLoad = axleData.reduce((acc, curr) => acc + curr.load, 0);
  const averageLoad = totalLoad / axleData.length;
  const maxLoad = Math.max(...axleData.map((d) => d.load));
  const minLoad = Math.min(...axleData.map((d) => d.load));
  const loadRange = maxLoad - minLoad;

  const totalForce = forceData.reduce((acc, curr) => acc + curr.force, 0);
  const averageForce = totalForce / forceData.length;
  const maxForce = Math.max(...forceData.map((d) => d.force));
  const minForce = Math.min(...forceData.map((d) => d.force));
  const forceRange = maxForce - minForce;

  return (
    <div className="space-y-4 p-4">
      <p className="text-base">
        <strong>Axle Load Analysis:</strong> The average axle load is{" "}
        <span className="font-semibold">{averageLoad.toFixed(2)} tons</span>,
        with a maximum load of{" "}
        <span className="font-semibold">{maxLoad} tons</span> and a minimum load
        of <span className="font-semibold">{minLoad} tons</span>. The load range
        is <span className="font-semibold">{loadRange} tons</span>.
      </p>
      <p className="text-base">
        <strong>Force Heatmap Analysis:</strong> The average measured force is{" "}
        <span className="font-semibold">{averageForce.toFixed(2)} kN</span>,
        with force values ranging from{" "}
        <span className="font-semibold">{minForce} kN</span> to{" "}
        <span className="font-semibold">{maxForce} kN</span> (range:{" "}
        <span className="font-semibold">{forceRange} kN</span>).
      </p>
      <p className="text-base">
        <strong>Recommendations:</strong> Monitor the axle load differences and
        force distribution closely.
      </p>
    </div>
  );
};

export default LoadInsights;
