import React, { useEffect, useMemo } from 'react';

const SvgViewer = ({ svgString, layerVisibility }) => {
  const processedSvgString = useMemo(() => {
    if (!svgString) {
      return null;
    }
    if (!layerVisibility || Object.keys(layerVisibility).length === 0) {
      return svgString; // No visibility rules to apply
    }

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, "image/svg+xml");

    // Check for parsing errors
    const parseError = svgDoc.querySelector("parsererror");
    if (parseError) {
      console.error("Error parsing SVG string:", parseError.textContent);
      // Potentially return original string or an error SVG
      return svgString;
    }

    const allElements = svgDoc.documentElement.querySelectorAll("*");
    allElements.forEach(el => {
        if(el.style.display === 'none') el.style.removeProperty('display');
    });


    for (const layerName in layerVisibility) {
      // Query for groups and other elements like rect, path, etc. that might have the layer ID
      const elements = svgDoc.querySelectorAll(`[id="${layerName}"]`);
      elements.forEach(element => {
        if (layerVisibility[layerName] === false) {
          element.style.display = 'none';
        } else {
          // Check if style was 'display: none' and remove it, or set to default
          if (element.style.display === 'none') {
            element.style.removeProperty('display');
          }
          // For SVG elements, 'inline' or 'block' can be defaults.
          // Removing the property is often safest to revert to original or CSS defined display.
        }
      });
    }
    return new XMLSerializer().serializeToString(svgDoc.documentElement);
  }, [svgString, layerVisibility]);

  if (!processedSvgString) {
    return null;
  }

  // The key prop helps React differentiate between SvgViewer instances
  // if multiple are used, or to force re-mount if needed externally.
  // Here, it's mostly for consistency if we were to pass a dynamic key from App.js.
  // The critical part is useMemo recalculating when layerVisibility changes.
  return (
    <div
      className="svg-viewer-container"
      dangerouslySetInnerHTML={{ __html: processedSvgString }}
    />
  );
};

export default SvgViewer;
