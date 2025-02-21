-- Create a frame to handle events
local frame = CreateFrame("Frame", "TameCheck", UIParent)

-- Check if the target is tameable
local function IsTameable(unit)
    if not UnitExists(unit) then return false end
    if UnitPlayerControlled(unit) then return false end -- No taming player pets
    
    local creatureType = UnitCreatureType(unit)
    if creatureType ~= "Beast" then return false end -- Must be a Beast
    
    local classification = UnitClassification(unit)
    if classification == "worldboss" then return false end -- No world bosses
    
    -- Level check (creature must be <= player level)
    local playerLevel = UnitLevel("player")
    local targetLevel = UnitLevel(unit)
    if targetLevel > playerLevel then return false end
    
    -- BM check for Exotic Beasts (placeholder)
    local spec = GetSpecialization()
    local isBM = spec and GetSpecializationInfo(spec) == 253 -- 253 is BM Hunter
    
    return true
end

-- Tooltip update function
local function UpdateTooltip(tooltip)
    print("Tooltip update triggered")
    local unit = "target"
    if UnitExists(unit) then
        local tameable = IsTameable(unit)
        local line = tameable and "|cff00ff00Tameable: Yes|r" or "|cffff0000Tameable: No|r"
        tooltip:AddLine(line)
        print("Added line: " .. line)
    end
end

-- Hook into GameTooltip for unit updates (target frame and click)
hooksecurefunc(GameTooltip, "SetUnit", UpdateTooltip)

-- Register events for target changes
frame:RegisterEvent("PLAYER_TARGET_CHANGED")
frame:RegisterEvent("PLAYER_LOGIN")
frame:SetScript("OnEvent", function(self, event, ...)
    print("Event: " .. event)
    if event == "PLAYER_TARGET_CHANGED" or event == "PLAYER_LOGIN" then
        if UnitExists("target") then
            GameTooltip:SetUnit("target") -- Force update on target change
        end
    end
end)