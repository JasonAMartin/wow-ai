import { useState, useEffect } from 'react';

export default function AddDelveRun() {
  // Prepopulate the date field with the current date in YYYY-MM-DD format
  const getCurrentFormattedDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Set up form state matching the DelveRun table columns
  const [formData, setFormData] = useState({
    delves_id: '',
    tier: '1',
    characters_id: '',
    brannLevel: '28',
    brannSpec: '',
    combat_curio_id: '',
    utility_curio_id: '',
    myItemLevel: '',
    bossKillTime: '',
    totalTime: '',
    completed: false,
    rewards: '',
    notes: '',
    dateRun: getCurrentFormattedDate(),
    season: '',
    partySize: '1',
    difficultyModifiers: ''
  });

  const [outputText, setOutputText] = useState('');

  // State for dynamic dropdown options
  const [availableDelves, setAvailableDelves] = useState([]);
  const [availableCharacters, setAvailableCharacters] = useState([]);
  const [availableCombatCurios, setAvailableCombatCurios] = useState([]);
  const [availableUtilityCurios, setAvailableUtilityCurios] = useState([]);

  // Fetch available options when the component mounts
  useEffect(() => {
    // Fetch Delves
    fetch('/api/delves')
      .then((res) => res.json())
      .then((data) => setAvailableDelves(data.delves || []))
      .catch(console.error);

    // Fetch Characters
    fetch('/api/characters')
      .then((res) => res.json())
      .then((data) => setAvailableCharacters(data.characters || []))
      .catch(console.error);

    // Fetch owned Combat Curios
    fetch('/api/curios?type=Combat')
      .then((res) => res.json())
      .then((data) => setAvailableCombatCurios(data.curios || []))
      .catch(console.error);

    // Fetch owned Utility Curios
    fetch('/api/curios?type=Utility')
      .then((res) => res.json())
      .then((data) => setAvailableUtilityCurios(data.curios || []))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/delve-run/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (res.ok) {
      setOutputText(data.message);
    } else {
      setOutputText('Error adding delve run.');
    }
  };

  // Static options for some fields
  const tiers = Array.from({ length: 11 }, (_, i) => i + 1);
  const brannLevels = Array.from({ length: 80 - 28 + 1 }, (_, i) => i + 28);
  const brannSpecs = ['DPS', 'Healer', 'Tank'];
  const partySizes = [1, 2, 3, 4, 5];

  return (
    <div className="container">
      <h1>Add Delve Run</h1>
      <form onSubmit={handleSubmit}>
        {/* Delve Dropdown */}
        <div>
          <label>Delve</label>
          <select name="delves_id" value={formData.delves_id} onChange={handleChange}>
            <option value="">Select a Delve</option>
            {availableDelves.map((delve) => (
              <option key={delve.id} value={delve.id}>
                {delve.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tier */}
        <div>
          <label>Tier Level</label>
          <select name="tier" value={formData.tier} onChange={handleChange}>
            {tiers.map((tier) => (
              <option key={tier} value={tier}>
                {tier}
              </option>
            ))}
          </select>
        </div>

        {/* Character Dropdown */}
        <div>
          <label>Character</label>
          <select name="characters_id" value={formData.characters_id} onChange={handleChange}>
            <option value="">Select Character</option>
            {availableCharacters.map((char) => (
              <option key={char.id} value={char.id}>
                {char.name} - {char.class} - {char.spec}
              </option>
            ))}
          </select>
        </div>

        {/* Brann Level */}
        <div>
          <label>Brann Level</label>
          <select name="brannLevel" value={formData.brannLevel} onChange={handleChange}>
            {brannLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Brann Spec */}
        <div>
          <label>Brann Spec</label>
          <select name="brannSpec" value={formData.brannSpec} onChange={handleChange}>
            <option value="">Select Spec</option>
            {brannSpecs.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Combat Curio Dropdown */}
        <div>
          <label>Combat Curio</label>
          <select name="combat_curio_id" value={formData.combat_curio_id} onChange={handleChange}>
            <option value="">Select Combat Curio</option>
            {availableCombatCurios.map((curio) => (
              <option key={curio.id} value={curio.id}>
                {curio.name} (Rank {curio.rank}/4)
              </option>
            ))}
          </select>
        </div>

        {/* Utility Curio Dropdown */}
        <div>
          <label>Utility Curio</label>
          <select name="utility_curio_id" value={formData.utility_curio_id} onChange={handleChange}>
            <option value="">Select Utility Curio</option>
            {availableUtilityCurios.map((curio) => (
              <option key={curio.id} value={curio.id}>
                {curio.name} (Rank {curio.rank}/4)
              </option>
            ))}
          </select>
        </div>
        {/* My Item Level */}
        <div>
          <label>My Item Level</label>
          <input type="text" name="myItemLevel" value={formData.myItemLevel} onChange={handleChange} />
        </div>

        {/* Boss Kill Time */}
        <div>
          <label>Boss Kill Time (seconds)</label>
          <input type="text" name="bossKillTime" value={formData.bossKillTime} onChange={handleChange} />
        </div>

        {/* Total Time */}
        <div>
          <label>Total Time (seconds)</label>
          <input type="text" name="totalTime" value={formData.totalTime} onChange={handleChange} />
        </div>

        {/* Completed */}
        <div>
          <label>Completed</label>
          <input type="checkbox" name="completed" checked={formData.completed} onChange={handleChange} />
        </div>

        {/* Rewards */}
        <div>
          <label>Rewards</label>
          <textarea name="rewards" value={formData.rewards} onChange={handleChange}></textarea>
        </div>

        {/* Notes */}
        <div>
          <label>Notes</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
        </div>

        {/* Date Run */}
        <div>
          <label>Date Run</label>
          <input type="date" name="dateRun" value={formData.dateRun} onChange={handleChange} />
        </div>

        {/* Season */}
        <div>
          <label>Season</label>
          <input type="number" name="season" value={formData.season} onChange={handleChange} />
        </div>

        {/* Party Size */}
        <div>
          <label>Party Size</label>
          <select name="partySize" value={formData.partySize} onChange={handleChange}>
            {partySizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Modifiers */}
        <div>
          <label>Difficulty Modifiers</label>
          <textarea name="difficultyModifiers" value={formData.difficultyModifiers} onChange={handleChange}></textarea>
        </div>

        <button type="submit">ADD DELVE RUN</button>
      </form>

      {outputText && (
        <div>
          <label>Output (copy/paste to AI):</label>
          <textarea readOnly value={outputText}></textarea>
        </div>
      )}
    </div>
  );
}
