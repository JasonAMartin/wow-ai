import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SiteHeader from '../../components/SiteHeader';
import styles from '../../styles/ViewDelveRuns.module.css';

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
  
  return classColors[characterClass] || '#F8B700'; // Default to gold
};

// Get first letter of character class for icon
const getClassInitial = (characterClass) => {
  return characterClass ? characterClass.charAt(0) : 'C';
};

export default function CharacterDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [character, setCharacter] = useState(null);
  const [delveData, setDelveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('bossKill');
  
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Fetch character details
        const characterRes = await fetch(`/api/characters/${id}`);
        
        if (!characterRes.ok) {
          throw new Error(`Error fetching character: ${characterRes.status}`);
        }
        
        const characterData = await characterRes.json();
        setCharacter(characterData.character);
        
        // Fetch delve runs for this character
        const runsRes = await fetch(`/api/delve-run/get?characterId=${id}`);
        
        if (!runsRes.ok) {
          throw new Error(`Error fetching delve runs: ${runsRes.status}`);
        }
        
        const runsData = await runsRes.json();
        
        // Process the data by delve and tier
        const processedData = processDelveRunData(runsData.runs || []);
        setDelveData(processedData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  // Process raw delve runs data to get stats
  const processDelveRunData = (runs) => {
    if (!runs || runs.length === 0) return [];
    
    // Group runs by delve
    const delveGroups = {};
    
    runs.forEach(run => {
      const delveId = run.delves_id;
      const delveName = run.delve?.name || `Delve ID: ${delveId}`;
      const delveZone = run.delve?.zone || '';
      
      if (!delveGroups[delveId]) {
        delveGroups[delveId] = {
          id: delveId,
          name: delveName,
          zone: delveZone,
          runs: [],
          tiers: {}
        };
      }
      
      delveGroups[delveId].runs.push(run);
      
      // Group by tier
      const tier = run.tier;
      
      if (!delveGroups[delveId].tiers[tier]) {
        delveGroups[delveId].tiers[tier] = {
          tier: tier,
          runs: [],
          bossKillTimes: [],
          totalTimes: []
        };
      }
      
      delveGroups[delveId].tiers[tier].runs.push(run);
      
      if (run.bossKillTime) {
        delveGroups[delveId].tiers[tier].bossKillTimes.push(run.bossKillTime);
      }
      
      if (run.totalTime) {
        delveGroups[delveId].tiers[tier].totalTimes.push(run.totalTime);
      }
    });
    
    // Calculate stats for each tier
    Object.values(delveGroups).forEach(delve => {
      Object.values(delve.tiers).forEach(tier => {
        const bossKillTimes = tier.bossKillTimes;
        const totalTimes = tier.totalTimes;
        
        if (bossKillTimes.length > 0) {
          tier.stats = {
            bossKill: {
              fastest: Math.min(...bossKillTimes),
              slowest: Math.max(...bossKillTimes),
              average: bossKillTimes.reduce((sum, time) => sum + time, 0) / bossKillTimes.length
            },
            totalTime: {
              fastest: Math.min(...totalTimes),
              slowest: Math.max(...totalTimes),
              average: totalTimes.reduce((sum, time) => sum + time, 0) / totalTimes.length
            },
            runCount: tier.runs.length
          };
        } else {
          tier.stats = {
            bossKill: { fastest: null, slowest: null, average: null },
            totalTime: { fastest: null, slowest: null, average: null },
            runCount: 0
          };
        }
      });
    });
    
    return Object.values(delveGroups);
  };
  
  if (loading) {
    return (
      <>
        <SiteHeader />
        <div className={styles.container}>
          <div className={styles.loading}>Loading character data...</div>
        </div>
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <SiteHeader />
        <div className={styles.container}>
          <div className={styles.error}>Error: {error}</div>
          <Link href="/view-delve-runs" className={styles.backLink}>
            Back to Delve Runs
          </Link>
        </div>
      </>
    );
  }
  
  if (!character) {
    return (
      <>
        <SiteHeader />
        <div className={styles.container}>
          <div className={styles.error}>Character not found</div>
          <Link href="/view-delve-runs" className={styles.backLink}>
            Back to Delve Runs
          </Link>
        </div>
      </>
    );
  }
  
  return (
    <>
      <SiteHeader />
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          {/* Character Header */}
          <div className={styles.characterDetailHeader}>
            <div 
              className={styles.characterDetailIcon}
              style={{ 
                backgroundColor: `${getClassColor(character.class)}20`,
                color: getClassColor(character.class)
              }}
            >
              {getClassInitial(character.class)}
            </div>
            <div className={styles.characterDetailInfo}>
              <h1 className={styles.characterDetailName}>{character.name}</h1>
              <div className={styles.characterDetailClass}>
                {character.class} - {character.spec}
              </div>
              <div className={styles.characterDetailStats}>
                <div className={styles.characterDetailStat}>
                  <div className={styles.statValue}>{character.overall_item_level || '--'}</div>
                  <div className={styles.statLabel}>Item Level</div>
                </div>
                <div className={styles.characterDetailStat}>
                  <div className={styles.statValue}>{delveData.length}</div>
                  <div className={styles.statLabel}>Delves</div>
                </div>
                <div className={styles.characterDetailStat}>
                  <div className={styles.statValue}>
                    {delveData.reduce((total, delve) => total + delve.runs.length, 0)}
                  </div>
                  <div className={styles.statLabel}>Total Runs</div>
                </div>
              </div>
            </div>
            <div className={styles.backLinkContainer}>
              <Link href="/view-delve-runs" className={styles.backLink}>
                Back to All Delves
              </Link>
            </div>
          </div>
          
          {/* Tabs */}
          <div className={styles.tabsContainer}>
            <div 
              className={`${styles.tab} ${activeTab === 'bossKill' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('bossKill')}
            >
              Boss Kill Time
            </div>
            <div 
              className={`${styles.tab} ${activeTab === 'totalTime' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('totalTime')}
            >
              Total Run Time
            </div>
          </div>
          
          {/* Delve Data */}
          {delveData.length === 0 ? (
            <div className={styles.emptyState}>
              No delve runs found for this character
            </div>
          ) : (
            <div className={styles.characterDelves}>
              {delveData.map(delve => (
                <div key={delve.id} className={styles.delveCard}>
                  <div className={styles.delveHeader}>
                    <div>
                      <h2 className={styles.delveName}>{delve.name}</h2>
                      {delve.zone && <div className={styles.delveZone}>{delve.zone}</div>}
                    </div>
                    <div className={styles.delveRunCount}>
                      {delve.runs.length} run{delve.runs.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className={styles.statsContent}>
                    <div className={styles.tierCardsGrid}>
                      {Object.values(delve.tiers)
                        .sort((a, b) => a.tier - b.tier)
                        .map(tier => {
                          const stats = tier.stats[activeTab];
                          
                          return (
                            <div key={`tier-${tier.tier}`} className={styles.statsTierCard}>
                              <div className={styles.statsTierHeader}>Tier {tier.tier}</div>
                              
                              <div className={styles.statsRow}>
                                <div className={styles.statLabel}>Fastest</div>
                                <div className={`${styles.statValue} ${styles.fastest}`}>
                                  {formatTime(stats.fastest)}
                                </div>
                              </div>
                              
                              {tier.runs.length > 1 && (
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
                                {tier.runs.length} run{tier.runs.length !== 1 ? 's' : ''}
                              </div>
                              
                              <div className={styles.lastRunDate}>
                                Last run: {new Date(tier.runs[0].dateRun).toLocaleDateString()}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SiteHeader from '../../components/SiteHeader';
import styles from '../../styles/ViewDelveRuns.module.css';

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
  
  return classColors[characterClass] || '#F8B700'; // Default to gold
};

// Get first letter of character class for icon
const getClassInitial = (characterClass) => {
  return characterClass ? characterClass.charAt(0) : 'C';
};

export default function CharacterDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [character, setCharacter] = useState(null);
  const [delveData, setDelveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('bossKill');
  
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Fetch character details
        const characterRes = await fetch(`/api/characters/${id}`);
        
        if (!characterRes.ok) {
          throw new Error(`Error fetching character: ${characterRes.status}`);
        }
        
        const characterData = await characterRes.json();
        setCharacter(characterData.character);
        
        // Fetch delve runs for this character
        const runsRes = await fetch(`/api/delve-run/get?characterId=${id}`);
        
        if (!runsRes.ok) {
          throw new Error(`Error fetching delve runs: ${runsRes.status}`);
        }
        
        const runsData = await runsRes.json();
        
        // Process the data by delve and tier
        const processedData = processDelveRunData(runsData.runs || []);
        setDelveData(processedData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  // Process raw delve runs data to get stats
  const processDelveRunData = (runs) => {
    if (!runs || runs.length === 0) return [];
    
    // Group runs by delve
    const delveGroups = {};
    
    runs.forEach(run => {
      const delveId = run.delves_id;
      const delveName = run.delve?.name || `Delve ID: ${delveId}`;
      const delveZone = run.delve?.zone || '';
      
      if (!delveGroups[delveId]) {
        delveGroups[delveId] = {
          id: delveId,
          name: delveName,
          zone: delveZone,
          runs: [],
          tiers: {}