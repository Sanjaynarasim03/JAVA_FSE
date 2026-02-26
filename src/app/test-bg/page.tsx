'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function TestImage() {
  const checkBackground = () => {
    const bg = getComputedStyle(document.body).backgroundImage;
    alert(`Body background-image: ${bg}`);
  };

  return (
    <div style={{ padding: '2rem', background: 'white', margin: '2rem', borderRadius: '8px', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '1rem', fontSize: '24px', fontWeight: 'bold' }}>Background Image Test</h1>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '0.5rem' }}>Direct Image Test:</h2>
        <Image 
          src="/360_F_203669387_m7IvXlkV0FQwA69Xpt8AwlAdO5Ih05Mc.jpg" 
          alt="bg-test" 
          width={400}
          height={300}
          style={{ width: '100%', maxWidth: 400, border: '2px solid #333', borderRadius: '4px' }} 
        />
        <p style={{ marginTop: '0.5rem', fontSize: '14px', color: '#22c55e' }}>
          ✅ Image loaded successfully if visible above
        </p>
      </div>

      <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f3f4f6', borderRadius: '4px' }}>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '0.5rem' }}>
          <strong>Image path:</strong> /360_F_203669387_m7IvXlkV0FQwA69Xpt8AwlAdO5Ih05Mc.jpg
        </p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          If you see the image above, the file path is correct. Check the main page for CSS issues.
        </p>
      </div>

      <button 
        onClick={checkBackground}
        style={{ 
          marginTop: '1rem', 
          padding: '0.75rem 1.5rem', 
          background: '#3b82f6', 
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600'
        }}
      >
        🔍 Check Body Background CSS
      </button>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#fef3c7', borderRadius: '4px', border: '1px solid #f59e0b' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '0.5rem', color: '#92400e' }}>
          Troubleshooting Tips:
        </h3>
        <ul style={{ marginLeft: '1.5rem', fontSize: '14px', color: '#78350f' }}>
          <li>Click the button above to see the computed CSS</li>
          <li>Open DevTools → Network tab → reload to check if image loads (200 status)</li>
          <li><Link href="/" style={{ color: '#2563eb', textDecoration: 'underline' }}>Go back to home</Link></li>
          <li>If background not visible, check for elements with opaque backgrounds</li>
        </ul>
      </div>
    </div>
  );
}
