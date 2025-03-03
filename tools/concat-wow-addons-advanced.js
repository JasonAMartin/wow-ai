const fs = require('fs');
const path = require('path');

// ** CHANGE THIS TO YOUR ACTUAL ADDONS PATH **
const addonsPath = "/home/jam/wow/_retail_/Interface/AddOns"
const outputFilePath = "world-of-warcraft-addons-code-base-advanced.json";

function processAddonFolder(addonFolder, addonData) {
    const addonName = path.basename(addonFolder);
    addonData[addonName] = { files: {} };

    const files = fs.readdirSync(addonFolder);

    for (const file of files) {
        const filePath = path.join(addonFolder, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Recursively process subdirectories
            processAddonFolder(filePath, addonData); // Pass existing object
        } else if (file.endsWith('.lua') || file.endsWith('.toc')) {
            try {
                const fileContent = fs.readFileSync(filePath, 'utf8');
                // Store the file content with the full relative path as the key
                addonData[addonName].files[file] = fileContent;

            } catch (error) {
                console.error(`Error reading file ${filePath}:`, error);
                addonData[addonName].files[file] = `// ERROR: Could not read ${file}\n`;
            }
        }
    }
}

function concatAddons(addonsDir, whitelist) {
    const allAddonData = {};

    for (const addonFolderName of whitelist) {
        const addonFolderPath = path.join(addonsDir, addonFolderName);
        processAddonFolder(addonFolderPath, allAddonData);
    }

    return allAddonData;
}


const whitelistFolders = ["RareScanner", "BtWQuests", "AllTheThings", "Bagnon", "RareScanner", "Plater", "Pawn", "GTFO", "Scrap", "Details"]; // Just RareScanner for this task
const combinedData = concatAddons(addonsPath, whitelistFolders);

// Output as pretty-printed JSON
const jsonData = JSON.stringify(combinedData, null, 2);

// Write to the output file
try {
    fs.writeFileSync(outputFilePath, jsonData, 'utf8');
    console.log(`Successfully combined add-on data to: ${outputFilePath}`);
} catch (error) {
    console.error(`Error writing to ${outputFilePath}:`, error);
}
