local addonName = "WarcraftApiData"

-- Whitelist of API namespaces to explore.  Add to this list!
local API_WHITELIST = {
    "C_",  -- Catch most C_... namespaces
    "Enum",
    "GameTooltip",
}

-- Function to recursively explore the API
local function ExploreAPI(namespace, path, resultTable, depth)
    depth = depth or 0
    path = path or ""
    resultTable = resultTable or {}

    if depth > 10 then
        print("Debug: Max depth reached at path:", path)
        return
    end

    for key, value in pairs(namespace) do
        local fullPath = (path == "") and key or (path .. "." .. key)

        -- Whitelist check: Only proceed if the path starts with a whitelisted prefix
        local shouldExplore = false
        for _, prefix in ipairs(API_WHITELIST) do
            if fullPath:sub(1, #prefix) == prefix then
                shouldExplore = true
                break
            end
        end

        if shouldExplore then
            if type(value) == "function" then
                table.insert(resultTable, fullPath)  -- Store just the function name

            elseif type(value) == "table" then
                -- Prevent recursing into UI elements
                if not string.find(fullPath, "UIParent") and not string.find(fullPath, "GameTooltip") then
                     table.insert(resultTable, fullPath .. " (Table)")  -- Indicate tables
                    ExploreAPI(value, fullPath, resultTable, depth + 1) -- Recurse into tables
                else
                    table.insert(resultTable, fullPath .. " (Table - Skipped)")
                end
            else
                table.insert(resultTable, fullPath .. " (" .. type(value) .. ")")
            end
        end
    end
    return resultTable
end

-- Slash command handler
SLASH_WARCRAFTAPIDATA1 = "/warcraftapidata"
SlashCmdList["WARCRAFTAPIDATA"] = function(msg)
    print("Scanning API... This may take a while.")
    local apiData = ExploreAPI(_G)
    table.sort(apiData)  -- Sort alphabetically

    -- Store the results in the SavedVariables table
    if not WarcraftApiDataDB then
      WarcraftApiDataDB = {}
    end

    WarcraftApiDataDB.apiOutput = apiData -- Store as a TABLE
    print("API Scan complete! Data saved to WTF\\Account\\<YourAccountName>\\SavedVariables\\WarcraftApiData.lua")
end