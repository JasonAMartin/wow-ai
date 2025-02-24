import argparse
import re
import yaml

def parse_lua_table(lua_string):
    """Parse a Lua table string into a Python dictionary."""
    # Remove 'exportData =' and any trailing whitespace
    lua_string = re.sub(r'exportData\s*=\s*', '', lua_string).strip()
    
    def convert_value(val):
        """Convert Lua value to Python equivalent."""
        val = val.strip()
        if val.isdigit():
            return int(val)
        if val == "N/A":
            return val
        return val.strip('"')
    
    def parse_table(text, depth=0):
        """Recursively parse Lua table into Python dict."""
        result = {}
        text = text.strip('{} \n')
        if not text:
            return result
        
        # Match key-value pairs
        pattern = r'(\[?"[^"]+"\]|\d+)\s*=\s*({[^}]*}|[^,]+)(?:,|$|\s*(?=\n*\}))'
        matches = re.finditer(pattern, text, re.DOTALL)
        
        for match in matches:
            key, value = match.groups()
            # Clean up key
            if key.startswith('[') and key.endswith(']'):
                key = key[2:-2]  # Remove [""] and quotes
            else:
                key = int(key) if key.isdigit() else key
            
            # Parse value
            value = value.strip()
            if value.startswith('{'):
                # Nested table: parse key-value pairs inside
                inner_text = value.strip('{} \n')
                sub_dict = {}
                # Split on commas outside of nested tables
                inner_parts = re.split(r',\s*(?![^{]*})', inner_text)
                for part in inner_parts:
                    if '=' in part:
                        inner_key, inner_value = part.split('=', 1)
                        inner_key = inner_key.strip()
                        inner_value = inner_value.strip()
                        sub_dict[inner_key] = convert_value(inner_value)
                result[key] = sub_dict
            else:
                result[key] = convert_value(value)
        
        return result
    
    return parse_table(lua_string)

def convert_to_yaml(lua_data):
    """Convert parsed Lua data to YAML structure."""
    yaml_data = {
        "character": {
            "gear": {f"slot{k}": v for k, v in lua_data["gear"].items()},
            "currencies": lua_data["currencies"]
        }
    }
    return yaml_data

def main():
    parser = argparse.ArgumentParser(description="Convert Lua exportData table to YAML")
    parser.add_argument("-f", required=True, help="Path to the Lua data file (e.g., export.lua)")
    parser.add_argument("-o", required=True, help="Path to the output YAML file (e.g., mychar.yaml)")
    args = parser.parse_args()

    # Read the Lua file
    try:
        with open(args.f, "r") as f:
            lua_content = f.read()
    except FileNotFoundError:
        print(f"Error: Input file '{args.f}' not found.")
        return
    except Exception as e:
        print(f"Error reading input file: {e}")
        return

    # Parse Lua to Python dictionary
    try:
        lua_data = parse_lua_table(lua_content)
        if "gear" not in lua_data or "currencies" not in lua_data:
            raise ValueError("Missing 'gear' or 'currencies' key in parsed Lua data")
    except Exception as e:
        print(f"Error parsing Lua data: {e}")
        return

    # Convert to YAML structure
    try:
        yaml_data = convert_to_yaml(lua_data)
    except Exception as e:
        print(f"Error converting to YAML: {e}")
        return

    # Write to YAML file
    try:
        with open(args.o, "w") as f:
            yaml.dump(yaml_data, f, default_flow_style=False, allow_unicode=True)
        print(f"YAML file '{args.o}' created successfully!")
    except Exception as e:
        print(f"Error writing YAML file: {e}")

if __name__ == "__main__":
    main()