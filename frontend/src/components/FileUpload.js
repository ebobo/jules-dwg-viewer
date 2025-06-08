import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onUploadSuccess, onUploadError }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage(''); // Clear previous messages
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a DWG file first.');
      return;
    }

    setUploading(true);
    setMessage('Uploading...');
    const formData = new FormData();
    formData.append('dwgfile', selectedFile);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // If the backend returns SVG directly, we might expect 'text' or 'blob'
        // For now, let's assume the backend sends SVG as text/string
        responseType: 'text',
      });

      setMessage('File uploaded successfully!');
      console.log('SVG Data:', response.data);
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
    } catch (error) {
      let errorMessage = 'Error uploading file.';
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Upload error response:', error.response.data);
        errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Upload error request:', error.request);
        errorMessage = 'No response from server. Ensure the backend is running.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Upload error message:', error.message);
        errorMessage = error.message;
      }
      setMessage(`Upload failed: ${errorMessage}`);
      if (onUploadError) {
        onUploadError(errorMessage);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h3>Upload DWG File</h3>
      <input type="file" accept=".dwg" onChange={handleFileChange} disabled={uploading} />
      <button onClick={handleUpload} disabled={uploading || !selectedFile}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;
