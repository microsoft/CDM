# CDM Folders sample

A "CDM folder" is a folder in the Azure Data Lake Storage Gen2, conforming to specific, well-defined and standardized metadata structures and self-describing data, to facilitates effortless metadata discovery and interop between data producers (e.g. Dynamics 365 business application suite) and data consumers, such as Power BI analytics, Azure data platform services (e.g. Azure Machine Learning, Azure Data Factory, Azure Databricks, etc.) and turn-key SaaS applications (Dynamics 365 AI for Sales, etc.) The standardized metadata is defined in the model.json file, which exists in the folder and containers pointers to the actual data file locations.

The subfolders in this directory provide a set of sample libraries and schema files to read and write the model.json file. 

## More information
- [CDM folders](https://docs.microsoft.com/en-us/common-data-model/data-lake)
- [model.json](https://docs.microsoft.com/en-us/common-data-model/model-json)
