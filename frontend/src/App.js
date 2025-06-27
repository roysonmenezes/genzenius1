import React, { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [language, setLanguage] = useState('en');
  const [audioUrl, setAudioUrl] = useState('');

  const handleInputChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleGenerate = async () => {
    setResult("Generating...");
    setAudioUrl(""); // Clear previous audio
    try {
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language }),
      });
      const data = await response.json();
      if (data.result) {
        setResult(data.result);
        if (data.audio_url) {
          setAudioUrl(data.audio_url);
        }
      } else {
        setResult(data.error || "Error generating text.");
      }
    } catch (error) {
      setResult("Failed to connect to backend.");
    }
  };

  return (
    <div className="App">
      <h2>Genzenius</h2>
      <label>
        Language:&nbsp;
        <select value={language} onChange={handleLanguageChange} style={{ fontSize: '18px' }}>
          <option value="en">English</option>
          <option value="ta">தமிழ் (Tamil)</option>
          <option value="kn">ಕನ್ನಡ (Kannada)</option>
          <option value="ml">മലയാളം (Malayalam)</option>
          <option value="bn">বাংলা (Bengali)</option>
          <option value="gu">ગુજરાતી (Gujarati)</option>
          <option value="mr">मराठी (Marathi)</option>
          <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
          <option value="ur">اردو (Urdu)</option>
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

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
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
          {result && (
            <>
              <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>{result}</pre>
              {audioUrl && (
                <div style={{ marginTop: '20px' }}>
                  <audio controls src={audioUrl}></audio>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
