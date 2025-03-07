import { useEffect, useState } from 'react';

export default function UpdateCurios() {
  const [curios, setCurios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch all curios from the API endpoint.
  useEffect(() => {
    fetch('/api/curios/all')
      .then((res) => res.json())
      .then((data) => {
        setCurios(data.curios || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Handle changes for owned and rank fields.
  const handleChange = (e, id, field) => {
    const value = e.target.value;
    setCurios((prev) =>
      prev.map((curio) =>
        curio.id === id
          ? { ...curio, [field]: field === 'owned' ? parseInt(value) : parseInt(value) }
          : curio
      )
    );
  };

  // On UPDATE CURIOS button click, send the updated curios to the backend.
  const handleUpdate = async () => {
    const res = await fetch('/api/curios/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ curios }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Curios updated successfully.');
    } else {
      setMessage(data.error || 'Error updating curios.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Update Curios</h1>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Owned</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          {curios.map((curio) => (
            <tr key={curio.id}>
              <td>{curio.id}</td>
              <td>{curio.name}</td>
              <td>{curio.curio_type}</td>
              <td>
                <select
                  value={curio.owned}
                  onChange={(e) => handleChange(e, curio.id, 'owned')}
                >
                  <option value="1">YES</option>
                  <option value="0">NO</option>
                </select>
              </td>
              <td>
                <select
                  value={curio.rank}
                  onChange={(e) => handleChange(e, curio.id, 'rank')}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleUpdate} style={{ marginTop: '1rem' }}>
        UPDATE CURIOS
      </button>
      {message && (
        <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>{message}</div>
      )}
    </div>
  );
}
