local addonName = "WarcraftApiData"

-- Whitelist of API namespaces to explore.
local API_WHITELIST = {
    "C_",  -- Catch most C_... namespaces
    "Enum",
}

-- Function to recursively explore the API
local function ExploreAPI(namespace, path, resultTable, depth)
    depth = depth or 0
    path = path or ""
    resultTable = resultTable or {}

    if depth > 10 then  -- Maximum recursion depth
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
                -- Only call xpcall on functions starting with Get, Set, Is, Can
                local functionName = key:lower()
                if functionName:sub(1, 3) == "get" or
                   functionName:sub(1, 3) == "set" or
                   functionName:sub(1, 2) == "is" or
                   functionName:sub(1, 3) == "can" then

                    print("Debug: Calling xpcall on:", fullPath) -- Log the function
                    local success, errorMessage = xpcall(value, function(err) return err end, 1, 2, 3, 4, 5)
                    local usageString = "Unknown"
                    if not success then
                        usageString = errorMessage:match("Usage: (.-)\n") or errorMessage -- Extract usage
                    end
                    table.insert(resultTable, fullPath .. " (" .. usageString .. ")")
                    print("Debug: xpcall result:", success, usageString)  -- Log the result
                else
                    table.insert(resultTable, fullPath .. " (Skipped - No xpcall)")
                end

            elseif type(value) == "table" then
                table.insert(resultTable, fullPath .. " (Table)")
                ExploreAPI(value, fullPath, resultTable, depth + 1) -- Recurse into tables
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
    local apiData = ExploreAPI(_G)  -- Get the API data
    table.sort(apiData) -- Sort alphabetically
    local outputText = table.concat(apiData, "\n")  -- Join into a single string
    print("API Scan Complete! Results:\n", outputText) -- Print to chat for now
end