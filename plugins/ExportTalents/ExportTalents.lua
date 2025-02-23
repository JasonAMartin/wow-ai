-- Create the UI frame
local frame = CreateFrame("Frame", "ExportTalentsFrame", UIParent, "BasicFrameTemplateWithInset")
frame:SetSize(400, 500)
frame:SetPoint("CENTER")
frame:Hide()

local scrollFrame = CreateFrame("ScrollFrame", nil, frame, "UIPanelScrollFrameTemplate")
scrollFrame:SetPoint("TOPLEFT", 8, -30)
scrollFrame:SetPoint("BOTTOMRIGHT", -30, 8)

local editBox = CreateFrame("EditBox", nil, scrollFrame)
editBox:SetMultiLine(true)
editBox:SetFontObject("ChatFontNormal")
editBox:SetWidth(360)
editBox:EnableMouse(true)
editBox:SetHyperlinksEnabled(false)
editBox:SetScript("OnEscapePressed", function(self) frame:Hide() end)
scrollFrame:SetScrollChild(editBox)

frame.title = frame:CreateFontString(nil, "OVERLAY", "GameFontHighlight")
frame.title:SetPoint("TOP", 0, -5)
frame.title:SetText("Export Talents")

local function ShowOutputInWindow(text)
    editBox:SetText(text)
    frame:Show()
    editBox:SetFocus()
    editBox:HighlightText()
end

local function ExportTalents()
    -- Known Hero Talent Spell IDs for Paladin, Druid, and Hunter specs
    local heroTalentSpellIDs = {
        -- Lightsmith (803) - Prot/Holy Paladin
        [426427] = true, [431653] = true, [431539] = true, [431541] = true, [431566] = true,
        [431576] = true, [431657] = true, [431568] = true, [431570] = true, [431655] = true, [431536] = true,
        -- Herald of the Sun (805) - Holy/Retribution Paladin
        [426256] = true, [426296] = true, [426264] = true, [431481] = true, [431482] = true,
        [431483] = true, [431484] = true, [431485] = true, [431486] = true, [431487] = true, [431488] = true,
        -- Templar (807) - Retribution/Protection Paladin
        [426564] = true, [431730] = true, [431463] = true, [432463] = true, [425518] = true,
        [431551] = true, [431533] = true, [432615] = true, [432626] = true, [432459] = true, [426630] = true,
        -- Druid of the Claw (809) - Guardian/Feral Druid
        [429261] = true, [429262] = true, [429263] = true, [429264] = true, [429265] = true,
        [429266] = true, [429267] = true, [429268] = true, [429269] = true, [429270] = true, [429271] = true,
        -- Wildstalker (811) - Guardian/Restoration/Feral Druid
        [429272] = true, [429273] = true, [429274] = true, [429275] = true, [429276] = true,
        [429277] = true, [429278] = true, [429279] = true, [429280] = true, [429281] = true, [429282] = true,
        -- Keeper of the Grove (813) - Restoration/Balance Druid
        [429283] = true, [429284] = true, [429285] = true, [429286] = true, [429287] = true,
        [429288] = true, [429289] = true, [429290] = true, [429291] = true, [429292] = true, [429293] = true,
        -- Elune’s Chosen (815) - Balance/Guardian Druid
        [428655] = true, [429539] = true, [424113] = true, [429530] = true, [429523] = true,
        [429533] = true, [429529] = true, [429538] = true, [429520] = true, [433831] = true,
        [429532] = true, [424058] = true,
        -- Pack Leader (801) - Beast Mastery/Survival Hunter
        [445404] = true, [445505] = true, [445707] = true, [445708] = true, [445710] = true,
        [445715] = true, [445717] = true, [445721] = true, [450369] = true, [445696] = true,
        [445700] = true, [445702] = true, [466932] = true,
        -- Dark Ranger (817) - Beast Mastery/Marksmanship Hunter
        [426341] = true, [426342] = true, [426343] = true, [426344] = true, [426345] = true,
        [426346] = true, [426347] = true, [426348] = true, [426349] = true, [426350] = true, [426351] = true,
    }

    -- Hero Spec ID to Name Mapping
    local heroSpecNames = {
        [41] = "Lightsmith",          -- Protection/Holy Paladin
        [42] = "Herald of the Sun",   -- Holy/Retribution Paladin
        [45] = "Templar",             -- Retribution/Protection Paladin
        [46] = "Druid of the Claw",   -- Guardian/Feral Druid
        [47] = "Wildstalker",         -- Guardian/Restoration/Feral Druid
        [48] = "Keeper of the Grove", -- Restoration/Balance Druid
        [44] = "Elune’s Chosen",      -- Balance/Guardian Druid
        [43] = "Pack Leader",         -- Beast Mastery/Survival Hunter
        [49] = "Dark Ranger",         -- Beast Mastery/Marksmanship Hunter
    }

    -- Collect talents and hero talents
    local talents = {}
    local heroTalents = {}

    -- Get active talent tree information
    local specID = PlayerUtil.GetCurrentSpecID()
    if not specID then
        ShowOutputInWindow('{"error": "Could not retrieve current spec ID"}')
        return
    end
    local specName = GetSpecializationNameForSpecID(specID)

    local configID = C_ClassTalents.GetActiveConfigID()
    if not configID then
        ShowOutputInWindow('{"error": "No active config ID found"}')
        return
    end

    local heroSpecID = C_ClassTalents.GetActiveHeroTalentSpec()
    local heroSpecName = heroSpecID and heroSpecNames[heroSpecID] or "Unknown Hero Spec"

    local configInfo = C_Traits.GetConfigInfo(configID)
    local treeID = configInfo and configInfo.treeIDs and configInfo.treeIDs[1]

    if treeID then
        local treeInfo = C_Traits.GetTreeInfo(configID, treeID)
        local treeName = treeInfo.name or specName or ("Tree ID " .. treeID)

        -- Iterate through nodes in the talent tree
        local nodes = C_Traits.GetTreeNodes(treeID)
        for _, nodeID in ipairs(nodes) do
            local nodeInfo = C_Traits.GetNodeInfo(configID, nodeID)
            if nodeInfo and nodeInfo.activeRank > 0 then
                local talentName = nodeInfo.name
                local spellID
                local entryID = nodeInfo.activeEntry and nodeInfo.activeEntry.entryID
                if entryID then
                    local entryInfo = C_Traits.GetEntryInfo(configID, entryID)
                    if entryInfo and entryInfo.definitionID then
                        local defInfo = C_Traits.GetDefinitionInfo(entryInfo.definitionID)
                        if defInfo and defInfo.spellID then
                            spellID = defInfo.spellID
                            local spellInfo = C_Spell.GetSpellInfo(defInfo.spellID)
                            talentName = spellInfo and spellInfo.name or "Unknown (SpellID: " .. spellID .. ")"
                        end
                    end
                end
                talentName = talentName or "Unknown Talent"
                local ranks = nodeInfo.activeRank .. "/" .. nodeInfo.maxRanks
                local talentEntry = {name = talentName, ranks = ranks}
                if spellID and heroTalentSpellIDs[spellID] then
                    table.insert(heroTalents, talentEntry)
                else
                    table.insert(talents, talentEntry)
                end
            end
        end
    else
        talents = {{name = "No Talent Tree Found", ranks = "0/0"}}
    end

    -- Build JSON output with heroSpec
    local jsonOutput = '{\n  "heroSpec": "' .. heroSpecName .. '",\n  "talents": [\n'
    for i, talent in ipairs(talents) do
        jsonOutput = jsonOutput .. '    {"name": "' .. talent.name .. '", "ranks": "' .. talent.ranks .. '"}'
        if i < #talents then
            jsonOutput = jsonOutput .. ','
        end
        jsonOutput = jsonOutput .. '\n'
    end
    jsonOutput = jsonOutput .. '  ],\n  "heroTalents": [\n'
    for i, heroTalent in ipairs(heroTalents) do
        jsonOutput = jsonOutput .. '    {"name": "' .. heroTalent.name .. '", "ranks": "' .. heroTalent.ranks .. '"}'
        if i < #heroTalents then
            jsonOutput = jsonOutput .. ','
        end
        jsonOutput = jsonOutput .. '\n'
    end
    jsonOutput = jsonOutput .. '  ]\n}'

    ShowOutputInWindow(jsonOutput)
end

-- Slash command handler
SLASH_EXPORTTALENTS1 = "/exporttalents"
SlashCmdList["EXPORTTALENTS"] = function(msg)
    ExportTalents()
end