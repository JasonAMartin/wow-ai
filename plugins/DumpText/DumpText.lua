-- DumpText.lua
local addonName = "DumpText"
local frame = CreateFrame("Frame", "DumpFrame", UIParent, "BasicFrameTemplateWithInset")
frame:SetSize(600, 400)
frame:SetPoint("CENTER")
frame:Hide()

local scroll = CreateFrame("ScrollFrame", "DumpScroll", frame, "UIPanelScrollFrameTemplate")
scroll:SetPoint("TOPLEFT", 8, -30)
scroll:SetPoint("BOTTOMRIGHT", -30, 8)

local editBox = CreateFrame("EditBox", "DumpEditBox", scroll)
editBox:SetMultiLine(true)
editBox:SetFontObject(ChatFontNormal)
editBox:SetWidth(560)
editBox:SetAutoFocus(false)
scroll:SetScrollChild(editBox)

-- Simple recursive dump with cycle detection and depth limit
local function SimpleDump(value, indent, seen, depth)
    indent = indent or ""
    seen = seen or {}
    depth = depth or 0
    if depth > 10 then -- Limit depth to prevent stack overflow
        return indent .. "<depth limit reached>"
    end
    if type(value) == "table" then
        if seen[value] then
            return indent .. "<cycle detected: " .. tostring(value) .. ">"
        end
        seen[value] = true
        local str = "{\n"
        for k, v in pairs(value) do
            str = str .. indent .. "  [" .. tostring(k) .. "] = " .. SimpleDump(v, indent .. "  ", seen, depth + 1) .. ",\n"
        end
        return str .. indent .. "}"
    elseif type(value) == "function" then
        return indent .. "<function>"
    elseif type(value) == "userdata" then
        return indent .. "<userdata: " .. tostring(value) .. ">"
    else
        return indent .. tostring(value)
    end
end

-- Function to dump to the window
function DumpToWindow(value)
    if not frame:IsShown() then frame:Show() end
    local text = SimpleDump(value)
    editBox:SetText(text)
end

-- Slash command
SLASH_DUMPTEXT1 = "/dumptext"
SlashCmdList["DUMPTEXT"] = function(msg)
    local value = loadstring("return " .. msg)()
    if value then
        DumpToWindow(value)
    else
        print("Error: Could not evaluate " .. msg)
    end
end
