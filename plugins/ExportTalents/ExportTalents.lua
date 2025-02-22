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
    local output = "Debug Output:\n"
    local talentOutput = "\nTalents:\n"
    local heroOutput = "\nHero Talents:\n"

    -- Get active talent tree information
    local specID = PlayerUtil.GetCurrentSpecID()
    if not specID then
        output = output .. "Error: Could not retrieve current spec ID\n"
        ShowOutputInWindow(output)
        return
    end
    local specName = GetSpecializationNameForSpecID(specID)
    talentOutput = talentOutput .. "Specialization: " .. (specName or "Unknown") .. "\n"

    local configID = C_ClassTalents.GetActiveConfigID()
    if not configID then
        output = output .. "Error: No active config ID found\n"
        ShowOutputInWindow(output)
        return
    end
    output = output .. "ConfigID: " .. configID .. "\n"

    local configInfo = C_Traits.GetConfigInfo(configID)
    output = output .. "Config TreeIDs: "
    for i, treeID in ipairs(configInfo.treeIDs or {}) do
        output = output .. treeID .. (i < #configInfo.treeIDs and ", " or "")
    end
    output = output .. "\n"

    local treeID = configInfo.treeIDs and configInfo.treeIDs[1]
    output = output .. "Main TreeID: " .. (treeID or "nil") .. "\n"

    if treeID then
        local treeInfo = C_Traits.GetTreeInfo(configID, treeID)
        local treeName = treeInfo.name or specName or ("Tree ID " .. treeID)
        talentOutput = talentOutput .. "Talent Tree: " .. treeName .. "\n"

        -- Iterate through nodes in the talent tree
        local nodes = C_Traits.GetTreeNodes(treeID)
        output = output .. "Found " .. #nodes .. " nodes in tree " .. treeID .. "\n"
        for _, nodeID in ipairs(nodes) do
            local nodeInfo = C_Traits.GetNodeInfo(configID, nodeID)
            if nodeInfo and nodeInfo.activeRank > 0 then
                output = output .. "NodeID: " .. nodeID .. " ActiveRank: " .. nodeInfo.activeRank .. " Name: " .. (nodeInfo.name or "nil")
                local talentName = nodeInfo.name
                local entryID = nodeInfo.activeEntry and nodeInfo.activeEntry.entryID
                if entryID then
                    local entryInfo = C_Traits.GetEntryInfo(configID, entryID)
                    if entryInfo and entryInfo.definitionID then
                        local defInfo = C_Traits.GetDefinitionInfo(entryInfo.definitionID)
                        output = output .. " EntryID: " .. entryID .. " DefinitionID: " .. entryInfo.definitionID
                        if defInfo and defInfo.spellID then
                            output = output .. " SpellID: " .. defInfo.spellID
                            local spellInfo = C_Spell.GetSpellInfo(defInfo.spellID)
                            talentName = spellInfo and spellInfo.name or "Unknown (SpellID: " .. defInfo.spellID .. ")"
                        else
                            output = output .. " (no defInfo)"
                        end
                    else
                        output = output .. " EntryID: " .. entryID .. " (no entryInfo)"
                    end
                else
                    output = output .. " (no activeEntry)"
                end
                output = output .. "\n"

                talentName = talentName or "Unknown Talent"
                local ranks = nodeInfo.activeRank .. "/" .. nodeInfo.maxRanks
                talentOutput = talentOutput .. "  " .. talentName .. ": " .. ranks .. "\n"
            end
        end
    else
        talentOutput = talentOutput .. "No Talent Tree Found\n"
    end

    -- Hero Talents (Workaround with known Pack Leader node IDs)
    local heroSpecID = C_ClassTalents.GetActiveHeroTalentSpec()
    output = output .. "HeroSpecID: " .. (heroSpecID or "nil") .. "\n"
    if heroSpecID then
        local heroTreeID = 801 -- Pack Leader
        output = output .. "HeroTreeID: " .. heroTreeID .. "\n"
        local nodes = C_Traits.GetTreeNodes(heroTreeID)
        output = output .. "Found " .. #nodes .. " nodes in hero tree " .. heroTreeID .. "\n"
        -- If no nodes, try known Pack Leader node IDs
        if #nodes == 0 then
            local packLeaderNodes = {103200, 103201, 103202, 103203, 103204, 103205, 103206, 103207, 103208, 103209, 103210, 103211} -- From Wowhead/community data
            output = output .. "Trying known Pack Leader nodes: " .. #packLeaderNodes .. "\n"
            for _, nodeID in ipairs(packLeaderNodes) do
                local nodeInfo = C_Traits.GetNodeInfo(configID, nodeID)
                if nodeInfo then
                    output = output .. "Hero NodeID: " .. nodeID .. " ActiveRank: " .. (nodeInfo.activeRank or "nil") .. " Name: " .. (nodeInfo.name or "nil")
                    local talentName = nodeInfo.name
                    local entryID = nodeInfo.activeEntry and nodeInfo.activeEntry.entryID
                    if entryID then
                        local entryInfo = C_Traits.GetEntryInfo(configID, entryID)
                        if entryInfo and entryInfo.definitionID then
                            local defInfo = C_Traits.GetDefinitionInfo(entryInfo.definitionID)
                            output = output .. " EntryID: " .. entryID .. " DefinitionID: " .. entryInfo.definitionID
                            if defInfo and defInfo.spellID then
                                output = output .. " SpellID: " .. defInfo.spellID
                                local spellInfo = C_Spell.GetSpellInfo(defInfo.spellID)
                                talentName = spellInfo and spellInfo.name or "Unknown (SpellID: " .. defInfo.spellID .. ")"
                            else
                                output = output .. " (no defInfo)"
                            end
                        else
                            output = output .. " EntryID: " .. entryID .. " (no entryInfo)"
                        end
                    else
                        output = output .. " (no activeEntry)"
                    end
                    output = output .. "\n"

                    if nodeInfo.activeRank > 0 then
                        talentName = talentName or "Unknown Hero Talent"
                        local ranks = nodeInfo.activeRank .. "/" .. nodeInfo.maxRanks
                        heroOutput = heroOutput .. "  " .. talentName .. ": " .. ranks .. "\n"
                    end
                end
            end
        end
    else
        heroOutput = heroOutput .. "No Hero Talents Selected\n"
    end

    ShowOutputInWindow(output .. talentOutput .. heroOutput)
end

-- Slash command handler
SLASH_EXPORTTALENTS1 = "/exporttalents"
SlashCmdList["EXPORTTALENTS"] = function(msg)
    ExportTalents()
end
