Remove-Item ./Resources -Force -Recurse -ErrorAction SilentlyContinue
mkdir ./Resources
Copy-Item ../CDM.SchemaDocuments/extensions ./Resources -Recurse
Copy-Item ../CDM.SchemaDocuments/ODI-analogs ./Resources -Recurse
Copy-Item ../CDM.SchemaDocuments/*.json ./Resources -Recurse

Remove-Item ./Resources/ODI-analogs/office -Force -Recurse

Get-ChildItem ./Resources | Where{$_.Name -Match ".*.0.[6-8].[0-9]?.*"} | Remove-Item -Force -Recurse