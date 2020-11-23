import string
import json
#import geojson
import csv
import pandas as pd
#data = pd.read_json('File.geojson')
#https://stackoverflow.com/questions/42753745/how-can-i-parse-geojson-with-python


countryForFirst = []

countryForSecond = []

# JSON Files
with open("../data/world.geojson") as f:
    fileReadIn1 = json.load(f)
    fileReadInFea = fileReadIn1["features"];
    for i in range(0, len(fileReadInFea)):
        #print(fileReadInFea[i]["properties"]["name"])
        countryForFirst.append(fileReadInFea[i]["properties"]["name"])
    #print(fileReadIn1["features"])

# https://docs.python.org/3/library/csv.html
with open('../data/gdp-csv-copy.csv', newline='', encoding = "ISO-8859-1") as csvfile:
    fileReadIn2 = csv.reader(csvfile, delimiter=',')
    #print(fileReadIn2)
    for row in fileReadIn2:
        countryForSecond.append(row[0])
        #print(row[0])

print(list(set(countryForFirst) ^ set(countryForSecond)))

"""
for i in range(0, len(fileReadIn1["features"])):
    print(fileReadIn1.features["properties"])
"""
