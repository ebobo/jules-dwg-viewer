const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

// Set up multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// POST route for file upload
app.post('/api/upload', upload.single('dwgfile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const originalName = req.file.originalname;
  const tempInputPath = path.join(UPLOADS_DIR, `input_${Date.now()}_${originalName}`);
  // Ensure the output has a .svg extension
  const outputFileName = path.basename(originalName, path.extname(originalName)) + '.svg';
  const tempOutputPath = path.join(UPLOADS_DIR, `output_${Date.now()}_${outputFileName}`);

  fs.writeFile(tempInputPath, req.file.buffer, (writeErr) => {
    if (writeErr) {
      console.error('Error writing temporary DWG file:', writeErr);
      return res.status(500).json({ message: 'Error saving uploaded file.' });
    }

    // Actual dwg2svg conversion command
    const command = 'dwg2svg';
    const args = ['-o', tempOutputPath, tempInputPath];

    execFile(command, args, (execErr, stdout, stderr) => {
      // Log stdout and stderr from dwg2svg regardless of error, for debugging
      if (stdout) console.log('dwg2svg stdout:', stdout);
      if (stderr) console.error('dwg2svg stderr:', stderr);

      if (execErr) {
        console.error(`Error during DWG to SVG conversion (dwg2svg execFile error): ${execErr.message}`);
        // Attempt to clean up both files on any execErr
        try { fs.unlinkSync(tempInputPath); } catch (e) { if (e.code !== 'ENOENT') console.error('Error deleting temp input DWG on execErr:', e.message); }
        try { fs.unlinkSync(tempOutputPath); } catch (e) { if (e.code !== 'ENOENT') console.error('Error deleting temp output SVG on execErr:', e.message); }
        return res.status(500).json({ message: `Error during DWG to SVG conversion: ${execErr.message}` });
      }

      // Check if the output file was actually created
      if (!fs.existsSync(tempOutputPath)) {
        console.error('SVG output file not found after conversion, though dwg2svg reported success (no execErr).');
        try { fs.unlinkSync(tempInputPath); } catch (e) { if (e.code !== 'ENOENT') console.error('Error deleting temp input DWG (output not found):', e.message); }
        return res.status(500).json({ message: 'SVG output file not found after conversion.' });
      }

      // Check if the output file is empty
      try {
        const stats = fs.statSync(tempOutputPath);
        if (stats.size === 0) {
          console.error('DWG to SVG conversion resulted in an empty SVG file:', tempOutputPath);
          try { fs.unlinkSync(tempInputPath); } catch (e) { if (e.code !== 'ENOENT') console.error('Error deleting temp input DWG (empty output):', e.message); }
          try { fs.unlinkSync(tempOutputPath); } catch (e) { if (e.code !== 'ENOENT') console.error('Error deleting temp output SVG (empty output):', e.message); }
          return res.status(500).json({ message: 'DWG to SVG conversion resulted in an empty output file.' });
        }
      } catch (statErr) {
        console.error('Error getting stats for output SVG file:', statErr);
        try { fs.unlinkSync(tempInputPath); } catch (e) { if (e.code !== 'ENOENT') console.error('Error deleting temp input DWG (stat error):', e.message); }
        try { fs.unlinkSync(tempOutputPath); } catch (e) { if (e.code !== 'ENOENT') console.error('Error deleting temp output SVG (stat error):', e.message); }
        return res.status(500).json({ message: 'Error verifying converted SVG file.' });
      }

      fs.readFile(tempOutputPath, (readErr, data) => {
        if (readErr) {
          console.error('Error reading temporary SVG file:', readErr);
          // Attempt to clean up both files even on readFile error
          try { fs.unlinkSync(tempInputPath); } catch (e) { if (e.code !== 'ENOENT') console.error('Error deleting temp input DWG (readFile error):', e.message); }
          try { fs.unlinkSync(tempOutputPath); } catch (e) { if (e.code !== 'ENOENT') console.error('Error deleting temp output SVG (readFile error):', e.message); }
          return res.status(500).json({ message: 'Error reading converted SVG file.' });
        }

        // Success: SVG data is read
        res.setHeader('Content-Type', 'image/svg+xml');
        res.status(200).send(data);

        // Clean up successful conversion files
        try { fs.unlinkSync(tempInputPath); } catch (e) { if (e.code !== 'ENOENT') console.error('Error deleting temp input DWG (success):', e.message); }
        try { fs.unlinkSync(tempOutputPath); } catch (e) { if (e.code !== 'ENOENT') console.error('Error deleting temp output SVG (success):', e.message); }
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
