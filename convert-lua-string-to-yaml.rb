#!/usr/bin/env ruby

require 'yaml'
require 'optparse'

# Parse command-line arguments
options = {}
OptionParser.new do |opts|
  opts.banner = "Usage: ruby lua_to_yaml.rb -f INPUT_FILE -o OUTPUT_FILE"
  opts.on("-f FILE", "Path to the Lua data file (e.g., export.lua)") { |f| options[:input_file] = f }
  opts.on("-o FILE", "Path to the output YAML file (e.g., mychar.yaml)") { |o| options[:output_file] = o }
end.parse!

unless options[:input_file] && options[:output_file]
  puts "Error: Both -f and -o are required."
  exit 1
end

# Read the Lua file
begin
  lua_content = File.read(options[:input_file])
rescue Errno::ENOENT
  puts "Error: Input file '#{options[:input_file]}' not found."
  exit 1
rescue => e
  puts "Error reading input file: #{e}"
  exit 1
end

# Parse Lua table into Ruby hash
def parse_lua_table(text)
  text = text.sub(/exportData\s*=\s*/, '').strip
  
  def convert_value(val)
    val = val.strip
    return val.to_i if val =~ /^\d+$/
    return val if val == "N/A"
    val.gsub(/^"/, '').gsub(/"$/, '')
  end
  
  result = {}
  # Match top-level key-value pairs
  text.scan(/(\["[^"]+"\]|\d+)\s*=\s*({[^}]*}|[^,]+)(?:,|$|\s*\n*})/).each do |key, value|
    key = key.start_with?('[') ? key[2..-3] : key.to_i
    value = value.strip
    
    if value.start_with?('{')
      # Nested table
      sub_dict = {}
      value[1..-2].strip.scan(/([^=,\s]+)\s*=\s*("[^"]*"|[^,]+)(?:,|$)/).each do |inner_key, inner_value|
        sub_dict[inner_key] = convert_value(inner_value)
      end
      result[key] = sub_dict
    else
      result[key] = convert_value(value)
    end
  end
  
  result
end

# Convert to YAML structure
def convert_to_yaml(lua_data)
  {
    "character" => {
      "gear" => lua_data["gear"].transform_keys { |k| "slot#{k}" },
      "currencies" => lua_data["currencies"]
    }
  }
end

# Parse and convert
begin
  lua_data = parse_lua_table(lua_content)
  unless lua_data["gear"] && lua_data["currencies"]
    raise "Missing 'gear' or 'currencies' key in parsed Lua data"
  end
  yaml_data = convert_to_yaml(lua_data)
rescue => e
  puts "Error processing Lua data: #{e}"
  exit 1
end

# Write to YAML file
begin
  File.write(options[:output_file], yaml_data.to_yaml)
  puts "YAML file '#{options[:output_file]}' created successfully!"
rescue => e
  puts "Error writing YAML file: #{e}"
  exit 1
end