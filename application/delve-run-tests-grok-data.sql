-- Insert 5 Characters into Characters table
INSERT INTO Characters (
    class, name, spec, hero_spec, critical_strike, versatility, mastery, armor, haste, 
    stamina, agility, blocking, overall_item_level, level, dodge, strength, intellect, 
    parry, main_stat, notes
) VALUES
    -- BM Hunter
    ('Hunter', 'Kaelthas', 'Beast Mastery', 'Dark Ranger', 32.5, 15.2, 40.1, 8000, 22.3, 
     38000, 2200, 0.0, 610.2, 80, 8.5, 0, 0, 0.0, 'Agility', 'Loves pet synergy in Delves'),
    -- Protection Paladin
    ('Paladin', 'Lorianne', 'Protection', 'Templar', 18.7, 20.1, 35.8, 25000, 14.5, 
     52000, 0, 25.3, 598.7, 80, 6.2, 2800, 0, 18.9, 'Strength', 'Tanky Delve queen'),
    -- Frost Mage
    ('Mage', 'Zytheris', 'Frost', 'Frostfire', 35.9, 12.8, 38.4, 6000, 25.1, 
     34000, 0, 0.0, 615.5, 80, 5.8, 0, 2400, 0.0, 'Intellect', 'Freezes everything'),
    -- Assassination Rogue
    ('Rogue', 'Vexis', 'Assassination', 'Deathstalker', 33.2, 16.5, 42.7, 9000, 20.8, 
     36000, 2300, 0.0, 587.9, 80, 9.1, 0, 0, 0.0, 'Agility', 'Stealthy poisoner'),
    -- Restoration Druid
    ('Druid', 'Elarion', 'Restoration', 'Keeper of the Grove', 19.4, 18.3, 37.2, 7000, 23.7, 
     40000, 0, 0.0, 602.3, 80, 7.4, 0, 2600, 0.0, 'Intellect', 'Heals through anything');

-- Insert 30 Delve Runs into DelveRun table
INSERT INTO DelveRun (
    delves_id, characters_id, combat_curio_id, utility_curio_id, tier, brannLevel, 
    brannSpec, myItemLevel, bossKillTime, totalTime, completed, rewards, notes, 
    dateRun, season, partySize, difficultyModifiers
) VALUES
    -- Kaelthas (BM Hunter, id=1) - 6 runs
    (1, 1, 1, 7, 5, 80, 'DPS', 610.2, 90, 420, 1, '623 bow, 3 crests', 'Pet tanked well', '2025-02-15', 2, 1, NULL),
    (5, 1, 2, 8, 8, 80, 'DPS', 610.2, 150, 600, 1, '642 ring, 5 crests', 'Tough webs', '2025-02-20', 2, 2, 'Zekvir influence'),
    (10, 1, 3, 9, 3, 78, 'Healer', 610.2, 80, 300, 1, '610 trinket', 'Easy bandits', '2025-02-25', 2, 1, NULL),
    (13, 1, 4, 10, 11, 80, 'DPS', 610.2, 240, 900, 0, NULL, 'Wiped on Zekvir', '2025-03-01', 2, 3, 'Max difficulty'),
    (7, 1, 5, 11, 6, 80, 'DPS', 610.2, 120, 480, 1, '629 cloak', 'Undead swarm', '2025-03-03', 2, 1, NULL),
    (14, 1, 1, 7, 7, 80, 'DPS', 610.2, 130, 540, 1, '636 helm', 'Sewer chaos', '2025-03-04', 2, 2, NULL),
    
    -- Lorianne (Prot Paladin, id=2) - 6 runs
    (2, 2, 4, 11, 4, 80, 'Tank', 598.7, 100, 360, 1, '616 shield', 'Tanked miners', '2025-02-10', 2, 1, NULL),
    (6, 2, 5, 10, 9, 80, 'Tank', 598.7, 180, 720, 1, '642 plate', 'Kobyss hit hard', '2025-02-18', 2, 3, 'Zekvir influence'),
    (9, 2, 3, 9, 7, 80, 'Tank', 598.7, 140, 600, 1, '636 chest', 'Artillery dodged', '2025-02-22', 2, 2, NULL),
    (12, 2, 2, 8, 10, 80, 'Tank', 598.7, 200, 780, 0, NULL, 'Webs overwhelmed', '2025-02-28', 2, 4, NULL),
    (15, 2, 1, 7, 6, 80, 'Tank', 598.7, 110, 450, 1, '629 legs', 'Ooze messy', '2025-03-02', 2, 1, NULL),
    (3, 2, 6, 10, 8, 80, 'Tank', 598.7, 160, 660, 1, '642 shoulders', 'Spiders tanked', '2025-03-04', 2, 2, NULL),
    
    -- Zytheris (Frost Mage, id=3) - 6 runs
    (4, 3, 5, 8, 6, 80, 'Healer', 615.5, 130, 480, 1, '629 staff', 'Froze spores', '2025-02-12', 2, 1, NULL),
    (8, 3, 3, 9, 9, 80, 'DPS', 615.5, 170, 720, 1, '642 ring', 'Water slowed me', '2025-02-19', 2, 3, 'Zekvir influence'),
    (11, 3, 1, 7, 4, 80, 'DPS', 615.5, 90, 360, 1, '616 wand', 'Quick run', '2025-02-23', 2, 1, NULL),
    (13, 3, 2, 10, 11, 80, 'DPS', 615.5, 260, 960, 0, NULL, 'Zekvir too strong', '2025-03-01', 2, 5, 'Max difficulty'),
    (1, 3, 4, 11, 7, 80, 'DPS', 615.5, 140, 540, 1, '636 gloves', 'Mushrooms down', '2025-03-03', 2, 2, NULL),
    (14, 3, 6, 8, 5, 80, 'DPS', 615.5, 100, 420, 1, '623 boots', 'Sewer splash', '2025-03-04', 2, 1, NULL),
    
    -- Vexis (Ass Rogue, id=4) - 6 runs
    (3, 4, 2, 7, 5, 80, 'DPS', 587.9, 110, 450, 1, '623 dagger', 'Poisoned spiders', '2025-02-14', 2, 1, NULL),
    (7, 4, 1, 9, 8, 80, 'DPS', 587.9, 160, 660, 1, '642 cloak', 'Stealth worked', '2025-02-21', 2, 2, 'Zekvir influence'),
    (10, 4, 4, 10, 3, 80, 'DPS', 587.9, 80, 300, 1, '610 trinket', 'Bandits easy', '2025-02-26', 2, 1, NULL),
    (12, 4, 5, 11, 10, 80, 'DPS', 587.9, 210, 840, 0, NULL, 'Webs caught me', '2025-02-28', 2, 3, NULL),
    (15, 4, 3, 8, 6, 80, 'DPS', 587.9, 120, 480, 1, '629 belt', 'Ooze poisoned', '2025-03-02', 2, 1, NULL),
    (5, 4, 6, 7, 7, 80, 'DPS', 587.9, 140, 540, 1, '636 bracers', 'Nerubians bled', '2025-03-04', 2, 2, NULL),
    
    -- Elarion (Resto Druid, id=5) - 6 runs
    (6, 5, 3, 10, 4, 80, 'Healer', 602.3, 100, 360, 1, '616 staff', 'Healed through', '2025-02-11', 2, 1, NULL),
    (9, 5, 2, 9, 9, 80, 'Healer', 602.3, 180, 720, 1, '642 neck', 'Artillery tough', '2025-02-17', 2, 3, 'Zekvir influence'),
    (11, 5, 1, 8, 6, 80, 'Healer', 602.3, 120, 480, 1, '629 ring', 'Smooth heals', '2025-02-24', 2, 2, NULL),
    (13, 5, 4, 7, 11, 80, 'Healer', 602.3, 250, 900, 0, NULL, 'Zekvir wiped us', '2025-03-01', 2, 4, 'Max difficulty'),
    (2, 5, 5, 11, 7, 80, 'Healer', 602.3, 130, 540, 1, '636 helm', 'Miners healed', '2025-03-03', 2, 1, NULL),
    (14, 5, 6, 9, 5, 80, 'Healer', 602.3, 110, 420, 1, '623 shoulders', 'Sewer support', '2025-03-04', 2, 2, NULL);