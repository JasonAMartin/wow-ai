import argparse
import yaml
import re

# Function to parse a simplified Lua table from a string
def parse_lua_table(lua_string):
    # Remove 'exportData =' and clean up
    lua_string = lua_string.replace("exportData =", "").strip()

    # Basic Lua-to-Python dictionary conversion
    def convert_lua_to_dict(text):
        text = text.strip("{} \n")
        result = {}
        stack = []
        current_dict = result
        key = None

        # Split into tokens, handling nested tables
        tokens = re.split(r'([\[=,\]\{\}])', text)
        tokens = [t.strip() for t in tokens if t.strip()]

        for token in tokens:
            if token == '{':
                new_dict = {}
                if key is not None:
                    current_dict[key] = new_dict
                stack.append(current_dict)
                current_dict = new_dict
                key = None
            elif token == '}':
                if stack:
                    current_dict = stack.pop()
            elif token == '[':
                continue
            elif token == ']':
                continue
            elif token == '=':
                continue
            elif token == ',':
                key = None
            else:
                if key is None:
                    key = token.strip('[""]')
                    # Convert numeric keys to integers if applicable
                    if key.isdigit():
                        key = int(key)
                else:
                    value = token.strip('[""]')
                    # Convert numeric values to int if applicable
                    if value.isdigit():
                        value = int(value)
                    current_dict[key] = value
                    key = None

        return result

    # Handle nested arrays (talents.talents) as lists
    raw_dict = convert_lua_to_dict(lua_string)

    # Post-process to fix talent talents array
    if "talents" in raw_dict and "talents" in raw_dict["talents"]:
        raw_dict["talents"]["talents"] = [
            raw_dict["talents"]["talents"][i] for i in sorted(raw_dict["talents"]["talents"].keys())
        ]

    return raw_dict

# Main conversion function
def convert_to_yaml(lua_data):
    # Convert numeric gear keys to "slotX" format and structure talents
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
    return yaml_data

# Argument parsing and file handling
def main():
    parser = argparse.ArgumentParser(description="Convert Lua table to YAML")
    parser.add_argument("-f", "--file", required=True, help="Path to the Lua data file")
    args = parser.parse_args()

    # Read the Lua file
    try:
        with open(args.file, "r") as f:
            lua_content = f.read()
    except FileNotFoundError:
        print(f"Error: File '{args.file}' not found.")
        return
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    # Parse Lua to Python dictionary
    try:
        lua_data = parse_lua_table(lua_content)
    except Exception as e:
        print(f"Error parsing Lua data: {e}")
        return

    # Convert to YAML structure
    yaml_data = convert_to_yaml(lua_data)

    # Write to YAML file
    output_file = args.file.replace(".lua", ".yaml")
    try:
        with open(output_file, "w") as f:
            yaml.dump(yaml_data, f, default_flow_style=False)
        print(f"YAML file '{output_file}' created successfully!")
    except Exception as e:
        print(f"Error writing YAML file: {e}")

if __name__ == "__main__":
    main()