import React, { useState, useEffect } from 'react';

const LayerSidebar = ({
  svgString,
  onLayersExtracted,
  onLayerToggle,
  layers, // This is expected to be an object like { layerName: true/false }
  onToggleAllLayers
}) => {
  const [initialLayerNames, setInitialLayerNames] = useState([]);

  useEffect(() => {
    if (svgString) {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
      const groupElements = svgDoc.querySelectorAll("g[id]");
      const extractedNames = new Set(); // Use a Set to avoid duplicates initially
      groupElements.forEach(g => {
        const id = g.getAttribute('id');
        if (id) { // Ensure id is not null or empty
          extractedNames.add(id);
        }
      });

      const uniqueNamesArray = Array.from(extractedNames);
      setInitialLayerNames(uniqueNamesArray);
      if (onLayersExtracted) {
        onLayersExtracted(uniqueNamesArray);
      }
    } else {
      // Clear layers if SVG string is removed
      setInitialLayerNames([]);
      if (onLayersExtracted) {
        onLayersExtracted([]);
      }
    }
  }, [svgString, onLayersExtracted]);

  if (!svgString || initialLayerNames.length === 0) {
    // Optionally, display a message if no SVG or no layers with IDs are found
    return <div className="layer-sidebar"> <p>No layers with IDs found in SVG.</p> </div>;
  }

  const handleCheckboxChange = (layerName, isChecked) => {
    if (onLayerToggle) {
      onLayerToggle(layerName, isChecked);
    }
  };

  const allLayersChecked = initialLayerNames.length > 0 && initialLayerNames.every(name => layers[name]);

  return (
    <div className="layer-sidebar">
      <h4>Layers</h4>
      {initialLayerNames.length > 0 && (
        <div className="layer-item">
          <input
            type="checkbox"
            id="toggle-all-layers"
            checked={allLayersChecked}
            onChange={() => onToggleAllLayers(!allLayersChecked)}
          />
          <label htmlFor="toggle-all-layers">
            {allLayersChecked ? 'Deselect All' : 'Select All'}
          </label>
        </div>
      )}
      <ul>
        {initialLayerNames.map(name => (
          <li key={name} className="layer-item">
            <input
              type="checkbox"
              id={`layer-${name}`}
              checked={layers[name] === undefined ? true : layers[name]} // Default to true if not in layers prop yet
              onChange={(e) => handleCheckboxChange(name, e.target.checked)}
            />
            <label htmlFor={`layer-${name}`}>{name}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LayerSidebar;
