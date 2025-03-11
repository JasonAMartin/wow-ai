import { useState } from 'react';

export default function StoreAIContext() {
  const [formData, setFormData] = useState({
    topic: '',
    context: '',
    notes: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/ai-context/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
      // Optionally clear the form
      setFormData({ topic: '', context: '', notes: '' });
    } else {
      setMessage(data.error || 'Error adding AI context.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Store AI Context</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Topic</label>
          <br />
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div>
          <label>Context (JSON format)</label>
          <br />
          <textarea
            name="context"
            value={formData.context}
            onChange={handleChange}
            rows={10}
            style={{ width: '100%', padding: '0.5rem' }}
          ></textarea>
        </div>
        <div>
          <label>Notes</label>
          <br />
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={5}
            style={{ width: '100%', padding: '0.5rem' }}
          ></textarea>
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          ADD AI CONTEXT
        </button>
      </form>
      {message && <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>{message}</div>}
    </div>
  );
}
