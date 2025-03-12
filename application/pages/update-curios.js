import { useEffect, useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import styles from '../styles/UpdateCurios.module.css';

export default function UpdateCurios() {
  const [curios, setCurios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

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
        setMessage('Error loading curios data.');
        setMessageType('error');
      });
  }, []);

  // Handle changes for owned, rank, and image fields.
  const handleChange = (e, id, field) => {
    const value = e.target.value;
    setCurios((prev) =>
      prev.map((curio) =>
        curio.id === id
          ? { 
              ...curio, 
              [field]: field === 'curios_image' 
                ? value 
                : parseInt(value) 
            }
          : curio
      )
    );
  };

  // On UPDATE CURIOS button click, send the updated curios to the backend.
  const handleUpdate = async () => {
    try {
      const res = await fetch('/api/curios/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ curios }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage('Curios updated successfully.');
        setMessageType('success');
      } else {
        setMessage(data.error || 'Error updating curios.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error connecting to server.');
      setMessageType('error');
      console.error(error);
    }
  };

  if (loading) return (
    <>
      <SiteHeader />
      <div className={styles.container}>
        <div className={styles.loading}>Loading Curios Data...</div>
      </div>
    </>
  );

  return (
    <>
      <SiteHeader />
      <div className={styles.container}>
        <h1 className={styles.title}>Update Curios</h1>
        
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>ID</th>
                <th className={styles.tableHeader}>Name</th>
                <th className={styles.tableHeader}>Type</th>
                <th className={styles.tableHeader}>Owned</th>
                <th className={styles.tableHeader}>Rank</th>
                <th className={styles.tableHeader}>Image</th>
              </tr>
            </thead>
            <tbody>
              {curios.map((curio) => (
                <tr key={curio.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{curio.id}</td>
                  <td className={styles.tableCell}>{curio.name}</td>
                  <td className={styles.tableCell}>{curio.curio_type}</td>
                  <td className={styles.tableCell}>
                    <select
                      className={styles.select}
                      value={curio.owned}
                      onChange={(e) => handleChange(e, curio.id, 'owned')}
                    >
                      <option value={1}>YES</option>
                      <option value={0}>NO</option>
                    </select>
                  </td>
                  <td className={styles.tableCell}>
                    <select
                      className={styles.select}
                      value={curio.rank}
                      onChange={(e) => handleChange(e, curio.id, 'rank')}
                    >
                      <option value={0}>0</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  </td>
                  <td className={`${styles.tableCell} ${styles.imageCell}`}>
                    {curio.curios_image && (
                      <img 
                        src={curio.curios_image.startsWith('http') ? curio.curios_image : `/images/${curio.curios_image}`} 
                        alt={curio.name} 
                        className={styles.curioImage}
                      />
                    )}
                    <input
                      type="text"
                      className={styles.imageInput}
                      value={curio.curios_image || ''}
                      onChange={(e) => handleChange(e, curio.id, 'curios_image')}
                      placeholder="image.jpg or URL"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <button onClick={handleUpdate} className={styles.updateButton}>
          Update Curios
        </button>
        
        {message && (
          <div className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </div>
        )}
      </div>
    </>
  );
}