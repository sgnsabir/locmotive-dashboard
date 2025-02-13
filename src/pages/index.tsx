// pages/index.tsx

import React, { FC } from "react";
import HomeDashboard from "@/components/dashboard/HomeDashboard";

const Home: FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <HomeDashboard />
    </div>
  );
};

export default Home;
