-- WarcraftFactionExporter
-- Author: Kbyte
-- Version: 1.0

local function GetFactionData()
  local factionData = {}
  factionData.factionReputation = {}  -- Top-level key for faction reputation data

  local numFactions = C_Reputation.GetNumFactions()  -- Get the total number of factions
  print("Number of factions:", numFactions)  -- Print the number of factions

  for i = 1, numFactions do
    local factionID = i  -- Use the loop index as factionID
    print("Faction ID:", factionID)  -- Print the current faction ID

    local name, _, standingID = C_Reputation.GetFactionInfoByID(factionID)  -- Corrected function call
    print("Made it to this point.")
    local _, _, _, _, _, _, reputationLevel = C_Reputation.GetFactionInfoByID(factionID)  -- Corrected function call
    print("Made it further.")
    if name then
      print("I am inside if name then")
      local factionInfo = {}
      factionInfo.standing = standingID  -- Using standingID instead of calculating standing text
      factionInfo.level = reputationLevel
      factionInfo.factionID = factionID

      factionData.factionReputation[name] = factionInfo  -- Use faction name as key
    end
  end

  return factionData
end


local function ExportFactionData()
  local factionData = GetFactionData()
  local exportFrame = CreateFrame("EditBox", nil, UIParent)
  exportFrame:SetMultiLine(true)
  exportFrame:SetSize(500, 400)
  exportFrame:SetText(JSON.encode(factionData, { indent = true }))  -- Indent for human readability
  exportFrame:Show()
end


SLASH_WARCRAFTFACTIONEXPORTER1 = "/wfe"
SlashCmdList["WARCRAFTFACTIONEXPORTER"] = function()
  ExportFactionData()
end
