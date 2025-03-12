import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import SiteHeader from '../components/SiteHeader';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>WoW Assistant - Track Your World of Warcraft Progress</title>
        <meta name="description" content="Track your World of Warcraft character progress, delve runs, inventory, and more" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <SiteHeader />
      
      <main className={styles.mainContent}>
        <div className={styles.heroSection}>
          <div className={styles.container}>
            <h1 className={styles.title}>WoW Assistant</h1>
            <p className={styles.subtitle}>Track your World of Warcraft journey with precision</p>
            
            <div className={styles.heroButtons}>
              <Link href="/update-character-data" className={styles.primaryButton}>
                Update Character
              </Link>
              <Link href="/add-delve-run" className={styles.secondaryButton}>
                Add Delve Run
              </Link>
            </div>
          </div>
        </div>
        
        <div className={styles.container}>
          <div className={styles.featuresSection}>
            <h2 className={styles.sectionTitle}>Features</h2>
            
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <img src="/images/character-icon.png" alt="Character" />
                </div>
                <h3>Character Management</h3>
                <p>Track stats, gear, talents and more for your WoW characters</p>
                <Link href="/update-character-data" className={styles.featureLink}>
                  Manage Character
                </Link>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <img src="/images/delve-icon.png" alt="Delves" />
                </div>
                <h3>Delve Tracking</h3>
                <p>Record and analyze your Delve runs with detailed statistics</p>
                <Link href="/add-delve-run" className={styles.featureLink}>
                  Track Delves
                </Link>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <img src="/images/inventory-icon.png" alt="Inventory" />
                </div>
                <h3>Inventory Management</h3>
                <p>Keep track of your items, currency, and collected curios</p>
                <Link href="/update-inventory" className={styles.featureLink}>
                  Manage Inventory
                </Link>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <img src="/images/ai-icon.png" alt="AI" />
                </div>
                <h3>AI Context Saving</h3>
                <p>Store important context for future AI-assisted gameplay</p>
                <Link href="/store-ai-context" className={styles.featureLink}>
                  Manage AI Context
                </Link>
              </div>
            </div>
          </div>
          
          <div className={styles.quickAccessSection}>
            <h2 className={styles.sectionTitle}>Quick Access</h2>
            
            <div className={styles.quickAccessGrid}>
              <div className={styles.quickAccessColumn}>
                <h3 className={styles.columnTitle}>Character</h3>
                <ul className={styles.quickAccessList}>
                  <li>
                    <Link href="/update-character-data" className={styles.listLink}>
                      Update Character Data
                    </Link>
                  </li>
                  <li>
                    <Link href="/update-stats" className={styles.listLink}>
                      Update Stats
                    </Link>
                  </li>
                  <li>
                    <Link href="/update-gear" className={styles.listLink}>
                      Update Gear
                    </Link>
                  </li>
                  <li>
                    <Link href="/update-talents" className={styles.listLink}>
                      Update Talents
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className={styles.quickAccessColumn}>
                <h3 className={styles.columnTitle}>Delves</h3>
                <ul className={styles.quickAccessList}>
                  <li>
                    <Link href="/add-delve-run" className={styles.listLink}>
                      Add Delve Run
                    </Link>
                  </li>
                  <li>
                    <Link href="/view-delve-runs" className={styles.listLink}>
                      View Delve Runs
                    </Link>
                  </li>
                  <li>
                    <Link href="/update-curios" className={styles.listLink}>
                      Update Curios
                    </Link>
                  </li>
                  <li>
                    <Link href="/get-curios" className={styles.listLink}>
                      View Curios
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className={styles.quickAccessColumn}>
                <h3 className={styles.columnTitle}>Inventory</h3>
                <ul className={styles.quickAccessList}>
                  <li>
                    <Link href="/update-inventory" className={styles.listLink}>
                      Update Inventory
                    </Link>
                  </li>
                  <li>
                    <Link href="/get-inventory" className={styles.listLink}>
                      View Inventory
                    </Link>
                  </li>
                  <li>
                    <Link href="/update-currency" className={styles.listLink}>
                      Update Currency
                    </Link>
                  </li>
                  <li>
                    <Link href="/get-currency" className={styles.listLink}>
                      View Currency
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <p>WoW Assistant - Your personal World of Warcraft companion</p>
            <p className={styles.disclaimer}>Not affiliated with Blizzard Entertainment</p>
          </div>
        </div>
      </footer>
    </>
  );
}