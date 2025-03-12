import React from 'react';
import styles from '../styles/ViewDelveRuns.module.css';

// Helper function to format seconds to MM:SS
const formatTime = (seconds) => {
  if (!seconds && seconds !== 0) return '--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
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
  
  return classColors[characterClass] || '#F8B700'; // Default to gold accent color
};

// Get first letter of character class for icon
const getClassInitial = (characterClass) => {
  return characterClass ? characterClass.charAt(0) : 'C';
};

const TimeStats = ({ 
  data, 
  title,
  filterBy = 'character',  // 'character' or 'tier'
  timeType = 'bossKill'    // 'bossKill' or 'totalTime'
}) => {
  // If no data or empty data, show empty state
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className={styles.emptyState}>
        No data available for {title}
      </div>
    );
  }
  
  const items = Object.values(data);
  
  return (
    <div>
      <h3 className={styles.statsSectionTitle}>{title}</h3>
      <div className={styles.statsGrid}>
        {items.map((item) => {
          // Check if the item has stats for the given timeType
          if (!item.stats || !item.stats[timeType]) {
            return null;
          }
          
          const stats = item.stats[timeType];
          const hasMultipleRuns = item.runs && item.runs.length > 1;
          
          return (
            <div key={filterBy === 'character' ? item.id : `tier-${item.tier}`} className={styles.statsCard}>
              <div className={styles.statsHeader}>
                {filterBy === 'character' ? (
                  <>
                    <div 
                      className={styles.characterIcon}
                      style={{ 
                        backgroundColor: `${getClassColor(item.class)}20`,
                        color: getClassColor(item.class)
                      }}
                    >
                      {getClassInitial(item.class)}
                    </div>
                    <div className={styles.characterInfo}>
                      <div className={styles.characterName}>{item.name}</div>
                      <div className={styles.characterClass}>{item.class} - {item.spec}</div>
                    </div>
                  </>
                ) : (
                  <div className={styles.characterInfo}>
                    <div className={styles.characterName}>Tier {item.tier}</div>
                    <div className={styles.characterClass}>Difficulty Level {item.tier}</div>
                  </div>
                )}
              </div>
              
              <div className={styles.statsRow}>
                <div className={styles.statLabel}>Fastest</div>
                <div className={`${styles.statValue} ${styles.fastest}`}>
                  {formatTime(stats.fastest)}
                </div>
              </div>
              
              {hasMultipleRuns && (
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
                {item.runs.length} run{item.runs.length !== 1 ? 's' : ''} completed
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimeStats;