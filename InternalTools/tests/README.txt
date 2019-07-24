resolvedEntitiesComparison.ts is a file which runs a check to compare two different resolved entities file and generates two HTML files.
 allResolvedEntitiesList folder contains a list of different resolved entities files as examples. 
All new resolved entities have a changed schema (added a new relationship).
Additionally allResolvedEntitiesNew2 has a change in the OM (ENTITY renamed to COOLENTITIY), and allResolvedEntitiesNew3 has a breaking change (renamed all traits).

How to use Resolved Entity Comparision:
    1. cd to tests folder and run tsc
    2. node .\resolvedEntitiesComparison.js <path to file1> <path to file2>

How to use Test Driver:
    1. To use testCorpus: node .\testDriver.js ..\testCorpus\ MiniDyn /MiniDyn/Account.cdm.json/Account
    2. TO use SchemaDocuments: 
        a. Clone CDM.SchemaDocuments
        b. node .\testDriver.js <path to schema documents> core /core/applicationCommon/foundationCommon/crmCommon/Account.cdm.json/Account
    