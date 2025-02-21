-- Create a frame to handle events
local frame = CreateFrame("Frame", "TameCheck", UIParent)

-- Default settings
local defaults = {
    searchTarget = "Soaring Plainshawk",
    alertSound = 552144 -- Default to "how are you" voice
}

-- Saved variables
TameCheckDB = TameCheckDB or CopyTable(defaults)

-- Check if the target is tameable
local function IsTameable(unit)
    if not UnitExists(unit) then return false end
    if UnitPlayerControlled(unit) then return false end
    
    local creatureType = UnitCreatureType(unit)
    if creatureType ~= "Beast" then return false end
    
    local classification = UnitClassification(unit)
    if classification == "worldboss" then return false end
    
    local playerLevel = UnitLevel("player")
    local targetLevel = UnitLevel(unit)
    if targetLevel > playerLevel then return false end
    
    local spec = GetSpecialization()
    local isBM = spec and GetSpecializationInfo(spec) == 253
    return true
end

-- Update the tooltip with tameable status
local function UpdateTooltip(tooltip)
    local unit = "target"
    if UnitExists(unit) then
        local tameable = IsTameable(unit)
        local line = tameable and "|cff00ff00Tameable: Yes|r" or "|cffff0000Tameable: No|r"
        tooltip:AddLine(line)
    end
end

-- Play the alert sound using ID
local function PlayAlertSound(soundID)
    local success = PlaySoundFile(soundID, "Master")
    return success
end

-- Debug sound playback attempts
local function DebugSoundPlay(soundID, success)
    if success then
        print("Sound played successfully: ID " .. soundID)
    else
        print("Failed to play sound: ID " .. soundID .. " - Check ID or volume settings")
    end
end

-- Scan nearby enemies for the target tame
local function ScanForTame()
    local searchTarget = TameCheckDB.searchTarget:lower()
    if searchTarget == "" then return end
    
    for i = 1, 40 do
        local unit = "nameplate" .. i
        if UnitExists(unit) and not UnitIsPlayer(unit) then
            local name = UnitName(unit):lower()
            if name == searchTarget and IsTameable(unit) then
                local soundSuccess = PlayAlertSound(TameCheckDB.alertSound)
                DebugSoundPlay(TameCheckDB.alertSound, soundSuccess)
                if not soundSuccess then
                    local fallbackID = 567458 -- AuctionWindowOpen ID
                    local fallbackSuccess = PlayAlertSound(fallbackID)
                    DebugSoundPlay(fallbackID, fallbackSuccess)
                end
                print("TAME FOUND: " .. UnitName(unit) .. "!")
                return
            end
        end
    end
end

-- Create the options panel edit box
local function CreateEditBox(parent)
    local editBox = CreateFrame("EditBox", nil, parent, "InputBoxTemplate")
    editBox:SetPoint("TOPLEFT", 10, -40)
    editBox:SetSize(200, 20)
    editBox:SetAutoFocus(false)
    editBox:SetText(TameCheckDB.searchTarget)
    editBox:SetScript("OnEnterPressed", function(self)
        TameCheckDB.searchTarget = self:GetText()
        self:ClearFocus()
    end)
    editBox:SetScript("OnEscapePressed", function(self)
        self:SetText(TameCheckDB.searchTarget)
        self:ClearFocus()
    end)
    local editLabel = parent:CreateFontString(nil, "OVERLAY", "GameFontHighlight")
    editLabel:SetPoint("BOTTOMLEFT", editBox, "TOPLEFT", 0, 2)
    editLabel:SetText("Search Target (e.g., Soaring Plainshawk)")
    return editBox
end

-- Create the sound dropdown with sound IDs
local function CreateSoundDropdown(parent, editBox)
    local soundDropdown = CreateFrame("Frame", "TameCheckSoundDropdown", parent, "UIDropDownMenuTemplate")
    soundDropdown:SetPoint("TOPLEFT", editBox, "BOTTOMLEFT", -15, -10)
    local soundOptions = {
        { text = "How Are You", value = 552144 }, -- Your working sound
        { text = "Auction Open", value = 567458 },
        { text = "Quest Accept", value = 567482 },
        { text = "Raid Warning", value = 567514 },
    }
    UIDropDownMenu_Initialize(soundDropdown, function(self)
        for _, option in ipairs(soundOptions) do
            local info = UIDropDownMenu_CreateInfo()
            info.text = option.text
            info.value = option.value
            info.func = function(self)
                TameCheckDB.alertSound = self.value
                UIDropDownMenu_SetText(soundDropdown, option.text)
                local success = PlayAlertSound(self.value)
                DebugSoundPlay(self.value, success)
            end
            UIDropDownMenu_AddButton(info)
        end
    end)
    UIDropDownMenu_SetWidth(soundDropdown, 150)
    UIDropDownMenu_SetText(soundDropdown, "Select Sound")
    for _, option in ipairs(soundOptions) do
        if option.value == TameCheckDB.alertSound then
            UIDropDownMenu_SetText(soundDropdown, option.text)
            break
        end
    end
    local soundLabel = parent:CreateFontString(nil, "OVERLAY", "GameFontHighlight")
    soundLabel:SetPoint("BOTTOMLEFT", soundDropdown, "TOPLEFT", 16, 2)
    soundLabel:SetText("Alert Sound")
end

-- Setup the options panel
local function InitializeOptions()
    local panel = CreateFrame("Frame")
    panel.name = "TameCheck"
    local title = panel:CreateFontString(nil, "OVERLAY", "GameFontNormalLarge")
    title:SetPoint("TOPLEFT", 10, -10)
    title:SetText("TameCheck Options")
    local editBox = CreateEditBox(panel)
    CreateSoundDropdown(panel, editBox)
    local category = Settings.RegisterCanvasLayoutCategory(panel, "TameCheck")
    Settings.RegisterAddOnCategory(category)
end

-- Handle events
local function HandleEvents(self, event, ...)
    print("Event: " .. event)
    if event == "PLAYER_TARGET_CHANGED" then
        if UnitExists("target") then
            GameTooltip:SetUnit("target")
        end
    elseif event == "PLAYER_LOGIN" then
        InitializeOptions()
        if UnitExists("target") then
            GameTooltip:SetUnit("target")
        end
    end
end

-- Periodic scanning
local function ScanPeriodically(self, elapsed)
    local lastScan = self.lastScan or 0
    lastScan = lastScan + elapsed
    if lastScan >= 2 then
        ScanForTame()
        lastScan = 0
    end
    self.lastScan = lastScan
end

-- Initialize the addon
hooksecurefunc(GameTooltip, "SetUnit", UpdateTooltip)
frame:RegisterEvent("PLAYER_TARGET_CHANGED")
frame:RegisterEvent("PLAYER_LOGIN")
frame:SetScript("OnEvent", HandleEvents)
frame:SetScript("OnUpdate", ScanPeriodically)