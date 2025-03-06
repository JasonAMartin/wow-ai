import { useState, useEffect } from 'react';

export default function AddDelveRun() {
  // Prepopulate the date field with the current date formatted as "Month DD, YYYY"
  const getCurrentFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
  };

  const [formData, setFormData] = useState({
    delveName: '',
    tier: '1',
    character: '',
    brannLevel: '28',
    brannSpec: '',
    combatCurios: '',
    utilityCurios: '',
    myItemLevel: '',
    bossKillTime: '',
    notes: '',
    dateRun: getCurrentFormattedDate()
  });

  const [outputText, setOutputText] = useState('');

  // Sample dropdown values (can be replaced with a full list later)
  const delveNames = [
    'Mycomancer Cavern',
    'Sanguine Depths',
    'Twilight Grotto'
  ];

  const characters = [
    'Protection Paladin',
    'BM Hunter',
    'Guardian Druid'
  ];

  const tiers = Array.from({ length: 11 }, (_, i) => i + 1);
  const brannLevels = Array.from({ length: 80 - 28 + 1 }, (_, i) => i + 28);
  const brannSpecs = ['healer', 'dps', 'tank'];

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call the API to add a new delve run
    const res = await fetch('/api/delve-run/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    if (res.ok) {
      // Populate output text area with formatted text from API response
      setOutputText(data.message);
      // Optionally, reset the form here if desired.
    } else {
      setOutputText('Error adding delve run.');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Add Delve Run</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Delve Name */}
        <div>
          <label className="block">Delve Name</label>
          <select name="delveName" value={formData.delveName} onChange={handleChange} className="border p-2 w-full">
            <option value="">Select a Delve</option>
            {delveNames.map((name, idx) => (
              <option key={idx} value={name}>{name}</option>
            ))}
          </select>
        </div>

        {/* Tier Level */}
        <div>
          <label className="block">Tier Level</label>
          <select name="tier" value={formData.tier} onChange={handleChange} className="border p-2 w-full">
            {tiers.map((tier) => (
              <option key={tier} value={tier}>{tier}</option>
            ))}
          </select>
        </div>

        {/* Character */}
        <div>
          <label className="block">Character</label>
          <select name="character" value={formData.character} onChange={handleChange} className="border p-2 w-full">
            <option value="">Select Character</option>
            {characters.map((char, idx) => (
              <option key={idx} value={char}>{char}</option>
            ))}
          </select>
        </div>

        {/* Brann Level */}
        <div>
          <label className="block">Brann Level</label>
          <select name="brannLevel" value={formData.brannLevel} onChange={handleChange} className="border p-2 w-full">
            {brannLevels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Brann Spec */}
        <div>
          <label className="block">Brann Spec</label>
          <select name="brannSpec" value={formData.brannSpec} onChange={handleChange} className="border p-2 w-full">
            <option value="">Select Spec</option>
            {brannSpecs.map((spec, idx) => (
              <option key={idx} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        {/* Combat Curios */}
        <div>
          <label className="block">Combat Curios</label>
          <input
            type="text"
            name="combatCurios"
            value={formData.combatCurios}
            onChange={handleChange}
            placeholder="e.g. Porcelain Arrowhead Idol Rank 3/4"
            className="border p-2 w-full"
          />
        </div>

        {/* Utility Curios */}
        <div>
          <label className="block">Utility Curios</label>
          <input
            type="text"
            name="utilityCurios"
            value={formData.utilityCurios}
            onChange={handleChange}
            placeholder="e.g. Amorphous Relic Rank 3/4"
            className="border p-2 w-full"
          />
        </div>

        {/* My Item Level */}
        <div>
          <label className="block">My Item Level</label>
          <input
            type="text"
            name="myItemLevel"
            value={formData.myItemLevel}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        {/* Boss Kill Time */}
        <div>
          <label className="block">Boss Kill Time</label>
          <input
            type="text"
            name="bossKillTime"
            value={formData.bossKillTime}
            onChange={handleChange}
            placeholder="e.g. 51 seconds"
            className="border p-2 w-full"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="border p-2 w-full"
          ></textarea>
        </div>

        {/* Date Run */}
        <div>
          <label className="block">Date Run</label>
          <input
            type="text"
            name="dateRun"
            value={formData.dateRun}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          ADD DELVE RUN
        </button>
      </form>

      {/* Output text area */}
      {outputText && (
        <div className="mt-6">
          <label className="block font-bold">Output (copy/paste to AI):</label>
          <textarea readOnly value={outputText} className="w-full h-48 border p-2"></textarea>
        </div>
      )}
    </div>
  );
}
