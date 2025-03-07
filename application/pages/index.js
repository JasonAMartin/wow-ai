import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
        <h1 className={styles.title}>WoW Assistant Home</h1>
        <ul className={styles.list}>
        <li>
        <Link href="/update-character-data" className={styles.link}>
            Update Character Data
          </Link>
          </li>
          <li>
          <Link href="/add-delve-run" className={styles.link}>
            Add Delve Run
          </Link>
        </li>
        <li>
          <Link href="/get-delve-runs" className={styles.link}>
            Get Delve Runs
          </Link>
        </li>
        <li>
          <Link href="/update-inventory" className={styles.link}>
            Update Inventory
          </Link>
        </li>
        <li>
          <Link href="/update-talents" className={styles.link}>
            Update Talents
          </Link>
        </li>
        <li>
          <Link href="/update-currency" className={styles.link}>
            Update Currency
          </Link>
        </li>
        <li>
          <Link href="/update-curios" className={styles.link}>
            Update Curios
          </Link>
        </li>
        <li>
          <Link href="/update-stats" className={styles.link}>
            Update Stats
          </Link>
        </li>
        <li>
          <Link href="/update-gear" className={styles.link}>
            Update Gear
          </Link>
        </li>
        <li>
          <Link href="/get-inventory" className={styles.link}>
            Get Inventory
          </Link>
        </li>
        <li>
          <Link href="/get-talents" className={styles.link}>
            Get Talents
          </Link>
        </li>
        <li>
          <Link href="/get-currency" className={styles.link}>
            Get Currency
          </Link>
        </li>
        <li>
          <Link href="/get-curios" className={styles.link}>
            Get Curios
          </Link>
        </li>
        <li>
          <Link href="/get-stats" className={styles.link}>
            Get Stats
          </Link>
        </li>
        <li>
          <Link href="/get-gear" className={styles.link}>
            Get Gear
          </Link>
        </li>
        <li>
          <Link href="/store-ai-context" className={styles.link}>
            Store AI Context
          </Link>
        </li>
        <li>
          <Link href="/get-latest-ai-context" className={styles.link}>
            Get Latest AI Context
          </Link>
        </li>
      </ul>
    </div>
  );
}
