#!/usr/bin/env node

const fs = require('fs');
const argparse = require('argparse');

// Parse command-line arguments
const parser = new argparse.ArgumentParser({
  description: 'Convert Lua exportData table to JSON'
});
parser.add_argument('-f', { required: true, help: 'Path to the Lua data file (e.g., export.lua)' });
parser.add_argument('-o', { required: true, help: 'Path to the output JSON file (e.g., mychar.json)' });
const args = parser.parse_args();

// Read the Lua file
let luaContent;
try {
  luaContent = fs.readFileSync(args.f, 'utf8');
} catch (e) {
  console.error(`Error: Input file '${args.f}' not found or unreadable: ${e}`);
  process.exit(1);
}

// Parse Lua table into JavaScript object
function parseLuaTable(text) {
  text = text.replace(/exportData\s*=\s*/, '').trim();
  
  function convertValue(val) {
    val = val.trim();
    if (/^\d+$/.test(val)) return parseInt(val);
    if (val === "N/A") return val;
    return val.replace(/^"/, '').replace(/"$/, '');
  }
  
  function parseTable(text) {
    const result = {};
    text = text.replace(/^{/, '').replace(/}$/, '').trim();
    if (!text) return result;
    
    let buffer = '';
    let braceCount = 0;
    const pairs = [];
    
    // Split on top-level commas, respecting nested braces
    for (let char of text) {
      if (char === '{') braceCount++;
      else if (char === '}') braceCount--;
      else if (char === ',' && braceCount === 0) {
        pairs.push(buffer.trim());
        buffer = '';
        continue;
      }
      buffer += char;
    }
    if (buffer.trim()) pairs.push(buffer.trim());
    
    pairs.forEach(pair => {
      const [keyPart, valuePart] = pair.split(/\s*=\s*/);
      if (!keyPart || !valuePart) return;
      
      const key = keyPart.startsWith('[') ? keyPart.slice(2, -2) : parseInt(keyPart);
      const value = valuePart.trim();
      
      if (value.startsWith('{')) {
        result[key] = parseTable(value);
      } else {
        result[key] = convertValue(value);
      }
    });
    
    return result;
  }
  
  return parseTable(text);
}

// Convert to JSON structure
function convertToJson(luaData) {
  const jsonData = {
    character: {
      gear: Object.fromEntries(
        Object.entries(luaData.gear).map(([k, v]) => [`slot${k}`, v])
      ),
      currencies: luaData.currencies
    }
  };
  return jsonData;
}

// Parse and convert
let luaData, jsonData;
try {
  luaData = parseLuaTable(luaContent);
  if (!luaData.gear || !luaData.currencies) {
    throw new Error("Missing 'gear' or 'currencies' key in parsed Lua data");
  }
  jsonData = convertToJson(luaData);
} catch (e) {
  console.error(`Error processing Lua data: ${e}`);
  process.exit(1);
}

// Write to JSON file
try {
  fs.writeFileSync(args.o, JSON.stringify(jsonData, null, 2));
  console.log(`JSON file '${args.o}' created successfully!`);
} catch (e) {
  console.error(`Error writing JSON file: ${e}`);
  process.exit(1);
}