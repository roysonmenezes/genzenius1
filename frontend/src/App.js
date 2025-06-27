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
    setAudioUrl('');
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
    <div style={{
      background: 'linear-gradient(120deg, #1e1e1e, #4b2c20)',
      minHeight: '100vh',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      padding: '40px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#f7c08a' }}>🧠 Genzenius</h1>

        {/* Prompt input + Generate button */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10%', marginBottom: '10px' }}>
          <input
            type="text"
            value={prompt}
            onChange={handleInputChange}
            placeholder="Type your prompt, e.g., Explain photosynthesis"
            style={{
              width: '80%',
              height: '50px',
              fontSize: '20px',
              padding: '10px',
              borderRadius: '8px',
              border: '2px solid #f7c08a',
              background: '#2b2b2b',
              color: 'white'
            }}
          />
          <button
            onClick={handleGenerate}
            style={{
              fontSize: '18px',
              marginLeft: '10px',
              padding: '12px 20px',
              background: '#f7c08a',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#000'
            }}
          >
            Generate
          </button>
        </div>

        {/* Language dropdown just below */}
        <div style={{ marginBottom: '20px', marginLeft: '10%' }}>
          <label style={{ fontSize: '18px', color: '#fff', marginRight: '10px' }}>
          
          </label>
          <select
            value={language}
            onChange={handleLanguageChange}
            style={{
              fontSize: '18px',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '2px solid #f7c08a',
              backgroundColor: '#2b2b2b',
              color: '#fff',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="en">English</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
            <option value="ml">മലയാളം (Malayalam)</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="gu">ગુજરાતી (Gujarati)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            <option value="ur">اردو (Urdu)</option>
            {/* Add more as needed */}
          </select>
        </div>

        {/* Output box */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '30px',
          marginLeft: '2%'
        }}>
          <div
            style={{
              width: '80%',
              maxHeight: '300px',
              overflowY: 'scroll',
              border: '2px solid #f7c08a',
              borderRadius: '12px',
              padding: '20px',
              background: '#3c3c3c',
              fontSize: '18px',
              textAlign: 'left',
              whiteSpace: 'pre-wrap',
              color: '#f1f1f1'
            }}
          >
            {result}
          </div>
        </div>

        {/* Voice Output */}
        {audioUrl && (
          <div style={{ marginTop: '25px', textAlign: 'center' }}>
            <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>🔊 Voice Output</p>
            <audio controls src={audioUrl} style={{ width: '80%' }}></audio>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
