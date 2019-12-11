Remove-Item ./Resources -Force -Recurse -ErrorAction SilentlyContinue
mkdir ./Resources
Copy-Item ../../schemaDocuments/extensions ./Resources -Recurse
Copy-Item ../../schemaDocuments/*.json ./Resources -Recurse

Get-ChildItem ./Resources | Where{$_.Name -Match ".*.0.[6-8].[0-9]?.*"} | Remove-Item -Force -Recurse