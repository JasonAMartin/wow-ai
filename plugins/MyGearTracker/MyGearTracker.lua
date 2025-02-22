-- Saved variable to store equipped curios
local addonName = "MyGearTracker" -- Replace with your addon name
local defaults = {
    equippedCurios = {
        combat = "Unknown Combat Curio (Rank 1/4)",
        utility = "Unknown Utility Curio (Rank 1/4)"
    },
    availableCurios = {
        { name = "Rage-Filled Idol", rank = 2 },
        { name = "Relic of Sentience", rank = 1 }
    }
}

-- Initialize saved variables
local function InitializeDB()
    if not MyGearTrackerDB then
        MyGearTrackerDB = defaults
    end
end

-- Event handler
-- Event frame to update curios when changed in UI
local eventFrame = CreateFrame("Frame")
eventFrame:RegisterEvent("ADDON_LOADED")
eventFrame:SetScript("OnEvent", function(self, event, arg1)
    if event == "ADDON_LOADED" and arg1 == addonName then
        InitializeDB()
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
    local height = self:GetRegions():GetHeight() or 600 -- Fallback to font height or fixed value
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
    local height = self:GetRegions():GetHeight() or 600 -- Fallback to font height or fixed value
    self:SetHeight(height)
    exportScrollFrame:UpdateScrollChildRect()
end)

-- Tooltip scanner frame (hidden)
local tooltipScanner = CreateFrame("GameTooltip", "GearTrackerTooltip", nil, "GameTooltipTemplate")
tooltipScanner:SetOwner(UIParent, "ANCHOR_NONE")

-- Data storage
local exportData = {}

-- Function to sync equipped and available curios
local function SetCurio(slot)
    if slot ~= "combat" and slot ~= "utility" then
        print("Usage: /mgtsetcurio [combat|utility]")
        return
    end
    local companionFrame = DelvesCompanionConfigurationFrame
    if companionFrame and companionFrame:IsShown() then
        print("Delve UI open, syncing all curio data...")
        C_Timer.After(3, function()
            local combatSlot = companionFrame.CompanionCombatTrinketSlot
            local utilitySlot = companionFrame.CompanionUtilityTrinketSlot
            local slots = { combat = combatSlot, utility = utilitySlot }

            -- Sync equipped curios
            for slotType, slot in pairs(slots) do
                if slot and slot.selectionNodeInfo and slot.selectionNodeInfo.activeEntry then
                    local entryID = slot.selectionNodeInfo.activeEntry.entryID
                    local options = slot.selectionNodeOptions
                    if options and options[entryID] and options[entryID].name then
                        GameTooltip:SetOwner(slot, "ANCHOR_RIGHT")
                        GameTooltip:ClearLines()
                        slot:OnEnter()
                        local tooltipRank
                        for i = 1, GameTooltip:NumLines() do
                            local right = _G["GameTooltipTextRight" .. i]
                            if right then
                                local rightText = right:GetText()
                                if rightText then
                                    local rankMatch = rightText:match("Rank (%d+)/%d+")
                                    if rankMatch then
                                        tooltipRank = tonumber(rankMatch)
                                        break
                                    end
                                end
                            end
                        end
                        GameTooltip:Hide()
                        local rank = tooltipRank or 1
                        MyGearTrackerDB.equippedCurios[slotType] = options[entryID].name .. " (Rank " .. rank .. "/4)"
                        print(slotType .. " curio synced: " .. MyGearTrackerDB.equippedCurios[slotType])
                    end
                end
            end

            -- Sync available curios
            local curios = {}
            for slotType, slot in pairs(slots) do
                if slot and slot.selectionNodeOptions then
                    for entryID, option in pairs(slot.selectionNodeOptions) do
                        GameTooltip:SetOwner(slot, "ANCHOR_RIGHT")
                        GameTooltip:ClearLines()
                        slot:OnEnter()
                        local tooltipRank
                        for i = 1, GameTooltip:NumLines() do
                            local right = _G["GameTooltipTextRight" .. i]
                            if right then
                                local rightText = right:GetText()
                                if rightText then
                                    local rankMatch = rightText:match("Rank (%d+)/%d+")
                                    if rankMatch then
                                        tooltipRank = tonumber(rankMatch)
                                        break
                                    end
                                end
                            end
                        end
                        GameTooltip:Hide()
                        local rank = tooltipRank or 1
                        -- Avoid duplicates by checking existing names
                        local exists = false
                        for _, curio in ipairs(curios) do
                            if curio.name == option.name then
                                exists = true
                                break
                            end
                        end
                        if not exists then
                            table.insert(curios, { name = option.name, rank = rank })
                        end
                    end
                end
            end
            if #curios > 0 then
                MyGearTrackerDB.availableCurios = curios
                print("Available curios synced: " .. #curios .. " items found.")
            else
                print("No available curios found in UI.")
            end
        end)
    else
        print("Error: Open Delve UI (H key) and Brann's config tab to sync curios.")
    end
end

-- Function to retrieve available curios (post-login fallback)
local function GetAvailableCurios()
    return MyGearTrackerDB.availableCurios
end

-- Function to retrieve Brann Bronzebeard's current delve companion info
function GetBrannInfo()
    local brannInfo = {}

    -- Static identifiers
    brannInfo.name = "Brann Bronzebeard"
    brannInfo.npcID = 206977
    brannInfo.isDelveCompanion = true

    -- Level: Map from reputation (Faction ID 2615)
    local repInfo = C_Reputation.GetFactionDataByID(2615)
    if repInfo and repInfo.currentReactionThreshold then
        local totalXP = repInfo.currentReactionThreshold -- e.g., 32500
        local xpPerLevel = 42000 / 25 -- 1680
        local baseLevel = math.floor(totalXP / xpPerLevel) + 1
        brannInfo.level = math.min(baseLevel + 1, 25) -- Offset to match 21
    else
        brannInfo.level = 21
    end

    -- Role: Static
    brannInfo.role = "Healer"

    -- Equipped Curios: Pull from saved variables
    brannInfo.equippedCurios = {
        combat = MyGearTrackerDB.equippedCurios.combat,
        utility = MyGearTrackerDB.equippedCurios.utility
    }

    -- Available Curios: Fetch from saved list
    brannInfo.availableCurios = GetAvailableCurios()

    return brannInfo
end
-- Print function
local function PrintBrannInfo()
    local info = GetBrannInfo()
    print("Brann Bronzebeard Info:")
    print("  Name: " .. info.name)
    print("  Level: " .. info.level)
    print("  Role: " .. info.role)
    print("  Equipped Curios:")
    print("    Combat: " .. info.equippedCurios.combat)
    print("    Utility: " .. info.equippedCurios.utility)
    if #info.availableCurios > 0 then
        print("  Available Curios:")
        for i, curio in ipairs(info.availableCurios) do
            print("    " .. i .. ". " .. curio.name .. " (Rank " .. curio.rank .. ")")
        end
    end
end


-- Gear Info with Upgrade Status and Enchant Info
local function GetGearInfo()
    local gearText = "--- Equipped Gear ---\n"
    exportData.gear = {}
    for slot = 1, 17 do
        local itemLink = GetInventoryItemLink("player", slot)
        if itemLink then
            local itemName = GetItemInfo(itemLink) or "Loading..."
            local itemLevel = GetDetailedItemLevelInfo(itemLink) or "N/A"
            local upgradeInfo = "N/A"
            local enchantName = nil

            tooltipScanner:ClearLines()
            tooltipScanner:SetHyperlink(itemLink)

            -- Print the item link and slot for debugging
            print("Scanning tooltip for:", itemLink, "(Slot", slot, ")")

            for i = 1, tooltipScanner:NumLines() do
                local line = _G["GearTrackerTooltipTextLeft".. i]
                if line then
                    local text = line:GetText()
                    if text then
                        -- Print the tooltip line for debugging
                        print("Tooltip line:", text)

                        -- Check for upgrade info
                        local tier, current, max = text:match("(%a+)%s+(%d+)/(%d+)")
                        if tier and current and max then
                            upgradeInfo = tier.. " ".. current.. "/".. max
                        elseif text:match("Upgrade Level:%s+(%a+)%s+(%d+)/(%d+)") then
                            tier, current, max = text:match("Upgrade Level:%s+(%a+)%s+(%d+)/(%d+)")
                            upgradeInfo = tier.. " ".. current.. "/".. max
                        end

                        -- Check for enchant info (new generic pattern)
                        if text:match("^Enchanted:") then -- Match lines starting with "Enchanted:"
                            enchantName = text:gsub("^Enchanted: ", "") -- Remove the "Enchanted: " prefix
                            print("Enchant found:", enchantName)

                            -- Remove extra characters from enchantName
                            enchantName = enchantName:gsub("|A.*|a", "")
                        end
                    end
                end
            end

            -- Add gear info to gearText
            gearText = gearText.. string.format("Slot %d: %s (iLvl: %s, Upgrade: %s, Enchant: %s)\n", slot, itemName, itemLevel, upgradeInfo, enchantName or "None")

            -- Add gear info to exportData.gear
            exportData.gear[slot] = {
                name = itemName,
                itemLevel = itemLevel,
                upgrade = upgradeInfo,
                enchant = enchantName -- Allow blank enchant values
            }
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
            currencyText = currencyText.. string.format("%s: %d (Max: %d)\n", currencyInfo.name, currencyInfo.quantity, currencyInfo.maxQuantity)
            exportData.currencies[currencyInfo.name] = { quantity = currencyInfo.quantity, maxQuantity = currencyInfo.maxQuantity }
        end
    end
    return currencyText
end

-- Inventory Items (All Bags)
local function GetInventoryItems()
    local inventoryText = "--- Inventory Items ---\n"
    exportData.inventory = {}
    for bagID = 0, 4 do
        local numSlots = C_Container.GetContainerNumSlots(bagID)
        for slot = 1, numSlots do
            local itemLink = C_Container.GetContainerItemLink(bagID, slot)
            if itemLink then
                local itemName = GetItemInfo(itemLink) or "Unknown Item"
                local itemInfo = C_Container.GetContainerItemInfo(bagID, slot)
                local quantity = itemInfo and itemInfo.stackCount or 1
                local itemType = select(6, GetItemInfo(itemLink)) or "Unknown"
                local isGear = itemType == "Weapon" or itemType == "Armor"
                local slotKey = tostring(bagID).. "-".. tostring(slot)
                if isGear then
                    local itemLevel = GetDetailedItemLevelInfo(itemLink) or "N/A"
                    local upgradeInfo = "N/A"
                    tooltipScanner:ClearLines()
                    tooltipScanner:SetHyperlink(itemLink)
                    for i = 1, tooltipScanner:NumLines() do
                        local line = _G["GearTrackerTooltipTextLeft".. i]
                        if line then
                            local text = line:GetText()
                            if text then
                                local tier, current, max = text:match("(%a+)%s+(%d+)/(%d+)")
                                if tier and current and max then
                                    upgradeInfo = tier.. " ".. current.. "/".. max
                                    break
                                elseif text:match("Upgrade Level:%s+(%a+)%s+(%d+)/(%d+)") then
                                    tier, current, max = text:match("Upgrade Level:%s+(%a+)%s+(%d+)/(%d+)")
                                    upgradeInfo = tier.. " ".. current.. "/".. max
                                    break
                                end
                            end
                        end
                    end
                    exportData.inventory[slotKey] = {
                        name = itemName,
                        itemLevel = itemLevel,
                        upgrade = upgradeInfo,
                        quantity = quantity
                    }
                else
                    exportData.inventory[slotKey] = {
                        name = itemName,
                        quantity = quantity
                    }
                end
                inventoryText = inventoryText.. string.format("Bag %d Slot %d: %s (Qty: %d)\n", bagID, slot, itemName, quantity)
            end
        end
    end
    return inventoryText
end

-- Get character stats (Attributes and Enhancements)
local function GetCharacterStats()
    local statsText = "--- Character Stats ---\n"
    exportData.stats = {}
    local class = select(2, UnitClass("player"))
    local specID = GetSpecialization() and select(2, GetSpecializationInfo(GetSpecialization())) or 0

    -- Attributes Section
    if class == "HUNTER" or class == "ROGUE" or class == "SHAMAN" or class == "MONK" or class == "DEMONHUNTER" then
        exportData.stats.agility = UnitStat("player", 2) -- STAT_AGILITY
    elseif class == "WARRIOR" or class == "PALADIN" or class == "DEATHKNIGHT" then
        exportData.stats.strength = UnitStat("player", 1) -- STAT_STRENGTH
    elseif class == "MAGE" or class == "PRIEST" or class == "WARLOCK" or class == "DRUID" or class == "EVOKER" then
        exportData.stats.intellect = UnitStat("player", 4) -- STAT_INTELLECT
    end
    exportData.stats.stamina = UnitStat("player", 3) -- STAT_STAMINA
    exportData.stats.armor = select(2, UnitArmor("player")) -- Base Armor value

    -- Enhancements Section (all specs get these, as percentages)
    exportData.stats.criticalStrike = GetCritChance() -- Percentage
    exportData.stats.haste = GetHaste() -- Percentage
    exportData.stats.mastery = GetMasteryEffect() -- Percentage (already correct)
    exportData.stats.versatility = GetCombatRatingBonus(29) -- CR_VERSATILITY_DAMAGE_DONE, Percentage

    -- Spec-specific Enhancements (tank stats)
    if class == "WARRIOR" and specID == 73 or  -- Protection Warrior
       class == "PALADIN" and specID == 66 or  -- Protection Paladin
       class == "DEATHKNIGHT" and specID == 250 or  -- Blood Death Knight
       class == "MONK" and specID == 268 or  -- Brewmaster Monk
       class == "DRUID" and specID == 104 or  -- Guardian Druid
       class == "DEMONHUNTER" and specID == 581 then  -- Vengeance Demon Hunter
        exportData.stats.dodge = GetDodgeChance() -- Percentage
        exportData.stats.parry = GetParryChance() -- Percentage
        exportData.stats.block = GetBlockChance() -- Percentage
    end

    -- Format for text display (not used in JSON, just for consistency)
    if exportData.stats.strength then statsText = statsText.. string.format("Strength: %d\n", exportData.stats.strength) end
    if exportData.stats.agility then statsText = statsText.. string.format("Agility: %d\n", exportData.stats.agility) end
    if exportData.stats.intellect then statsText = statsText.. string.format("Intellect: %d\n", exportData.stats.intellect) end
    statsText = statsText.. string.format("Stamina: %d\n", exportData.stats.stamina)
    statsText = statsText.. string.format("Armor: %d\n", exportData.stats.armor)
    statsText = statsText.. string.format("Critical Strike: %.2f%%\n", exportData.stats.criticalStrike)
    statsText = statsText.. string.format("Haste: %.2f%%\n", exportData.stats.haste)
    statsText = statsText.. string.format("Mastery: %.2f%%\n", exportData.stats.mastery)
    statsText = statsText.. string.format("Versatility: %.2f%%\n", exportData.stats.versatility)
    if exportData.stats.dodge then statsText = statsText.. string.format("Dodge: %.2f%%\n", exportData.stats.dodge) end
    if exportData.stats.parry then statsText = statsText.. string.format("Parry: %.2f%%\n", exportData.stats.parry) end
    if exportData.stats.block then statsText = statsText.. string.format("Block: %.2f%%\n", exportData.stats.block) end

    return statsText
end

-- Get spec name by ID (placeholder for future use)
function GetSpecNameByID(specID)
    print("Calling spec list with")
    print(specID)
    local specList = {
        [250] = "Blood", [251] = "Frost", [252] = "Unholy",
        [577] = "Havoc", [581] = "Vengeance",
        [102] = "Balance", [103] = "Feral", [104] = "Guardian", [105] = "Restoration",
        [253] = "Beast Mastery", [254] = "Marksmanship", [255] = "Survival",
        [62] = "Arcane", [63] = "Fire", [64] = "Frost",
        [268] = "Brewmaster", [269] = "Windwalker", [270] = "Mistweaver",
        [65] = "Holy", [66] = "Protection", [70] = "Retribution",
        [256] = "Discipline", [257] = "Holy", [258] = "Shadow",
        [259] = "Assassination", [260] = "Outlaw", [261] = "Subtlety",
        [262] = "Elemental", [263] = "Enhancement", [264] = "Restoration",
        [265] = "Affliction", [266] = "Demonology", [267] = "Destruction",
        [71] = "Arms", [72] = "Fury", [73] = "Protection",
        [1467] = "Devastation", [1468] = "Preservation", [1473] = "Augmentation"
    }
    return specID -- Pass-through for now
end

-- Update UI
local function UpdateUI()
    local fullText = GetGearInfo().. "\n".. GetCurrencyInfo()
    textArea:SetText(fullText)
end

-- JSON.stringify equivalent for Lua
local function to_json(tbl, indent)
    if not indent then indent = 0 end
    local str = "{\n"
    local first = true
    for k, v in pairs(tbl) do
        if not first then str = str.. ",\n" end
        first = false
        local formatting = string.rep("  ", indent + 1)
        if type(v) == "table" then
            str = str.. formatting.. "\"".. tostring(k).. "\": ".. to_json(v, indent + 1)
        elseif type(v) == "number" then
            str = str.. formatting.. "\"".. tostring(k).. "\": ".. tostring(v)
        else
            str = str.. formatting.. "\"".. tostring(k).. "\": \"".. tostring(v).. "\""
        end
    end
    str = str.. "\n".. string.rep("  ", indent).. "}"
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

local function UpdateExportUI(retryCount)
    retryCount = retryCount or 0
    UpdateUI()
    GetInventoryItems() -- Populate inventory data
    GetCharacterStats() -- Populate stats data
    local overallILvl, equippedILvl = GetAverageItemLevel()
    local hasUnknown = false
    for _, item in pairs(exportData.inventory) do
        if item.name == "Unknown Item" then
            hasUnknown = true
            break
        end
    end
    local jsonData = {
        character = {
            name = UnitName("player"),
            class = select(2, UnitClass("player")),
            spec = GetSpecNameByID(select(2, GetSpecializationInfo(GetSpecialization())) or 0),
            level = UnitLevel("player"),
            overallItemLevel = math.floor(equippedILvl),
            gear = {},
            currencies = exportData.currencies,
            inventory = exportData.inventory,
            stats = exportData.stats,
            brann = GetBrannInfo() -- Add Brann info to the JSON output
        },
    }
    for k, v in pairs(exportData.gear) do
        jsonData.character.gear["slot".. k] = v
    end
    local exportString = to_json(jsonData)
    exportTextArea:SetText(exportString)
    exportScrollFrame:UpdateScrollChildRect() -- Force scroll update
    exportFrame:Show() -- Ensure frame redraws
    if hasUnknown and retryCount < 5 then -- Max 5 retries
        C_Timer.After(1, function() UpdateExportUI(retryCount + 1) end)
    end
end

SLASH_MYGEARBRANN1 = "/mgtbrann"
SlashCmdList["MYGEARBRANN"] = function()
    PrintBrannInfo()
end

SLASH_MYGEAREXPORT1 = "/mgtexport"
SlashCmdList["MYGEAREXPORT"] = function()
    UpdateExportUI()
end

SLASH_MGTSETCURIO1 = "/mgtsetcurio"
SlashCmdList["MGTSETCURIO"] = function(msg)
    local slot = msg:match("^(%S+)")
    if slot then
        SetCurio(slot)
    else
        print("Usage: /mgtsetcurio [combat|utility]")
    end
end