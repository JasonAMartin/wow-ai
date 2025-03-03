-- Create the UI frame
local uiFrame = CreateFrame("Frame", "GearTrackerUI", UIParent, "BasicFrameTemplateWithInset")
uiFrame:SetSize(400, 600)
uiFrame:SetPoint("CENTER")
uiFrame:Hide() -- Hidden by default until toggled

-- Add a title
uiFrame.title = uiFrame:CreateFontString(nil, "OVERLAY", "GameFontHighlight")
uiFrame.title:SetPoint("TOP", 0, -5)
uiFrame.title:SetText("My Gear Tracker")

-- Add a scrollable text area
local scrollFrame = CreateFrame("ScrollFrame", nil, uiFrame, "UIPanelScrollFrameTemplate")
scrollFrame:SetPoint("TOPLEFT", 10, -30)
scrollFrame:SetPoint("BOTTOMRIGHT", -30, 10)

local textArea = CreateFrame("EditBox", nil, scrollFrame)
textArea:SetMultiLine(true)
textArea:SetFontObject("GameFontNormal")
textArea:SetWidth(360)
textArea:SetAutoFocus(false)
textArea:SetEnabled(false) -- Read-only
scrollFrame:SetScrollChild(textArea)

-- Data storage for export
local exportData = {}

-- Function to get gear details
local function GetGearInfo()
    local gearText = "--- Equipped Gear ---\n"
    exportData.gear = {}
    for slot = 1, 17 do
        local itemLink = GetInventoryItemLink("player", slot)
        if itemLink then
            local itemName = GetItemInfo(itemLink) or "Unknown"
            local itemLevel = GetDetailedItemLevelInfo(itemLink) or "N/A"
            local upgradeInfo = "N/A"
            local currentUpgrade, maxUpgrade = C_ItemUpgrade.GetItemUpgradeInfo(itemLink)
            if currentUpgrade and maxUpgrade then
                upgradeInfo = string.format("%d/%d", currentUpgrade, maxUpgrade)
            end
            gearText = gearText .. string.format("Slot %d: %s (iLvl: %s, Upgrade: %s)\n", slot, itemName, itemLevel, upgradeInfo)
            exportData.gear[slot] = {
                name = itemName,
                itemLevel = itemLevel,
                upgrade = upgradeInfo
            }
        end
    end
    return gearText
end

-- Function to get currency info
local function GetCurrencyInfo()
    local currencyText = "--- Currency ---\n"
    exportData.currencies = {}
    for i = 1, C_CurrencyInfo.GetCurrencyListSize() do
        local currencyInfo = C_CurrencyInfo.GetCurrencyListInfo(i)
        if currencyInfo and not currencyInfo.isHeader then
            currencyText = currencyText .. string.format("%s: %d (Max: %d)\n", currencyInfo.name, currencyInfo.quantity, currencyInfo.maxQuantity)
            exportData.currencies[currencyInfo.name] = {
                quantity = currencyInfo.quantity,
                maxQuantity = currencyInfo.maxQuantity
            }
        end
    end
    return currencyText
end

-- Function to get talent spec info
local function GetTalentInfo()
    local talentText = "--- Talent Spec ---\n"
    local specID = GetSpecialization()
    local specName = specID and GetSpecializationInfo(specID) or "Unknown"
    talentText = talentText .. string.format("Spec: %s\n", specName)

    exportData.talents = { specialization = specName, talents = {} }

    -- Get active talent choices
    for tier = 1, 7 do -- 7 tiers in the talent tree (as of Dragonflight)
        for column = 1, 3 do
            local talentID, name, _, selected = GetTalentInfo(tier, column, 1)
            if selected then
                talentText = talentText .. string.format("Tier %d: %s\n", tier, name or "Unknown")
                table.insert(exportData.talents.talents, { tier = tier, name = name })
            end
        end
    end
    return talentText
end

-- Function to update the UI and prepare export
local function UpdateUI()
    local fullText = GetGearInfo() .. "\n" .. GetCurrencyInfo() .. "\n" .. GetTalentInfo()
    textArea:SetText(fullText)
end

-- Slash command to toggle UI and update data
SLASH_MYGEARTRACKER1 = "/mgt"
SlashCmdList["MYGEARTRACKER"] = function()
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

-- Function to export data as a string (for YAML conversion)
local function ExportToString()
    local exportString = "exportData = " .. table.tostring(exportData) -- Simple table-to-string for now
    print("Copy the following Lua table and convert it to YAML:")
    print(exportString)
end

-- Add an export command
SLASH_MYGEAREXPORT1 = "/mgtexport"
SlashCmdList["MYGEAREXPORT"] = function()
    UpdateUI() -- Ensure data is fresh
    ExportToString()
end

-- Simple table-to-string function (basic implementation)
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