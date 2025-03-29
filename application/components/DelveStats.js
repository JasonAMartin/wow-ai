import React, { useState } from 'react';
import styles from '../styles/ViewDelveRuns.module.css';

// Helper function to format seconds to MM:SS
const formatTime = (seconds) => {
  // Handle edge cases including null, undefined, or NaN
  if (seconds == null || isNaN(seconds)) return '--';
  
  // Convert to number if it's a string
  const secondsNum = typeof seconds === 'string' ? Number(seconds) : seconds;
  
  const mins = Math.floor(secondsNum / 60);
  const secs = Math.floor(secondsNum % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Get class color for character display
const getClassColor = (characterClass) => {
  const classColors = {
    'Warrior': '#C79C6E',
    'Paladin': '#F58CBA',
    'Hunter': '#ABD473',
    'Rogue': '#FFF569',
    'Priest': '#FFFFFF',
    'Shaman': '#0070DE',
    'Mage': '#69CCF0',
    'Warlock': '#9482C9',
    'Monk': '#00FF96',
    'Druid': '#FF7D0A',
    'Demon Hunter': '#A330C9',
    'Death Knight': '#C41F3B',
    'Evoker': '#33937F',
  };
  
  return classColors[characterClass] || '#F8B700'; // Default to gold
};

// Get first letter of character class for icon
const getClassInitial = (characterClass) => {
  return characterClass ? characterClass.charAt(0) : 'C';
};

const DelveStats = ({ delve }) => {
  const [activeTab, setActiveTab] = useState('bossKillTime');
  const [activeView, setActiveView] = useState('matrix');
  
  if (!delve) return null;
  
  const { name, zone, characters, tiers } = delve;
  
  // Get sorted tiers as an array for display
  const sortedTiers = Object.values(tiers).sort((a, b) => a.tier - b.tier);
  
  // Limit to showing only 5 tiers at a time - select the highest populated tiers
  let tiersToShow = [...sortedTiers];
  if (tiersToShow.length > 5) {
    // Get the highest tier values
    tiersToShow = tiersToShow.slice(-5);
  }
  
  // Get sorted characters as an array
  const sortedCharacters = Object.values(characters);
  
  // Function to get the fastest run for a specific character and tier
  const getBestRun = (charId, tierLevel, timeType) => {
    if (!characters[charId] || !tiers[tierLevel]) return null;
    
    // Find all runs for this character and tier - using loose equality for flexibility
    const characterRuns = characters[charId].runs.filter(run => run.tier == tierLevel);
    
    // Detailed debugging for this specific character and tier
    console.log(`DETAIL: Looking for runs - Character ${charId}, Tier ${tierLevel}, Type ${timeType}`);
    console.log(`DETAIL: Found ${characterRuns.length} runs`, characterRuns);
    
    if (characterRuns.length === 0) return null;
    
    // Log EVERY run's time value to see what we're working with
    characterRuns.forEach((run, index) => {
      console.log(`DETAIL: Run ${index} for char ${charId} tier ${tierLevel}:`, {
        tier: run.tier,
        timeType: timeType,
        timeValue: run[timeType],
        fullRun: run
      });
    });
    
    // Find the run with the fastest time
    let bestRun = null;
    let bestTime = Infinity;
    
    for (let i = 0; i < characterRuns.length; i++) {
      const run = characterRuns[i];
      
      console.log(`DETAIL: Checking run ${i}`, {
        hasTimeField: timeType in run,
        timeValue: run[timeType],
        typeofTime: typeof run[timeType]
      });
      
      // Make sure the time field exists and is a valid number - using loose equality
      if (run[timeType] != null) {
        const timeValue = Number(run[timeType]);
        console.log(`DETAIL: Valid time value found: ${timeValue}`);
        
        if (!isNaN(timeValue) && timeValue < bestTime) {
          bestRun = run;
          bestTime = timeValue;
          console.log(`DETAIL: New best time: ${bestTime}`);
        }
      }
    }
    
    console.log(`DETAIL: Best run found:`, bestRun);
    
    // Check if the activeTab property exists in the best run
    if (bestRun) {
      console.log(`DETAIL: Does best run have ${timeType} property?`, {
        propertyExists: timeType in bestRun,
        propertyValue: bestRun[timeType],
        allProperties: Object.keys(bestRun)
      });
    }
    
    return bestRun;
  };
  
  // Debug: Log the data structure
  console.log('Delve Data:', {
    name,
    characters: Object.keys(characters).length,
    tiers: Object.keys(tiers).length,
    activeTab
  });
  
  return (
    <div className={styles.delveCard}>
      <div className={styles.delveHeader}>
        <div>
          <h2 className={styles.delveName}>{name}</h2>
          {zone && <div className={styles.delveZone}>{zone}</div>}
        </div>
      </div>
      
      <div className={styles.tabsContainer}>
        <div 
          className={`${styles.tab} ${activeTab === 'bossKillTime' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('bossKillTime')}
          style={{ cursor: 'pointer' }}
        >
          Boss Kill Time {activeTab === 'bossKillTime' && <span className={styles.activeTabIndicator}>▶</span>}
        </div>
        <div 
          className={`${styles.tab} ${activeTab === 'totalTime' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('totalTime')}
          style={{ cursor: 'pointer' }}
        >
          Total Run Time {activeTab === 'totalTime' && <span className={styles.activeTabIndicator}>▶</span>}
        </div>
        
        <div style={{ flex: 1 }}></div>
        
        <div 
          className={`${styles.tab} ${activeView === 'matrix' ? styles.tabActive : ''}`}
          onClick={() => setActiveView('matrix')}
          style={{ cursor: 'pointer' }}
        >
          Matrix View {activeView === 'matrix' && <span className={styles.activeTabIndicator}>▶</span>}
        </div>
        <div 
          className={`${styles.tab} ${activeView === 'character' ? styles.tabActive : ''}`}
          onClick={() => setActiveView('character')}
          style={{ cursor: 'pointer' }}
        >
          By Character {activeView === 'character' && <span className={styles.activeTabIndicator}>▶</span>}
        </div>
        <div 
          className={`${styles.tab} ${activeView === 'tier' ? styles.tabActive : ''}`}
          onClick={() => setActiveView('tier')}
          style={{ cursor: 'pointer' }}
        >
          By Tier {activeView === 'tier' && <span className={styles.activeTabIndicator}>▶</span>}
        </div>
      </div>
      
      <div className={styles.statsContent}>
        {activeView === 'matrix' && (
          <div className={styles.matrixView}>
            <h3 className={styles.statsSectionTitle}>
              {activeTab === 'bossKillTime' ? 'Boss Kill' : 'Total Run'} Times by Character and Tier
            </h3>
            
            <div className={styles.matrixWrapper}>
              <table className={styles.matrixTable}>
                <thead>
                  <tr>
                    <th className={styles.matrixHeader}>Character</th>
                    {tiersToShow.map(tier => (
                      <th key={`header-tier-${tier.tier}`} className={styles.matrixHeader}>
                        Tier {tier.tier}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedCharacters.map(character => (
                    <tr key={`row-char-${character.id}`}>
                      <td className={styles.matrixCell}>
                        <div className={styles.characterCell}>
                          <div 
                            className={styles.characterIcon}
                            style={{ 
                              backgroundColor: `${getClassColor(character.class)}20`,
                              color: getClassColor(character.class)
                            }}
                          >
                            {getClassInitial(character.class)}
                          </div>
                          <div className={styles.characterCellInfo}>
                            <div>{character.name}</div>
                            <div className={styles.characterClass}>{character.class} - {character.spec}</div>
                          </div>
                        </div>
                      </td>
                      {tiersToShow.map(tier => {
                        const bestRun = getBestRun(character.id, tier.tier, activeTab);
                        console.log(`RENDER: Matrix cell for char ${character.id}, tier ${tier.tier}, tab ${activeTab}:`, {
                          bestRun: bestRun,
                          hasBestRun: bestRun != null,
                          timeValue: bestRun ? bestRun[activeTab] : 'no run',
                          formattedTime: bestRun ? formatTime(bestRun[activeTab]) : '--'
                        });
                        
                        return (
                          <td 
                            key={`cell-${character.id}-${tier.tier}`} 
                            className={styles.matrixCell}
                          >
                            {bestRun ? (
                              <div className={styles.matrixCellContent}>
                                <div className={styles.matrixTime}>
                                  {(() => {
                                    const timeValue = bestRun[activeTab];
                                    console.log(`DISPLAY: Formatting time value for ${activeTab}:`, {
                                      rawValue: timeValue,
                                      type: typeof timeValue,
                                      formatted: formatTime(timeValue)
                                    });
                                    return timeValue != null ? formatTime(timeValue) : '--';
                                  })()}
                                </div>
                                <div className={styles.matrixDate}>
                                  {new Date(bestRun.dateRun).toLocaleDateString()}
                                </div>
                              </div>
                            ) : (
                              <span className={styles.noRun}>-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeView === 'character' && (
          <div className={styles.characterView}>
            {sortedCharacters.map(character => (
              <div key={`char-section-${character.id}`} className={styles.characterSection}>
                <div className={styles.characterSectionHeader}>
                  <div 
                    className={styles.characterIcon}
                    style={{ 
                      backgroundColor: `${getClassColor(character.class)}20`,
                      color: getClassColor(character.class)
                    }}
                  >
                    {getClassInitial(character.class)}
                  </div>
                  <h3 className={styles.characterSectionTitle}>{character.name} ({character.class} - {character.spec})</h3>
                </div>
                
                <div className={styles.tierCardsGrid}>
                  {sortedTiers.map(tier => {
                    // Get all runs for this character and tier - using loose equality
                    const runs = character.runs.filter(run => run.tier == tier.tier);
                    
                    if (runs.length === 0) return null;
                    
                    // Calculate stats for this character and tier
                    const times = runs.map(run => run[activeTab]).filter(Boolean);
                    
                    if (times.length === 0) return null;
                    
                    const stats = {
                      fastest: Math.min(...times),
                      average: times.reduce((sum, time) => sum + time, 0) / times.length,
                      slowest: Math.max(...times),
                      count: times.length
                    };
                    
                    return (
                      <div key={`char-${character.id}-tier-${tier.tier}`} className={styles.statsTierCard}>
                        <div className={styles.statsTierHeader}>Tier {tier.tier}</div>
                        
                        <div className={styles.statsRow}>
                          <div className={styles.statLabel}>Fastest</div>
                          <div className={`${styles.statValue} ${styles.fastest}`}>
                            {formatTime(stats.fastest)}
                          </div>
                        </div>
                        
                        {stats.count > 1 && (
                          <div className={styles.statsRow}>
                            <div className={styles.statLabel}>Average</div>
                            <div className={`${styles.statValue} ${styles.average}`}>
                              {formatTime(Math.round(stats.average))}
                            </div>
                          </div>
                        )}
                        
                        <div className={styles.statsRow}>
                          <div className={styles.statLabel}>Slowest</div>
                          <div className={`${styles.statValue} ${styles.slowest}`}>
                            {formatTime(stats.slowest)}
                          </div>
                        </div>
                        
                        <div className={styles.runCount}>
                          {stats.count} run{stats.count !== 1 ? 's' : ''}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeView === 'tier' && (
          <div className={styles.tierView}>
            {sortedTiers.map(tier => (
              <div key={`tier-section-${tier.tier}`} className={styles.tierSection}>
                <h3 className={styles.tierSectionTitle}>Tier {tier.tier}</h3>
                
                <div className={styles.characterCardsGrid}>
                  {sortedCharacters.map(character => {
                    // Get all runs for this character and tier - using loose equality
                    const runs = character.runs.filter(run => run.tier == tier.tier);
                    
                    if (runs.length === 0) return null;
                    
                    // Calculate stats for this character and tier
                    const times = runs.map(run => run[activeTab]).filter(Boolean);
                    
                    if (times.length === 0) return null;
                    
                    const stats = {
                      fastest: Math.min(...times),
                      average: times.reduce((sum, time) => sum + time, 0) / times.length,
                      slowest: Math.max(...times),
                      count: times.length
                    };
                    
                    return (
                      <div key={`tier-${tier.tier}-char-${character.id}`} className={styles.statsCard}>
                        <div className={styles.statsHeader}>
                          <div 
                            className={styles.characterIcon}
                            style={{ 
                              backgroundColor: `${getClassColor(character.class)}20`,
                              color: getClassColor(character.class)
                            }}
                          >
                            {getClassInitial(character.class)}
                          </div>
                          <div className={styles.characterInfo}>
                            <div className={styles.characterName}>{character.name}</div>
                            <div className={styles.characterClass}>{character.class} - {character.spec}</div>
                          </div>
                        </div>
                        
                        <div className={styles.statsRow}>
                          <div className={styles.statLabel}>Fastest</div>
                          <div className={`${styles.statValue} ${styles.fastest}`}>
                            {formatTime(stats.fastest)}
                          </div>
                        </div>
                        
                        {stats.count > 1 && (
                          <div className={styles.statsRow}>
                            <div className={styles.statLabel}>Average</div>
                            <div className={`${styles.statValue} ${styles.average}`}>
                              {formatTime(Math.round(stats.average))}
                            </div>
                          </div>
                        )}
                        
                        <div className={styles.statsRow}>
                          <div className={styles.statLabel}>Slowest</div>
                          <div className={`${styles.statValue} ${styles.slowest}`}>
                            {formatTime(stats.slowest)}
                          </div>
                        </div>
                        
                        <div className={styles.runCount}>
                          {stats.count} run{stats.count !== 1 ? 's' : ''}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DelveStats;