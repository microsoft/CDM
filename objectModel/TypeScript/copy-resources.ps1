Remove-Item ./Resources -Force -Recurse -ErrorAction SilentlyContinue
mkdir ./Resources
Copy-Item ../../schemaDocuments/extensions ./Resources -Recurse
Copy-Item ../../schemaDocuments/*.json ./Resources -Recurse
Copy-Item ../../schemaDocuments/cdmfoundation ./Resources -Recurse

Get-ChildItem ./Resources | Where{$_.Name -Match ".*.0.[0-9].[0-9]?.*|.*.manifest..*"} | Remove-Item -Force -Recurse