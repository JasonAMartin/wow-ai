const fs = require('fs');
const path = require('path');

const savedVariablesPath = "/home/jam/wow/_retail_/WTF/Account/PLAYERSOFT/SavedVariables/WarcraftApiData.lua"

// Function to clean and transform the data
function cleanApiData(savedVariablesPath) {
    try {
        // 1. Read the file
        let fileContent = fs.readFileSync(savedVariablesPath, 'utf8');

        console.log("I have read the file")

        // 2. Remove: WarcraftApiDataDB = {
        fileContent = fileContent.replace("WarcraftApiDataDB = {", "{");

        // 3. Change: ["apiOutput"] = {  to  "apiOutput" : [
        fileContent = fileContent.replace(/\["apiOutput"\] = {/, '"apiOutput": [');

        // 4.  Remove trailing comma and }, and replace with ].
        fileContent = fileContent.replace(/,\s*}([\s\n]*)}$/, ']');

        fileContent = fileContent.replace(/},/g, "]");

        fileContent = fileContent.replace("\"apiOutput\"", "\"apiFunctions\"")

        // Write cleaned up file to a new file.
        const outputFilePath = path.join("/home/jam/code/wow-ai/tools/", "wow_api.json"); // Output in the same directory
        fs.writeFileSync(outputFilePath, fileContent, 'utf8');

        console.log(`Successfully cleaned and converted API data to: ${outputFilePath}`);


    } catch (error) {
        console.error("Error processing file:", error);
    }
}

// Call the function with the file path
cleanApiData(savedVariablesPath);
