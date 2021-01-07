import pandas as pd
import numpy as np

def joinFiles(basefile, secondary, merge, year):
    baseFileData = pd.read_csv(basefile)
    secondaryData = pd.read_csv(secondary)
    # is_year =  secondaryData['Year']==year
    # isYearSecondary = secondaryData[is_year]
    inner_join_df = baseFileData.merge(secondaryData, how="outer", on=merge)
    print(inner_join_df)
    inner_join_df.to_csv("new_data.csv")

def dropRowsorCols(file, thingsToDrop):
    d = pd.read_csv(file, delimiter=",", encoding='utf-8')
    print(d)
    # print(thingsToDrop)
    # d.drop(labels=thingsToDrop, axis=1, inplace=True)
    # d.to_csv(file + "cleaned", header=True)

def cleanFile(file, metricToDropEmpty):
    d = pd.read_csv(file)
    d[metricToDropEmpty].replace('', np.nan)
    print(d)
    d.dropna(subset=[metricToDropEmpty], inplace=True)
    d.to_csv('new_data_cleaned.csv', header=True)


joinFiles("new_data.csv", "economic-addendum-3.csv", "Country", 2015)
cleanFile("new_data.csv", "Happiness_Score")
year_labels = []
for i in range(1960, 2014):
    year_labels.append(str(i))
print(year_labels)


