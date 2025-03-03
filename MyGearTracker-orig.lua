-- Create a frame to handle events
local frame = CreateFrame("Frame")
frame:RegisterEvent("PLAYER_LOGIN") -- Trigger when you log in

-- Function to get gear details
local function GetGearInfo()
    print("--- Equipped Gear ---")
    for slot = 1, 17 do -- Slots 1-17 cover most equippable gear (head, shoulders, etc.)
        local itemLink = GetInventoryItemLink("player", slot)
        if itemLink then
            -- Extract item name, item level, and upgrade info
            local itemName = GetItemInfo(itemLink)
            local itemLevel = GetDetailedItemLevelInfo(itemLink) or "N/A"

            -- Check for upgrade status (like Veteran 3/8)
            local upgradeInfo = "N/A"
            local currentUpgrade, maxUpgrade = C_ItemUpgrade.GetItemUpgradeInfo(itemLink)
            if currentUpgrade and maxUpgrade then
                upgradeInfo = string.format("%d/%d", currentUpgrade, maxUpgrade)
            end

            print(string.format("Slot %d: %s (iLvl: %s, Upgrade: %s)", slot, itemName or "Unknown", itemLevel, upgradeInfo))
        end
    end
end

-- Function to get currency info
local function GetCurrencyInfo()
    print("--- Currency ---")
    for i = 1, C_CurrencyInfo.GetCurrencyListSize() do
        local currencyInfo = C_CurrencyInfo.GetCurrencyListInfo(i)
        if currencyInfo and not currencyInfo.isHeader then
            print(string.format("%s: %d (Max: %d)", currencyInfo.name, currencyInfo.quantity, currencyInfo.maxQuantity))
        end
    end
end

-- Slash command to trigger the info
SLASH_MYGEARTRACKER1 = "/mgt"
SlashCmdList["MYGEARTRACKER"] = function()
    GetGearInfo()
    GetCurrencyInfo()
end

-- Event handler
frame:SetScript("OnEvent", function(self, event, ...)
    if event == "PLAYER_LOGIN" then
        print("My Gear Tracker loaded! Use /mgt to see your gear and currency.")
    end
end)