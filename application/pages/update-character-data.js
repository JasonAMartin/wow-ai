import { useState } from 'react';

export default function UpdateCharacterData() {
  const [jsonInput, setJsonInput] = useState('');
  const [completeOverwrite, setCompleteOverwrite] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    let parsed;
    try {
      parsed = JSON.parse(jsonInput);
    } catch (err) {
      setMessage('Invalid JSON');
      return;
    }

    // Ensure the JSON has a "character" node with required keys: class, spec, and name.
    if (!parsed.character || !parsed.character.class || !parsed.character.spec || !parsed.character.name) {
      setMessage('JSON must contain a "character" object with "class", "spec", and "name".');
      return;
    }

    const res = await fetch('/api/characters/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ characterData: parsed.character, completeOverwrite })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
    } else {
      setMessage(data.error || 'Error updating character data.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Update Character Data</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          rows={20}
          cols={80}
          placeholder="Paste JSON here..."
          style={{ display: 'block', marginBottom: '1rem' }}
        />
        <label style={{ display: 'block', marginBottom: '1rem' }}>
          <input
            type="checkbox"
            checked={completeOverwrite}
            onChange={(e) => setCompleteOverwrite(e.target.checked)}
          />{' '}
          COMPLETE OVERWRITE
        </label>
        <button type="submit">UPDATE</button>
      </form>
      {message && (
        <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>{message}</div>
      )}
    </div>
  );
}
