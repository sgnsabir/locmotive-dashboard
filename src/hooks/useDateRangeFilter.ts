import { useState, useEffect } from "react";

export function useDateRangeFilter<T extends { timestamp: string }>(
  originalData: T[]
) {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [filteredData, setFilteredData] = useState<T[]>(originalData);

  useEffect(() => {
    if (!startDate && !endDate) {
      setFilteredData(originalData);
      return;
    }
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const nextFiltered = originalData.filter((item) => {
      const itemDate = new Date(item.timestamp);
      if (start && itemDate < start) return false;
      if (end && itemDate > end) return false;
      return true;
    });
    setFilteredData(nextFiltered);
  }, [startDate, endDate, originalData]);

  return {
    startDate,
    endDate,
    filteredData,
    setStartDate,
    setEndDate,
  };
}
