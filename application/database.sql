CREATE TABLE Delves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    zone TEXT,
    min_item_level INTEGER,
    unlock_condition TEXT,
    notes TEXT
);

CREATE TABLE Tiers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    delve_id INTEGER,
    tier_level INTEGER NOT NULL,
    gear_level INTEGER,
    difficulty_notes TEXT,
    FOREIGN KEY (delve_id) REFERENCES Delves(id)
);

CREATE TABLE Curios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    curio_type TEXT NOT NULL CHECK (curio_type IN ('Combat', 'Utility')),
    owned INTEGER DEFAULT 0 CHECK (owned IN (0, 1)),
    rank INTEGER DEFAULT 0 CHECK (rank BETWEEN 0 AND 4),
    curios_image TEXT NOT NULL,
    description TEXT
);

CREATE TABLE Characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class TEXT NOT NULL,
    name TEXT NOT NULL UNIQUE,
    spec TEXT NOT NULL,
    hero_spec TEXT,
    critical_strike REAL CHECK (critical_strike >= 0),
    versatility REAL CHECK (versatility >= 0),
    mastery REAL CHECK (mastery >= 0),
    armor INTEGER CHECK (armor >= 0),
    haste REAL CHECK (haste >= 0),
    stamina INTEGER CHECK (stamina >= 0),
    agility INTEGER CHECK (agility >= 0),
    blocking REAL CHECK (blocking >= 0 AND blocking <= 100),
    overall_item_level REAL CHECK (overall_item_level >= 0),
    level INTEGER CHECK (level >= 1 AND level <= 80),
    dodge REAL CHECK (dodge >= 0 AND dodge <= 100),
    strength INTEGER CHECK (strength >= 0),
    intellect INTEGER CHECK (intellect >= 0),
    parry REAL CHECK (parry >= 0 AND parry <= 100),
    main_stat TEXT CHECK (main_stat IN ('Strength', 'Agility', 'Intellect', NULL)),
    notes TEXT
);

CREATE TABLE IF NOT EXISTS DelveRun (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    delves_id INTEGER NOT NULL,
    characters_id INTEGER NOT NULL,
    combat_curio_id INTEGER,
    utility_curio_id INTEGER,
    tier INTEGER CHECK (tier BETWEEN 1 AND 11),
    brannLevel INTEGER CHECK (brannLevel BETWEEN 1 AND 80),
    brannSpec TEXT CHECK (brannSpec IN ('DPS', 'Healer', 'Tank')),
    myItemLevel REAL CHECK (myItemLevel >= 0),
    bossKillTime INTEGER, -- Seconds
    totalTime INTEGER,    -- Seconds
    completed INTEGER DEFAULT 0 CHECK (completed IN (0, 1)),
    rewards TEXT,
    notes TEXT,
    dateRun DATE,
    season INTEGER CHECK (season >= 1),
    partySize INTEGER CHECK (partySize BETWEEN 1 AND 5),
    difficultyModifiers TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (delves_id) REFERENCES Delves(id),
    FOREIGN KEY (characters_id) REFERENCES Characters(id),
    FOREIGN KEY (combat_curio_id) REFERENCES Curios(id),
    FOREIGN KEY (utility_curio_id) REFERENCES Curios(id)
);

CREATE TABLE IF NOT EXISTS AIContext (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic TEXT NOT NULL,
    context TEXT NOT NULL CHECK (json_valid(context)), -- JSON format, validated
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);