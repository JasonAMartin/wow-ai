-- Event handler
local frame = CreateFrame("Frame")
frame:RegisterEvent("PLAYER_LOGIN")
frame:SetScript("OnEvent", function(self, event, ...)
    if event == "PLAYER_LOGIN" then
        print("My Gear Tracker loaded! Use /mgt to toggle the UI.")
    end
end)

-- Main UI Frame
local uiFrame = CreateFrame("Frame", "GearTrackerUI", UIParent, "BasicFrameTemplateWithInset")
uiFrame:SetSize(400, 600)
uiFrame:SetPoint("CENTER")
uiFrame:Hide()
uiFrame:SetMovable(true)
uiFrame:SetClampedToScreen(true)
uiFrame:EnableMouse(true)
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

local scrollFrame = CreateFrame("ScrollFrame", nil, uiFrame, "UIPanelScrollFrameTemplate")
scrollFrame:SetPoint("TOPLEFT", 10, -30)
scrollFrame:SetPoint("BOTTOMRIGHT", -30, 10)

local textArea = CreateFrame("EditBox", nil, scrollFrame)
textArea:SetMultiLine(true)
textArea:SetFontObject("GameFontNormal")
textArea:SetWidth(340)
textArea:SetAutoFocus(false)
textArea:SetEnabled(false)
textArea:SetMaxLetters(0)
scrollFrame:SetScrollChild(textArea)

textArea:SetScript("OnTextChanged", function(self)
    local height = self:GetText():len() > 0 and self:GetStringHeight() or 600
    self:SetHeight(height)
    scrollFrame:UpdateScrollChildRect()
end)

-- Export UI Frame
local exportFrame = CreateFrame("Frame", "GearTrackerExportUI", UIParent, "BasicFrameTemplateWithInset")
exportFrame:SetSize(400, 600)
exportFrame:SetPoint("CENTER")
exportFrame:Hide()
exportFrame:SetMovable(true)
exportFrame:SetClampedToScreen(true)
exportFrame:EnableMouse(true)
exportFrame:SetScript("OnMouseDown", function(self, button)
    if button == "LeftButton" then
        self:StartMoving()
    end
end)
exportFrame:SetScript("OnMouseUp", function(self)
    self:StopMovingOrSizing()
end)

exportFrame.title = exportFrame:CreateFontString(nil, "OVERLAY", "GameFontHighlight")
exportFrame.title:SetPoint("TOP", 0, -5)
exportFrame.title:SetText("Export Data (Copy with Ctrl+C)")

local exportScrollFrame = CreateFrame("ScrollFrame", nil, exportFrame, "UIPanelScrollFrameTemplate")
exportScrollFrame:SetPoint("TOPLEFT", 10, -30)
exportScrollFrame:SetPoint("BOTTOMRIGHT", -30, 10)

local exportTextArea = CreateFrame("EditBox", nil, exportScrollFrame)
exportTextArea:SetMultiLine(true)
exportTextArea:SetFontObject("GameFontNormal")
exportTextArea:SetWidth(340)
exportTextArea:SetAutoFocus(false)
exportTextArea:SetEnabled(true)
exportTextArea:SetMaxLetters(0)
exportScrollFrame:SetScrollChild(exportTextArea)

exportTextArea:SetScript("OnTextChanged", function(self)
    local height = self:GetText():len() > 0 and self:GetStringHeight() or 600
    self:SetHeight(height)
    exportScrollFrame:UpdateScrollChildRect()
end)

-- Tooltip scanner frame (hidden)
local tooltipScanner = CreateFrame("GameTooltip", "GearTrackerTooltip", nil, "GameTooltipTemplate")
tooltipScanner:SetOwner(UIParent, "ANCHOR_NONE")

-- Data storage
local exportData = {}

-- Gear Info with Upgrade Status
local function GetGearInfo()
    local gearText = "--- Equipped Gear ---\n"
    exportData.gear = {}
    for slot = 1, 17 do
        local itemLink = GetInventoryItemLink("player", slot)
        if itemLink then
            local itemName = GetItemInfo(itemLink) or "Loading..."
            local itemLevel = GetDetailedItemLevelInfo(itemLink) or "N/A"
            local upgradeInfo = "N/A"
            
            -- Scan tooltip for upgrade status
            tooltipScanner:ClearLines()
            tooltipScanner:SetHyperlink(itemLink)
            for i = 1, tooltipScanner:NumLines() do
                local line = _G["GearTrackerTooltipTextLeft" .. i]
                if line then
                    local text = line:GetText()
                    if text then
                        local tier, current, max = text:match("(%a+)%s+(%d+)/(%d+)")
                        if tier and current and max then
                            upgradeInfo = tier .. " " .. current .. "/" .. max
                            break
                        elseif text:match("Upgrade Level:%s+(%a+)%s+(%d+)/(%d+)") then
                            tier, current, max = text:match("Upgrade Level:%s+(%a+)%s+(%d+)/(%d+)")
                            upgradeInfo = tier .. " " .. current .. "/" .. max
                            break
                        end
                    end
                end
            end
            
            gearText = gearText .. string.format("Slot %d: %s (iLvl: %s, Upgrade: %s)\n", slot, itemName, itemLevel, upgradeInfo)
            exportData.gear[slot] = { name = itemName, itemLevel = itemLevel, upgrade = upgradeInfo }
        end
    end
    return gearText
end

-- Currency Info
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

-- Update UI
local function UpdateUI()
    local fullText = GetGearInfo() .. "\n" .. GetCurrencyInfo()
    textArea:SetText(fullText)
end

-- JSON.stringify equivalent for Lua
local function to_json(tbl, indent)
    if not indent then indent = 0 end
    local str = "{\n"
    local first = true
    for k, v in pairs(tbl) do
        if not first then str = str .. ",\n" end
        first = false
        local formatting = string.rep("  ", indent + 1)
        if type(v) == "table" then
            str = str .. formatting .. "\"" .. tostring(k) .. "\": " .. to_json(v, indent + 1)
        elseif type(v) == "number" then
            str = str .. formatting .. "\"" .. tostring(k) .. "\": " .. tostring(v)
        else
            str = str .. formatting .. "\"" .. tostring(k) .. "\": \"" .. tostring(v) .. "\""
        end
    end
    str = str .. "\n" .. string.rep("  ", indent) .. "}"
    return str
end

-- Slash commands
SLASH_MYGEARTRACKER1 = "/mgt"
SlashCmdList["MYGEARTRACKER"] = function(msg)
    if uiFrame:IsShown() then
        uiFrame:Hide()
    else
        UpdateUI()
        uiFrame:Show()
    end
end

SLASH_MYGEAREXPORT1 = "/mgtexport"
SlashCmdList["MYGEAREXPORT"] = function()
    UpdateUI()
    local jsonData = {
        character = {
            gear = {},
            currencies = exportData.currencies
        }
    }
    for k, v in pairs(exportData.gear) do
        jsonData.character.gear["slot" .. k] = v
    end
    local exportString = to_json(jsonData)
    exportTextArea:SetText(exportString)
    exportFrame:Show()
end