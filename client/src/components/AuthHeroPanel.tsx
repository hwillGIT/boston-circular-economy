/**
 * Hero panel displayed on the left side of the authentication page.
 */
export function AuthHeroPanel() {
  return (
    <div className="auth-hero">
      <div className="auth-hero-content">
        <div className="auth-hero-icon">🌿</div>
        <h1>
          Don't toss it.
          <br />
          <span className="highlight">Fix it. Share it. Swap it.</span>
        </h1>
        <p className="auth-hero-subtitle">
          Join Boston's circular economy community. Find repair shops, donation centers, and swap
          events — track your impact and earn credits for keeping stuff out of the landfill.
        </p>
        <div className="auth-hero-stats">
          <div className="auth-hero-stat">
            <span className="auth-hero-stat-value">12,450</span>
            <span className="auth-hero-stat-label">lbs diverted</span>
          </div>
          <div className="auth-hero-stat">
            <span className="auth-hero-stat-value">3,100+</span>
            <span className="auth-hero-stat-label">residents</span>
          </div>
          <div className="auth-hero-stat">
            <span className="auth-hero-stat-value">154</span>
            <span className="auth-hero-stat-label">locations</span>
          </div>
        </div>
      </div>
    </div>
  );
}
