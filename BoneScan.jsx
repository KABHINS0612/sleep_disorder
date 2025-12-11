import React, { useState } from 'react';
import './BoneScan.css';

const BoneScan = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [solution, setSolution] = useState('');
  const [problems, setProblems] = useState([]);
  const [result, setResult] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
    setSolution('');
    setProblems([]);
    setResult('');
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setSolution('');
    setProblems([]);
    setResult('');
    try {
      const formData = new FormData();
      formData.append('body_scan', selectedFile);
      const response = await fetch('http://127.0.0.1:5000/body_scan_upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.solution && data.problems) {
        setSolution(data.solution);
        setProblems(data.problems);
      } else if (data.result) {
        setResult(data.result);
      } else {
        setResult('No recognizable response.');
      }
    } catch (err) {
      setSolution('Error analyzing image.');
      setProblems([]);
    }
    setIsUploading(false);
  };

  return (
    <div className="body-scan-wrapper">
      <h2>Bone Scan</h2>
      <div className="scan-upload">
        <h4>Upload your bone scan for analysis:</h4>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {previewUrl && <img src={previewUrl} alt="Preview" className="body-scan-preview" />}
        <button onClick={handleUpload} disabled={!selectedFile || isUploading} style={{marginTop: '1rem'}}>Analyze</button>
        {isUploading && <p>Analyzing...</p>}
        {(solution || problems.length > 0) && (
          <div className="upload-result detail-result">
            <div><b>Solution:</b> {solution}</div>
            {problems.length > 0 && (
              <div style={{marginTop: '9px'}}>
                <b>Problems found:</b>
                <ul style={{textAlign:'left',marginTop:'4px'}}>
                  {problems.map((p,i)=>(<li key={i}>{p}</li>))}
                </ul>
              </div>
            )}
          </div>
        )}
        {result && !solution && !problems.length && (
          <p className="upload-result">{result}</p>
        )}
      </div>
    </div>
  );
};

export default BoneScan;
