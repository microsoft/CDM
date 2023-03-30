Param(
    [switch]$typescript,
    [switch]$python,
    [switch]$java
)
Remove-Item ./schemaDocuments -Force -Recurse -ErrorAction SilentlyContinue
mkdir ./schemaDocuments

Copy-Item ../schemaDocuments/*.cdm.json ./schemaDocuments
Copy-Item ../schemaDocuments/extensions ./schemaDocuments -Recurse
Copy-Item ../schemaDocuments/cdmfoundation ./schemaDocuments -Recurse

Get-ChildItem ./schemaDocuments | Where{$_.Name -Match ".*\.0\.[0-9]\.[0-9]?.*|.*\.manifest\..*"} | Remove-Item -Force -Recurse

# run all languages if no parameters were passed in
$all = (-Not $typescript) -And (-Not $python) -And (-Not $java)

# typescript
If ($all -Or $typescript) {
    Remove-Item ../objectmodel/Typescript/CdmStandards/schemaDocuments -Force -Recurse -ErrorAction SilentlyContinue
    Copy-Item ./schemaDocuments/ ../objectmodel/Typescript/CdmStandards/schemaDocuments -Recurse
}

# python
If ($all -Or $python) {
    Remove-Item ../objectmodel/Python/commondatamodel_objectmodel_cdmstandards/schema_documents -Force -Recurse -ErrorAction SilentlyContinue
    Copy-Item ./schemaDocuments/ ../objectmodel/Python/commondatamodel_objectmodel_cdmstandards/schema_documents -Recurse
}

# java
If ($all -Or $java) {
    Get-ChildItem ../objectmodel/Java/cdmstandards/schemaDocuments -exclude pom.xml | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
    Copy-Item ./schemaDocuments/ ../objectmodel/Java/cdmstandards/schemaDocuments -Recurse
}

Remove-Item ./schemaDocuments -Force -Recurse -ErrorAction SilentlyContinue