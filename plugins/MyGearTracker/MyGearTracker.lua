-- Create the UI frame
local uiFrame = CreateFrame("Frame", "GearTrackerUI", UIParent, "BasicFrameTemplateWithInset")
uiFrame:SetSize(400, 600)
uiFrame:SetPoint("CENTER")
uiFrame:Hide()
uiFrame:SetMovable(true) -- Make it movable
uiFrame:SetClampedToScreen(true) -- Keep it on screen
uiFrame:EnableMouse(true) -- Enable mouse interaction
uiFrame:SetScript("OnMouseDown", function(self, button)
    if button == "LeftButton" then
        self:StartMoving()
    end
end)
uiFrame:SetScript("OnMouseUp", function(self)
    self:StopMovingOrSizing()
end)

uiFrame.title = uiFrame:CreateFontString(nil, "OVERLAY", "GameFontHighlight")
uiFrame.title:SetPoint("TOP", 0, -5)
uiFrame.title:SetText("My Gear Tracker")

-- Scroll frame setup
local scrollFrame = CreateFrame("ScrollFrame", nil, uiFrame, "UIPanelScrollFrameTemplate")
scrollFrame:SetPoint("TOPLEFT", 10, -30)
scrollFrame:SetPoint("BOTTOMRIGHT", -30, 10)

local textArea = CreateFrame("EditBox", nil, scrollFrame)
textArea:SetMultiLine(true)
textArea:SetFontObject("GameFontNormal")
textArea:SetWidth(340) -- Slightly narrower to fit scrollbar
textArea:SetAutoFocus(false)
textArea:SetEnabled(false)
textArea:SetMaxLetters(0) -- Unlimited text
scrollFrame:SetScrollChild(textArea)

-- Ensure textArea resizes dynamically
textArea:SetScript("OnTextChanged", function(self)
    local height = self:GetText():len() > 0 and self:GetStringHeight() or 600
    self:SetHeight(height)
    scrollFrame:UpdateScrollChildRect()
end)

local exportData = {}

local function GetGearInfo()
    local gearText = "--- Equipped Gear ---\n"
    exportData.gear = {}
    for slot = 1, 17 do
        local itemLink = GetInventoryItemLink("player", slot)
        if itemLink then
            local itemName = GetItemInfo(itemLink) or "Loading..."
            local itemLevel = GetDetailedItemLevelInfo(itemLink) or "N/A"
            gearText = gearText .. string.format("Slot %d: %s (iLvl: %s)\n", slot, itemName, itemLevel)
            exportData.gear[slot] = { name = itemName, itemLevel = itemLevel }
        end
    end
    return gearText
end

local function GetCurrencyInfo()
    local currencyText = "--- Currency ---\n"
    exportData.currencies = {}
    for i = 1, C_CurrencyInfo.GetCurrencyListSize() do
        local currencyInfo = C_CurrencyInfo.GetCurrencyListInfo(i)
        if currencyInfo and not currencyInfo.isHeader then
            currencyText = currencyText .. string.format("%s: %d (Max: %d)\n", currencyInfo.name, currencyInfo.quantity, currencyInfo.maxQuantity)
            exportData.currencies[currencyInfo.name] = { quantity = currencyInfo.quantity, maxQuantity = currencyInfo.maxQuantity }
        end
    end
    return currencyText
end

local function GetTalentInfo()
    local talentText = "--- Talent Spec ---\n"
    local specID = GetSpecialization()
    local specName = specID and GetSpecializationInfo(specID) or "Unknown"
    talentText = talentText .. string.format("Spec: %s\n", specName)
    
    exportData.talents = { specialization = specName, talents = {} }
    local configID = C_Traits.GetConfigIDBySystemID(1)
    if configID then
        local treeInfo = C_Traits.GetTreeInfo(configID, 1)
        if treeInfo and treeInfo.nodes then
            for _, node in ipairs(treeInfo.nodes) do
                local nodeInfo = C_Traits.GetNodeInfo(configID, node.ID)
                if nodeInfo and nodeInfo.isActive and nodeInfo.entryIDs then
                    local entryInfo = C_Traits.GetEntryInfo(configID, nodeInfo.entryIDs[1])
                    if entryInfo and entryInfo.definitionID then
                        local definitionInfo = C_Traits.GetDefinitionInfo(entryInfo.definitionID)
                        if definitionInfo and definitionInfo.spellID then
                            local spellName = GetSpellInfo(definitionInfo.spellID)
                            talentText = talentText .. string.format("Talent: %s\n", spellName or "Unknown")
                            table.insert(exportData.talents.talents, { name = spellName or "Unknown" })
                        end
                    end
                end
            end
        end
    end
    return talentText
end

local function UpdateUI()
    local fullText = GetGearInfo() .. "\n" .. GetCurrencyInfo() .. "\n" .. GetTalentInfo()
    textArea:SetText(fullText)
end

-- Slash command
SLASH_MYGEARTRACKER1 = "/mgt"
SlashCmdList["MYGEARTRACKER"] = function(msg)
    if uiFrame:IsShown() then
        uiFrame:Hide()
    else
        UpdateUI()
        uiFrame:Show()
    end
end

-- Event handler
local frame = CreateFrame("Frame")
frame:RegisterEvent("PLAYER_LOGIN")
frame:SetScript("OnEvent", function(self, event, ...)
    if event == "PLAYER_LOGIN" then
        print("My Gear Tracker loaded! Use /mgt to toggle the UI.")
    end
end)

-- Export command
SLASH_MYGEAREXPORT1 = "/mgtexport"
SlashCmdList["MYGEAREXPORT"] = function()
    UpdateUI()
    local exportString = "exportData = " .. table.tostring(exportData)
    print("Copy the following Lua table and convert it to YAML:")
    print(exportString)
end

function table.tostring(tbl, indent)
    if not indent then indent = 0 end
    local str = "{\n"
    for k, v in pairs(tbl) do
        local formatting = string.rep("  ", indent + 1)
        if type(v) == "table" then
            str = str .. formatting .. tostring(k) .. " = " .. table.tostring(v, indent + 1) .. ",\n"
        else
            str = str .. formatting .. tostring(k) .. " = " .. tostring(v) .. ",\n"
        end
    end
    str = str .. string.rep("  ", indent) .. "}"
    return str
end