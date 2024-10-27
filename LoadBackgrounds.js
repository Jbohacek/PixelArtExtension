const fs = require('fs');
const path = require('path');

// Folder path for the target directory (e.g., 'Backgrounds')
const folderPath = path.join(__dirname, 'backgrounds');

// Read all files in the specified folder
fs.readdir(folderPath, (err, files) => {
    if (err) {
        return console.error('Error reading the directory:', err);
    }

    // Construct JSON data
    const jsonData = {
      data: files.map(file => ({
          file: `backgrounds/${file}`,
          author: "Unknown",
          title: path.parse(file).name  // Get file name without the extension
      }))
  };

    // Path for the output JSON file
    const outputFilePath = path.join(__dirname, 'data', 'backgrounds.json');

    // Write JSON data to the file
    fs.writeFile(outputFilePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
            return console.error('Error writing JSON file:', err);
        }
        console.log('JSON data successfully written to backgroundsData.json');
    });
});