export default function Footer() {
  return (
    <footer className="modern-footer">
      <div className="footer-content">
        <h2 className="logo-text" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>BuyMe</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '400px', margin: '0 auto 2rem' }}>
          Your premium destination for the finest products since 2024. Quality and elegance in every purchase.
        </p>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
          <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>
            &copy; 2025 BuyMe Marketplace. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}