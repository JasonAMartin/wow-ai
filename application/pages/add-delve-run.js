import { useState, useEffect } from 'react';

export default function AddDelveRun() {
  // Prepopulate the date field with today's date in YYYY-MM-DD format
  const getCurrentFormattedDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Form state matching the DelveRun table columns (using IDs for lookups)
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

  // Dynamic lookup arrays
  const [availableDelves, setAvailableDelves] = useState([]);
  const [availableCharacters, setAvailableCharacters] = useState([]);
  const [availableCombatCurios, setAvailableCombatCurios] = useState([]);
  const [availableUtilityCurios, setAvailableUtilityCurios] = useState([]);

  // Fetch dynamic options when component mounts
  useEffect(() => {
    fetch('/api/delves')
      .then((res) => res.json())
      .then((data) => setAvailableDelves(data.delves || []))
      .catch(console.error);

    fetch('/api/characters')
      .then((res) => res.json())
      .then((data) => setAvailableCharacters(data.characters || []))
      .catch(console.error);

    fetch('/api/curios?type=Combat')
      .then((res) => res.json())
      .then((data) => setAvailableCombatCurios(data.curios || []))
      .catch(console.error);

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

    // Post the formData to the API endpoint
    const res = await fetch('/api/delve-run/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (res.ok) {
      // Build a JSON object for AI output that uses display names
      const selectedDelve = availableDelves.find(
        (d) => d.id.toString() === formData.delves_id
      );
      const selectedCharacter = availableCharacters.find(
        (c) => c.id.toString() === formData.characters_id
      );
      const selectedCombatCurio = availableCombatCurios.find(
        (c) => c.id.toString() === formData.combat_curio_id
      );
      const selectedUtilityCurio = availableUtilityCurios.find(
        (c) => c.id.toString() === formData.utility_curio_id
      );

      const aiOutput = {
        Delve: selectedDelve ? selectedDelve.name : '',
        Tier: formData.tier,
        Character: selectedCharacter
          ? `${selectedCharacter.name} - ${selectedCharacter.class} - ${selectedCharacter.spec}`
          : '',
        BrannLevel: formData.brannLevel,
        BrannSpec: formData.brannSpec,
        CombatCurio: selectedCombatCurio
          ? `${selectedCombatCurio.name} (Rank ${selectedCombatCurio.rank}/4)`
          : '',
        UtilityCurio: selectedUtilityCurio
          ? `${selectedUtilityCurio.name} (Rank ${selectedUtilityCurio.rank}/4)`
          : '',
        MyItemLevel: formData.myItemLevel,
        BossKillTime: formData.bossKillTime,
        TotalTime: formData.totalTime,
        Completed: formData.completed,
        Rewards: formData.rewards,
        Notes: formData.notes,
        DateRun: formData.dateRun,
        Season: formData.season,
        PartySize: formData.partySize,
        DifficultyModifiers: formData.difficultyModifiers
      };

      setOutputText(JSON.stringify(aiOutput, null, 2));
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
    <div style={{ padding: '2rem' }}>
      <h1>Add Delve Run</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        {/* Delve Dropdown */}
        <div>
          <label>Delve</label>
          <br />
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
          <br />
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
          <br />
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
          <br />
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
          <br />
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
          <br />
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
          <br />
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
          <br />
          <input type="text" name="myItemLevel" value={formData.myItemLevel} onChange={handleChange} />
        </div>

        {/* Boss Kill Time */}
        <div>
          <label>Boss Kill Time (seconds)</label>
          <br />
          <input type="text" name="bossKillTime" value={formData.bossKillTime} onChange={handleChange} />
        </div>

        {/* Total Time */}
        <div>
          <label>Total Time (seconds)</label>
          <br />
          <input type="text" name="totalTime" value={formData.totalTime} onChange={handleChange} />
        </div>

        {/* Completed */}
        <div>
          <label>Completed</label>
          <br />
          <input
            type="checkbox"
            name="completed"
            checked={formData.completed}
            onChange={handleChange}
          />
        </div>

        {/* Rewards */}
        <div>
          <label>Rewards</label>
          <br />
          <textarea name="rewards" value={formData.rewards} onChange={handleChange}></textarea>
        </div>

        {/* Notes */}
        <div>
          <label>Notes</label>
          <br />
          <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
        </div>

        {/* Date Run */}
        <div>
          <label>Date Run</label>
          <br />
          <input type="date" name="dateRun" value={formData.dateRun} onChange={handleChange} />
        </div>

        {/* Season */}
        <div>
          <label>Season</label>
          <br />
          <input type="number" name="season" value={formData.season} onChange={handleChange} />
        </div>

        {/* Party Size */}
        <div>
          <label>Party Size</label>
          <br />
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
          <br />
          <textarea name="difficultyModifiers" value={formData.difficultyModifiers} onChange={handleChange}></textarea>
        </div>

        <button type="submit" style={{ marginTop: '1rem' }}>
          ADD DELVE RUN
        </button>
      </form>

      {/* JSON FOR AI output */}
      <div style={{ marginTop: '2rem' }}>
        <h2>JSON FOR AI</h2>
        <textarea
          readOnly
          value={outputText}
          style={{ width: '100%', height: '300px' }}
        ></textarea>
      </div>
    </div>
  );
}
