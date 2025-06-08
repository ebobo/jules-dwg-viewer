import React, { useState, useCallback } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import SvgViewer from './components/SvgViewer';
import LayerSidebar from './components/LayerSidebar';

function App() {
  const [svgData, setSvgData] = useState('');
  const [error, setError] = useState('');
  const [initialLayers, setInitialLayers] = useState([]); // Not directly used for rendering, but good for reference
  const [layerVisibility, setLayerVisibility] = useState({});

  const handleUploadSuccess = (data) => {
    setSvgData(data);
    setError('');
    // Reset layer states when a new SVG is uploaded
    setInitialLayers([]);
    setLayerVisibility({});
    console.log("SVG received in App.js");
  };

  const handleUploadError = (errorMessage) => {
    setError(errorMessage);
    setSvgData('');
    setInitialLayers([]);
    setLayerVisibility({});
  };

  const handleLayersExtracted = useCallback((layerNames) => {
    setInitialLayers(layerNames);
    const initialVisibility = {};
    layerNames.forEach(name => {
      initialVisibility[name] = true; // Default all layers to visible
    });
    setLayerVisibility(initialVisibility);
  }, []);

  const handleLayerToggle = useCallback((layerName, isVisible) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layerName]: isVisible,
    }));
  }, []);

  const handleToggleAllLayers = useCallback((shouldBeVisible) => {
    setLayerVisibility(prev => {
      const newVisibility = { ...prev };
      initialLayers.forEach(name => {
        newVisibility[name] = shouldBeVisible;
      });
      return newVisibility;
    });
  }, [initialLayers]);


  return (
    <div className="App">
      <header className="App-header">
        <h1>DWG to SVG Converter</h1>
      </header>
      <div className="app-body">
        <aside className="app-sidebar">
          <FileUpload
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
          {svgData && (
            <LayerSidebar
              svgString={svgData}
              onLayersExtracted={handleLayersExtracted}
              onLayerToggle={handleLayerToggle}
              layers={layerVisibility}
              onToggleAllLayers={handleToggleAllLayers}
            />
          )}
        </aside>
        <main className="app-main-content">
          {error && (
            <div className="error-message">
              <h3>Error:</h3>
              <pre>{error}</pre>
            </div>
          )}
          {svgData && !error && (
            <div className="svg-display-area">
              <h3>Converted SVG:</h3>
              <SvgViewer
                svgString={svgData}
                layerVisibility={layerVisibility}
                key={JSON.stringify(layerVisibility)} // Force re-render if using simpler SvgViewer
              />
            </div>
          )}
          {!svgData && !error && <p>Upload a DWG file to see the SVG preview and layers.</p>}
        </main>
      </div>
    </div>
  );
}

export default App;
