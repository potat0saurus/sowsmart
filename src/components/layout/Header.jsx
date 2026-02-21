import { Link } from 'react-router-dom'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>🌱</span>
          <span className={styles.logoText}>SowSmart</span>
        </Link>
        <p className={styles.tagline}>Square foot garden planner</p>
      </div>
    </header>
  )
}
