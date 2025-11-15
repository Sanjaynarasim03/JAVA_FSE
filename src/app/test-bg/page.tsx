export default function TestImage() {
  return (
    <div style={{ padding: '2rem', background: 'white', margin: '2rem', borderRadius: '8px' }}>
      <h1 style={{ marginBottom: '1rem' }}>Background Image Test</h1>
      <img 
        src="/360_F_203669387_m7IvXlkV0FQwA69Xpt8AwlAdO5Ih05Mc.jpg" 
        alt="bg-test" 
        style={{ width: 400, border: '2px solid #333' }} 
      />
      <p style={{ marginTop: '1rem' }}>✅ Image loaded successfully if visible above</p>
      <p style={{ marginTop: '0.5rem', fontSize: '14px', color: '#666' }}>
        If you see the image, the file path is correct. Check the main page for CSS issues.
      </p>
      <button 
        onClick={() => {
          const bg = getComputedStyle(document.body).backgroundImage;
          alert(`Body background-image: ${bg}`);
        }}
        style={{ 
          marginTop: '1rem', 
          padding: '0.5rem 1rem', 
          background: '#3b82f6', 
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Check Body Background CSS
      </button>
    </div>
  );
}
