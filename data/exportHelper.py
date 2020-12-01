import pandas as pd

def joinFiles(basefile, secondary, merge, year):
    baseFileData = pd.read_csv(basefile)
    secondaryData = pd.read_csv(secondary)
    is_year =  secondaryData['Year']==year
    isYearSecondary = secondaryData[is_year]
    print(isYearSecondary)

    inner_join_df = baseFileData.merge(isYearSecondary, how="outer", on=merge)
    inner_join_df.to_csv("new_data.csv")

joinFiles("new_data.csv", "Life Expectancy Data.csv", "Country", 2015)