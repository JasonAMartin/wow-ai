import { useState, useEffect } from 'react';

export default function GetDelveRuns() {
  const [runsJSON, setRunsJSON] = useState('');

  useEffect(() => {
    // Fetch delve runs data from the API endpoint
    const fetchRuns = async () => {
      const res = await fetch('/api/delve-run/get');
      const data = await res.json();
      setRunsJSON(JSON.stringify(data, null, 2));
    };

    fetchRuns();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">All Delve Runs</h1>
      <textarea
        readOnly
        value={runsJSON}
        className="w-full h-96 border p-2 font-mono"
      ></textarea>
    </div>
  );
}
