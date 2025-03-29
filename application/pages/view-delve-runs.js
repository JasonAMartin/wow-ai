import { useState, useEffect } from 'react';
import SiteHeader from '../components/SiteHeader';
import DelveStats from '../components/DelveStats';
import styles from '../styles/ViewDelveRuns.module.css';

export default function ViewDelveRuns() {
  const [runsData, setRunsData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Process raw delve runs data to get stats
  const processDelveRunData = (runs) => {
    if (!runs || !Array.isArray(runs) || runs.length === 0) return [];
    
    // First, group runs by delve
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
          characters: {},
          tiers: {}
        };
      }
      
      // Group by character
      const charId = run.characters_id;
      if (run.character) {
        const charName = run.character.name;
        const charClass = run.character.class;
        const charSpec = run.character.spec;
        
        if (!delveGroups[delveId].characters[charId]) {
          delveGroups[delveId].characters[charId] = {
            id: charId,
            name: charName,
            class: charClass,
            spec: charSpec,
            runs: [],
            bossKillTimes: [],
            totalTimes: []
          };
        }
        
        delveGroups[delveId].characters[charId].runs.push(run);
        
        // Ensure we're working with numbers for time values - using loose comparisons
        if (run.bossKillTime != null) {
          const bossKillTime = Number(run.bossKillTime);
          if (!isNaN(bossKillTime)) {
            delveGroups[delveId].characters[charId].bossKillTimes.push(bossKillTime);
          } else {
            console.warn(`Invalid bossKillTime for run ${run.id}: ${run.bossKillTime}`);
          }
        }
        
        if (run.totalTime != null) {
          const totalTime = Number(run.totalTime);
          if (!isNaN(totalTime)) {
            delveGroups[delveId].characters[charId].totalTimes.push(totalTime);
          } else {
            console.warn(`Invalid totalTime for run ${run.id}: ${run.totalTime}`);
          }
        }
        
        // Debug log to verify run data
        console.log(`Added run for character ${charId} in delve ${delveId}:`, {
          tier: run.tier,
          bossKillTime: run.bossKillTime,
          totalTime: run.totalTime
        });
      }
      
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
      
      // Ensure we're working with numbers for time values - using loose comparisons
      if (run.bossKillTime != null) {
        const bossKillTime = Number(run.bossKillTime);
        if (!isNaN(bossKillTime)) {
          delveGroups[delveId].tiers[tier].bossKillTimes.push(bossKillTime);
        }
      }
      
      if (run.totalTime != null) {
        const totalTime = Number(run.totalTime);
        if (!isNaN(totalTime)) {
          delveGroups[delveId].tiers[tier].totalTimes.push(totalTime);
        }
      }
    });
    
    // Calculate stats for each character and tier
    Object.values(delveGroups).forEach(delve => {
      // Character stats
      Object.values(delve.characters).forEach(char => {
        const bossKillTimes = char.bossKillTimes;
        const totalTimes = char.totalTimes;
        
        if (bossKillTimes.length > 0) {
          char.stats = {
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
            runCount: char.runs.length
          };
        } else {
          char.stats = {
            bossKill: { fastest: null, slowest: null, average: null },
            totalTime: { fastest: null, slowest: null, average: null },
            runCount: 0
          };
        }
      });
      
      // Tier stats
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
    
    // Add debug logging
    console.log('Processed Delve Data:', Object.values(delveGroups));
    
    return Object.values(delveGroups);
  };

  useEffect(() => {
    // Fetch delve runs data from the API endpoint
    const fetchRuns = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/delve-run/get');
        
        if (!res.ok) {
          throw new Error(`Error fetching delve runs: ${res.status}`);
        }
        
        const data = await res.json();
        
        // Log the raw data
        console.log('Raw Delve Run Data:', data.runs);
        
        setRunsData(data.runs || []);
        
        // Process the data for stats display
        const processed = processDelveRunData(data.runs || []);
        setProcessedData(processed);
        
        // Extra debugging to verify key time fields
        if (data.runs && data.runs.length > 0) {
          console.log('VERIFY DATA STRUCTURE - PROPERTY NAMES:');
          console.log('Available properties on run objects:', Object.keys(data.runs[0]));
          console.log('IMPORTANT: The time properties are named "bossKillTime" and "totalTime"');
          
          data.runs.slice(0, 3).forEach((run, i) => {
            console.log(`Run ${i}:`, {
              id: run.id,
              tier: run.tier,
              char: run.characters_id,
              bossKillTime: {
                value: run.bossKillTime,
                type: typeof run.bossKillTime,
                isNull: run.bossKillTime === null,
                isUndefined: run.bossKillTime === undefined,
              },
              totalTime: {
                value: run.totalTime,
                type: typeof run.totalTime,
                isNull: run.totalTime === null,
                isUndefined: run.totalTime === undefined,
              }
            });
          });
        }
      } catch (err) {
        console.error('Error fetching delve runs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRuns();
  }, []);

  return (
    <>
      <SiteHeader />
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <h1 className={styles.title}>View Delve Runs</h1>
          
          {loading ? (
            <div className={styles.loading}>Loading delve run data...</div>
          ) : error ? (
            <div className={styles.error}>Error loading data: {error}</div>
          ) : processedData.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No delve runs found. Add some runs to see statistics.</p>
            </div>
          ) : (
            <div className={styles.statsSection}>
              {processedData.map(delve => (
                <DelveStats key={delve.id} delve={delve} />
              ))}
            </div>
          )}
          
          {/* JSON Data Display (helpful for debugging) */}
          {!loading && runsData.length > 0 && (
            <div className={styles.jsonSection}>
              <h2 className={styles.jsonTitle}>Raw Delve Run Data (JSON)</h2>
              <textarea
                readOnly
                value={JSON.stringify(runsData, null, 2)}
                className={styles.jsonTextarea}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}