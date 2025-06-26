import React, { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [language, setLanguage] = useState('en');

  const handleInputChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleGenerate = async () => {
  setResult("Generating...");
  try {
    const response = await fetch('http://localhost:8000/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, language }),  // include language
    });
    const data = await response.json();
    if (data.result) {
      setResult(data.result);
    } else {
      setResult(data.error || "Error generating text.");
    }
  } catch (error) {
    setResult("Failed to connect to backend.");
  }
};


  return (
    <div className="App">
      <h2>Text Generation</h2>
      <label>
        Language:&nbsp;
        <select value={language} onChange={handleLanguageChange} style={{ fontSize: '18px' }}>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          {/* Add more languages as needed */}
        </select>
      </label>
      <br /><br />
      <input
        type="text"
        value={prompt}
        onChange={handleInputChange}
        placeholder="Type your prompt, e.g., explain photosynthesis"
        style={{ width: '700px', height: '50px', fontSize: '20px' }}
      />
      <button onClick={handleGenerate} style={{ fontSize: '18px', marginLeft: '10px' }}>
        Generate
      </button>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px'
        }}
      >
        <div
          style={{
            width: '700px',
            maxHeight: '250px',
            overflowY: 'scroll',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            background: '#fafafa',
            fontSize: '18px',
            textAlign: 'center'
          }}
        >
          {result && <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>{result}</pre>}
        </div>
      </div>
    </div>
  );
}

export default App;