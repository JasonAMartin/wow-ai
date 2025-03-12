import { useState, useEffect } from 'react';
import SiteHeader from '../components/SiteHeader';
import styles from '../styles/AddDelveRun.module.css';

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
    brannLevel: '33',
    brannSpec: '',
    combat_curio_id: '',
    utility_curio_id: '',
    myItemLevel: '',
    bossKillTime: '',
    totalTime: '',
    completed: true,
    rewards: '',
    notes: '',
    dateRun: getCurrentFormattedDate(),
    season: '',
    partySize: '1',
    difficultyModifiers: ''
  });

  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Time converter state
  const [showBossTimeConverter, setShowBossTimeConverter] = useState(false);
  const [showTotalTimeConverter, setShowTotalTimeConverter] = useState(false);
  const [bossTimeConverterValues, setBossTimeConverterValues] = useState({ minutes: 0, seconds: 0 });
  const [totalTimeConverterValues, setTotalTimeConverterValues] = useState({ minutes: 0, seconds: 0 });

  // Dynamic lookup arrays
  const [availableDelves, setAvailableDelves] = useState([]);
  const [availableCharacters, setAvailableCharacters] = useState([]);
  const [availableCombatCurios, setAvailableCombatCurios] = useState([]);
  const [availableUtilityCurios, setAvailableUtilityCurios] = useState([]);

  // Fetch dynamic options when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [delvesRes, charactersRes, combatCuriosRes, utilityCuriosRes] = await Promise.all([
          fetch('/api/delves'),
          fetch('/api/characters'),
          fetch('/api/curios?type=Combat'),
          fetch('/api/curios?type=Utility')
        ]);

        const delvesData = await delvesRes.json();
        const charactersData = await charactersRes.json();
        const combatCuriosData = await combatCuriosRes.json();
        const utilityCuriosData = await utilityCuriosRes.json();

        setAvailableDelves(delvesData.delves || []);
        setAvailableCharacters(charactersData.characters || []);
        setAvailableCombatCurios(combatCuriosData.curios || []);
        setAvailableUtilityCurios(utilityCuriosData.curios || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle time converter input changes
  const handleTimeConverterChange = (e, type) => {
    const { name, value } = e.target;
    if (type === 'boss') {
      setBossTimeConverterValues(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setTotalTimeConverterValues(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Convert minutes and seconds to total seconds
  const convertTime = (type) => {
    if (type === 'boss') {
      const { minutes, seconds } = bossTimeConverterValues;
      const totalSeconds = (parseInt(minutes) * 60) + parseInt(seconds);
      setFormData(prev => ({
        ...prev,
        bossKillTime: totalSeconds.toString()
      }));
      setShowBossTimeConverter(false);
    } else {
      const { minutes, seconds } = totalTimeConverterValues;
      const totalSeconds = (parseInt(minutes) * 60) + parseInt(seconds);
      setFormData(prev => ({
        ...prev,
        totalTime: totalSeconds.toString()
      }));
      setShowTotalTimeConverter(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
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
        setOutputText(`Error adding delve run: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setOutputText('Error connecting to server.');
    }
  };

  // Static options for some fields
  const tiers = Array.from({ length: 11 }, (_, i) => i + 1);
  const brannLevels = Array.from({ length: 80 - 33 + 1 }, (_, i) => i + 33);
  const brannSpecs = ['DPS', 'Healer', 'Tank'];
  const partySizes = [1, 2, 3, 4, 5];

  return (
    <>
      <SiteHeader />
      <div className={styles.container}>
        <h1 className={styles.title}>Add Delve Run</h1>
        
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              {/* Delve Dropdown */}
              <div className={styles.formField}>
                <label>Delve</label>
                <select 
                  name="delves_id" 
                  value={formData.delves_id} 
                  onChange={handleChange}
                  className={styles.select}
                  disabled={isLoading}
                >
                  <option value="">Select a Delve</option>
                  {availableDelves.map((delve) => (
                    <option key={delve.id} value={delve.id}>
                      {delve.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tier */}
              <div className={styles.formField}>
                <label>Tier Level</label>
                <select 
                  name="tier" 
                  value={formData.tier} 
                  onChange={handleChange}
                  className={styles.select}
                >
                  {tiers.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier}
                    </option>
                  ))}
                </select>
              </div>

              {/* Character Dropdown */}
              <div className={styles.formField}>
                <label>Character</label>
                <select 
                  name="characters_id" 
                  value={formData.characters_id} 
                  onChange={handleChange}
                  className={styles.select}
                  disabled={isLoading}
                >
                  <option value="">Select Character</option>
                  {availableCharacters.map((char) => (
                    <option key={char.id} value={char.id}>
                      {char.name} - {char.class} - {char.spec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Combat Curio Dropdown */}
              <div className={styles.formField}>
                <label>Combat Curio</label>
                <select 
                  name="combat_curio_id" 
                  value={formData.combat_curio_id} 
                  onChange={handleChange}
                  className={styles.select}
                  disabled={isLoading}
                >
                  <option value="">Select Combat Curio</option>
                  {availableCombatCurios.map((curio) => (
                    <option key={curio.id} value={curio.id}>
                      {curio.name} (Rank {curio.rank}/4)
                    </option>
                  ))}
                </select>
              </div>

              {/* Utility Curio Dropdown */}
              <div className={styles.formField}>
                <label>Utility Curio</label>
                <select 
                  name="utility_curio_id" 
                  value={formData.utility_curio_id} 
                  onChange={handleChange}
                  className={styles.select}
                  disabled={isLoading}
                >
                  <option value="">Select Utility Curio</option>
                  {availableUtilityCurios.map((curio) => (
                    <option key={curio.id} value={curio.id}>
                      {curio.name} (Rank {curio.rank}/4)
                    </option>
                  ))}
                </select>
              </div>

              {/* Brann Level */}
              <div className={styles.formField}>
                <label>Brann Level</label>
                <select 
                  name="brannLevel" 
                  value={formData.brannLevel} 
                  onChange={handleChange}
                  className={styles.select}
                >
                  {brannLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brann Spec */}
              <div className={styles.formField}>
                <label>Brann Spec</label>
                <select 
                  name="brannSpec" 
                  value={formData.brannSpec} 
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Select Spec</option>
                  {brannSpecs.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              {/* My Item Level */}
              <div className={styles.formField}>
                <label>My Item Level</label>
                <input 
                  type="text" 
                  name="myItemLevel" 
                  value={formData.myItemLevel} 
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="e.g. 489.5"
                />
              </div>

              {/* Boss Kill Time */}
              <div className={styles.formField}>
                <div className={styles.labelWithConverter}>
                  <label>Boss Kill Time (seconds)</label>
                  <button 
                    type="button" 
                    className={styles.convertButton}
                    onClick={() => setShowBossTimeConverter(true)}
                  >
                    [ convert ]
                  </button>
                </div>
                <input 
                  type="text" 
                  name="bossKillTime" 
                  value={formData.bossKillTime} 
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="e.g. 180"
                />
                {showBossTimeConverter && (
                  <div className={styles.converterPopup}>
                    <div className={styles.converterContent}>
                      <h3>Convert Time to Seconds</h3>
                      <div className={styles.converterInputs}>
                        <div className={styles.converterField}>
                          <label>Minutes</label>
                          <input 
                            type="number" 
                            name="minutes"
                            min="0"
                            value={bossTimeConverterValues.minutes} 
                            onChange={(e) => handleTimeConverterChange(e, 'boss')}
                            className={styles.converterInput}
                          />
                        </div>
                        <div className={styles.converterField}>
                          <label>Seconds</label>
                          <input 
                            type="number"
                            name="seconds"
                            min="0"
                            max="59" 
                            value={bossTimeConverterValues.seconds} 
                            onChange={(e) => handleTimeConverterChange(e, 'boss')}
                            className={styles.converterInput}
                          />
                        </div>
                      </div>
                      <div className={styles.converterButtons}>
                        <button 
                          type="button" 
                          className={styles.converterActionButton}
                          onClick={() => convertTime('boss')}
                        >
                          CONVERT TIME
                        </button>
                        <button 
                          type="button" 
                          className={styles.converterCancelButton}
                          onClick={() => setShowBossTimeConverter(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Total Time */}
              <div className={styles.formField}>
                <div className={styles.labelWithConverter}>
                  <label>Total Time (seconds)</label>
                  <button 
                    type="button" 
                    className={styles.convertButton}
                    onClick={() => setShowTotalTimeConverter(true)}
                  >
                    [ convert ]
                  </button>
                </div>
                <input 
                  type="text" 
                  name="totalTime" 
                  value={formData.totalTime} 
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="e.g. 600"
                />
                {showTotalTimeConverter && (
                  <div className={styles.converterPopup}>
                    <div className={styles.converterContent}>
                      <h3>Convert Time to Seconds</h3>
                      <div className={styles.converterInputs}>
                        <div className={styles.converterField}>
                          <label>Minutes</label>
                          <input 
                            type="number" 
                            name="minutes"
                            min="0"
                            value={totalTimeConverterValues.minutes} 
                            onChange={(e) => handleTimeConverterChange(e, 'total')}
                            className={styles.converterInput}
                          />
                        </div>
                        <div className={styles.converterField}>
                          <label>Seconds</label>
                          <input 
                            type="number"
                            name="seconds"
                            min="0"
                            max="59" 
                            value={totalTimeConverterValues.seconds} 
                            onChange={(e) => handleTimeConverterChange(e, 'total')}
                            className={styles.converterInput}
                          />
                        </div>
                      </div>
                      <div className={styles.converterButtons}>
                        <button 
                          type="button" 
                          className={styles.converterActionButton}
                          onClick={() => convertTime('total')}
                        >
                          CONVERT TIME
                        </button>
                        <button 
                          type="button" 
                          className={styles.converterCancelButton}
                          onClick={() => setShowTotalTimeConverter(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Date Run */}
              <div className={styles.formField}>
                <label>Date Run</label>
                <input 
                  type="date" 
                  name="dateRun" 
                  value={formData.dateRun} 
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              {/* Season */}
              <div className={styles.formField}>
                <label>Season</label>
                <input 
                  type="number" 
                  name="season" 
                  value={formData.season} 
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="e.g. 2"
                  min="1"
                />
              </div>

              {/* Party Size */}
              <div className={styles.formField}>
                <label>Party Size</label>
                <select 
                  name="partySize" 
                  value={formData.partySize} 
                  onChange={handleChange}
                  className={styles.select}
                >
                  {partySizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              {/* Completed Checkbox */}
              <div className={`${styles.formField} ${styles.checkboxField}`}>
                <input
                  type="checkbox"
                  name="completed"
                  checked={formData.completed}
                  onChange={handleChange}
                  className={styles.checkbox}
                  id="completed"
                />
                <label htmlFor="completed">Delve Completed Successfully</label>
              </div>

              {/* Rewards - Full Width */}
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label>Rewards</label>
                <textarea 
                  name="rewards" 
                  value={formData.rewards} 
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="List any rewards received from the delve run"
                ></textarea>
              </div>

              {/* Difficulty Modifiers - Full Width */}
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label>Difficulty Modifiers</label>
                <textarea 
                  name="difficultyModifiers" 
                  value={formData.difficultyModifiers} 
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="List any difficulty modifiers applied to the delve"
                ></textarea>
              </div>

              {/* Notes - Full Width */}
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label>Notes</label>
                <textarea 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Add any additional notes about the delve run"
                ></textarea>
              </div>
            </div>

            <button type="submit" className={styles.submitButton}>
              Add Delve Run
            </button>
          </form>
        </div>

        {/* JSON FOR AI output */}
        {outputText && (
          <div className={styles.outputSection}>
            <h2 className={styles.outputTitle}>Delve Run Data (JSON)</h2>
            <textarea
              readOnly
              value={outputText}
              className={styles.outputTextarea}
            ></textarea>
          </div>
        )}
      </div>
    </>
  );
}