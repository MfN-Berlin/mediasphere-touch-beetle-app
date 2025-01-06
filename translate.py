from googletrans import Translator
import json
import asyncio

# Initialize the translator
translator = Translator()

# Load json file as dict
with open("./app/public/data.json", "r", encoding="utf-8") as file:
    data = json.load(file)


async def traverse_json(data, path=""):
    
     # translate
    if isinstance(data, dict) and "de" in data and "en" in data:
        translated = await translator.translate(data["de"], src="de", dest="en")
        data["en"] = translated.text
    
    if isinstance(data, dict):  # If the data is a dictionary
        for key, value in data.items():
            new_path = f"{path}.{key}" if path else key
            await traverse_json(value, new_path)
    elif isinstance(data, list):  # If the data is a list
        for index, item in enumerate(data):
            new_path = f"{path}[{index}]"
            await traverse_json(item, new_path)
    
    return data
        


async def main():
    
    # Translate recurse
    trans = await traverse_json(data)
    print(trans)
    
    # Write the updated JSON
    with open('./app/public/data.autotranslated.json', "w", encoding="utf-8") as file:
        json.dump(trans, file, ensure_ascii=False, indent=4)
    
# Run
asyncio.run( main() )