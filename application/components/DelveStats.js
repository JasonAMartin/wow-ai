import React, { useState } from 'react';
import TimeStats from './TimeStats';
import styles from '../styles/ViewDelveRuns.module.css';

const DelveStats = ({ delve }) => {
  const [activeTab, setActiveTab] = useState('bossKill');
  const [activeView, setActiveView] = useState('character');
  
  if (!delve) return null;
  
  const { name, zone, characters, tiers } = delve;
  
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
        
        <div style={{ flex: 1 }}></div>
        
        <div 
          className={`${styles.tab} ${activeView === 'character' ? styles.tabActive : ''}`}
          onClick={() => setActiveView('character')}
        >
          By Character
        </div>
        <div 
          className={`${styles.tab} ${activeView === 'tier' ? styles.tabActive : ''}`}
          onClick={() => setActiveView('tier')}
        >
          By Tier
        </div>
      </div>
      
      <div className={styles.statsContent}>
        {activeView === 'character' ? (
          <TimeStats 
            data={characters} 
            title={`${activeTab === 'bossKill' ? 'Boss Kill' : 'Total Run'} Times by Character`}
            filterBy="character"
            timeType={activeTab}
          />
        ) : (
          <TimeStats 
            data={tiers} 
            title={`${activeTab === 'bossKill' ? 'Boss Kill' : 'Total Run'} Times by Tier`}
            filterBy="tier"
            timeType={activeTab}
          />
        )}
      </div>
    </div>
  );
};

export default DelveStats;