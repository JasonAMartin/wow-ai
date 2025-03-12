import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/SiteHeader.module.css';

const SiteHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logoLink}>
              <img src="/images/wow-assistant-logo.png" alt="WoW Assistant" className={styles.logo} />
              <span className={styles.logoText}>WoW Assistant</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className={styles.menuButton} onClick={toggleMenu}>
          <span className={styles.menuIcon}></span>
        </button>

        {/* Navigation */}
        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <div className={styles.navGroup}>
            <h3 className={styles.navTitle}>Character Data</h3>
            <ul className={styles.navList}>
              <li>
                <Link href="/update-character-data" className={styles.navLink}>
                  Update Character
                </Link>
              </li>
              <li>
                <Link href="/update-stats" className={styles.navLink}>
                  Update Stats
                </Link>
              </li>
              <li>
                <Link href="/update-gear" className={styles.navLink}>
                  Update Gear
                </Link>
              </li>
              <li>
                <Link href="/update-talents" className={styles.navLink}>
                  Update Talents
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.navGroup}>
            <h3 className={styles.navTitle}>Inventory</h3>
            <ul className={styles.navList}>
              <li>
                <Link href="/update-inventory" className={styles.navLink}>
                  Update Inventory
                </Link>
              </li>
              <li>
                <Link href="/get-inventory" className={styles.navLink}>
                  View Inventory
                </Link>
              </li>
              <li>
                <Link href="/update-currency" className={styles.navLink}>
                  Update Currency
                </Link>
              </li>
              <li>
                <Link href="/get-currency" className={styles.navLink}>
                  View Currency
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.navGroup}>
            <h3 className={styles.navTitle}>Delves & Curios</h3>
            <ul className={styles.navList}>
              <li>
                <Link href="/add-delve-run" className={styles.navLink}>
                  Add Delve Run
                </Link>
              </li>
              <li>
                <Link href="/view-delve-runs" className={styles.navLink}>
                  View Delve Runs
                </Link>
              </li>
              <li>
                <Link href="/update-curios" className={styles.navLink}>
                  Update Curios
                </Link>
              </li>
              <li>
                <Link href="/get-curios" className={styles.navLink}>
                  View Curios
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.navGroup}>
            <h3 className={styles.navTitle}>AI Context</h3>
            <ul className={styles.navList}>
              <li>
                <Link href="/store-ai-context" className={styles.navLink}>
                  Store AI Context
                </Link>
              </li>
              <li>
                <Link href="/get-latest-ai-context" className={styles.navLink}>
                  Get Latest AI Context
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Character profile button */}
        <div className={styles.profileContainer}>
          <button className={styles.profileButton}>
            <img src="/images/character-avatar.png" alt="Character" className={styles.profileImage} />
            <span className={styles.profileText}>My Character</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;