-- convert_to_json.lua
-- Run this script *outside* of WoW, using a standard Lua interpreter (5.1).

-- Pure Lua JSON encoder (from https://github.com/rxi/json.lua - MIT License)
-- MIT License, Copyright (c) 2020 rxi
local json = {}

function json.encode(value, indent, indent_level)
  indent_level = indent_level or 0
  local indent_str = indent and string.rep("  ", indent_level) or ""
  local next_indent_str = indent and string.rep("  ", indent_level + 1) or ""

  if type(value) == "number" then
    return tostring(value)
  elseif type(value) == "boolean" then
    return tostring(value)
  elseif type(value) == "string" then
    return string.format("%q", value:gsub("\\", "\\\\"):gsub("\n", "\\n"):gsub("\r", "\\r"):gsub("\"", "\\\""))
  elseif type(value) == "table" then
    local s = "{\n"
    local first = true
    for k, v in pairs(value) do
      if not first then
        s = s .. ",\n"
      end
      first = false
      if indent then s = s .. next_indent_str end
      s = s .. json.encode(k, indent, indent_level + 1) .. ": " .. json.encode(v, indent, indent_level + 1)
    end
    if indent then s = s .. "\n" .. indent_str end
    return s .. "}"
  elseif value == nil then
    return "null"
  else
    error("Invalid JSON value: " .. tostring(value))
  end
end
-- End of embedded JSON encoder

-- ** CHANGE THIS TO YOUR ACTUAL PATH (WSL format): **
local pathToDataFile = "/mnt/c/Program Files (x86)/World of Warcraft/_retail_/WTF/Account/PLAYERSOFT/SavedVariables/WarcraftApiData.lua"

local file = io.open(pathToDataFile, "r")
if not file then
    print("Error: Could not open file at path: " .. pathToDataFile)
    return
end

local content = file:read("*all") -- Read entire file
file:close()

-- Extract the API data string.  Now using the correct pattern for a string.
local apiDataString = content:match('WarcraftApiDataDB = {\n%s*apiOutput = "(.-)"')

if not apiDataString then
    print("Error, could not find the data")
    return
end

-- Convert the string (with newline separators) to a Lua table.
local apiDataTable = {}
for entry in apiDataString:gmatch("[^\n]+") do  -- Iterate over lines
    table.insert(apiDataTable, entry)  -- Add each line to the table
end


-- Remove entries with "(Table)"
local filteredData = {}
for _, entry in ipairs(apiDataTable) do
    if not string.match(entry, "%%(Table%%)$") then
        table.insert(filteredData, entry)
    end
end


local jsonData = json.encode(filteredData, true) -- Use the embedded encoder, pretty print.

if jsonData then
    local outputFilePath = "wow_api.json"

    local outputFile = io.open(outputFilePath, "w")
    if outputFile then
        outputFile:write(jsonData)
        outputFile:close()
        print("API data extracted to " .. outputFilePath)
    else
        print("Error: Could not create output file at " .. outputFilePath)
    end
else
    print("Error: Could not convert to json.")
end