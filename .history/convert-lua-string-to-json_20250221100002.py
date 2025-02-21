import yaml

# Simulated Lua data (paste your actual output here without 'exportData = ')
lua_data = {
  "gear": {
    1: {"name": "Helm of Valor", "itemLevel": "476", "upgrade": "3/8"},
    3: {"name": "Shoulders of Might", "itemLevel": "480", "upgrade": "4/8"}
  },
  "currencies": {
    "Gold": {"quantity": 15000, "maxQuantity": 10000000},
    "Honor": {"quantity": 500, "maxQuantity": 15000}
  },
  "talents": {
    "specialization": "Frost",
    "talents": [
      {"tier": 1, "name": "Icy Talons"},
      {"tier": 2, "name": "Frost Strike"}
    ]
  }
}

# Convert numeric keys to "slotX" format
yaml_data = {
  "character": {
    "gear": {f"slot{k}": v for k, v in lua_data["gear"].items()},
    "currencies": lua_data["currencies"],
    "talents": {
      "specialization": lua_data["talents"]["specialization"],
      "choices": lua_data["talents"]["talents"]
    }
  }
}

# Write to YAML
with open("character.yaml", "w") as f:
    yaml.dump(yaml_data, f, default_flow_style=False)

print("YAML file 'character.yaml' created!")