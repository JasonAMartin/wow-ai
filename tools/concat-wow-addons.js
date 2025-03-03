const fs = require('fs');
const path = require('path');

// **CHANGE THIS TO YOUR ACTUAL ADDONS PATH (Linux/Unix-like format)**
const addonsPath = "/home/jam/wow/_retail_/Interface/AddOns"; // Example path.

const whitelistFolders = ["MyGearTracker", "WarcraftApiData", "ExportTalents", "DumpText", "TameCheck", "Details_TimeLine"];

function concatAddonFiles(addonsDir, whitelist) {
  const addonData = {};

  for (const folderName of whitelist) {
    const folderPath = path.join(addonsDir, folderName);
    const tocPath = path.join(folderPath, `${folderName}.toc`);
    const luaPath = path.join(folderPath, `${folderName}.lua`);

    let tocContent = "";
    let luaContent = "";

    try {
      tocContent = fs.readFileSync(tocPath, 'utf8');
    } catch (error) {
      console.error(`Error reading ${tocPath}:`, error);
      tocContent = `// ERROR: Could not read ${folderName}.toc\n`; // Add error message as a comment
    }

    try {
      luaContent = fs.readFileSync(luaPath, 'utf8');
    } catch (error) {
      console.error(`Error reading ${luaPath}:`, error);
      luaContent = `-- ERROR: Could not read ${folderName}.lua\n`; // Add error message as a comment
    }


    addonData[folderName] = {
        toc: `// ***** Start of ${folderName}.toc *****\n${tocContent}\n// ***** End of ${folderName}.toc *****\n`,
        lua: `-- ***** Start of ${folderName}.lua *****\n${luaContent}\n-- ***** End of ${folderName}.lua *****\n`,
    };

  }

  return addonData;
}

const combinedData = concatAddonFiles(addonsPath, whitelistFolders);

// Convert to pretty-printed JSON
const jsonData = JSON.stringify(combinedData, null, 2);

// Write to the output file
const outputFilePath = "world-of-warcraft-addons-code-base.json"; // Output to current directory
try {
  fs.writeFileSync(outputFilePath, jsonData, 'utf8');
  console.log(`Successfully combined add-on data to: ${outputFilePath}`);
} catch (error) {
  console.error(`Error writing to ${outputFilePath}:`, error);
}
