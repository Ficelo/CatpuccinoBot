import json


options_file = "/app/options.json"

def get_options():
    
    data = None
    with open(options_file, "r") as file:
        data = json.load(file)
    file.close()

    return data

def set_options(data):
    
    with open(options_file, "w") as file:
        json.dump(data, file)
    file.close()


