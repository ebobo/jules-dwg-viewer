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

    // Placeholder conversion command
    const conversionCommand = `echo '<svg><text>Placeholder SVG for ${tempInputPath}</text></svg>' > ${tempOutputPath}`;

    exec(conversionCommand, (execErr, stdout, stderr) => {
      if (execErr) {
        console.error('Error during DWG to SVG conversion:', execErr);
        // Clean up input file even if conversion fails
        fs.unlink(tempInputPath, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting temporary input DWG file after exec error:', unlinkErr);
        });
        return res.status(500).json({ message: 'Error during DWG to SVG conversion.' });
      }

      fs.readFile(tempOutputPath, (readErr, data) => {
        // Always try to clean up both files
        fs.unlink(tempInputPath, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting temporary input DWG file:', unlinkErr);
        });
        fs.unlink(tempOutputPath, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting temporary output SVG file:', unlinkErr);
        });

        if (readErr) {
          console.error('Error reading temporary SVG file:', readErr);
          return res.status(500).json({ message: 'Error reading converted SVG file.' });
        }

        res.setHeader('Content-Type', 'image/svg+xml');
        res.status(200).send(data);
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
