# Analyzes folders and will generate the table of contents.
function AnalyzeFolder($rootFolder, $depth, $prefix) {
		
		foreach ($item in Get-ChildItem $rootFolder) {			
			$offset = ''
			for($i = 0; $i -lt $depth; $i++) {
				$offset += '  '
			}
			
			if ($prefix -eq '') {
				$realprefix = $prefix
			} else {
				$realprefix = $prefix + '/';
			}
						
			$fullname = $item.fullname
			if (Test-Path -Path $fullname -PathType Container) {
				Add-Content -Value ($offset + '- name: ' +  $item.name.Split('-')[0]) -Path ($applicationCommonFolder.fullname + '\' + 'toc.yml')
				Add-Content -Value ($offset + '  items: ' ) -Path ($applicationCommonFolder.fullname + '\' + 'toc.yml')
				Add-Content -Value ($offset + '  - name: Summary') -Path ($applicationCommonFolder.fullname + '\' + 'toc.yml')
				Add-Content -Value ($offset + '    href: ' +  $realprefix + $item.name + '/overview.md') -Path ($applicationCommonFolder.fullname + '\' + 'toc.yml')
				AnalyzeFolder ($rootFolder + '\' + $item.name) ($depth + 1) ($realprefix + $item.name)
			} else {
				if ($item.name -ne 'overview.md' -and $item.name -ne 'toc.yml') {
					$displayname = ((Get-Content $item.fullname)[1]).tostring().substring(7)
					Add-Content -Value ($offset + '- name: ' +  $displayname.Split('-')[0]) -Path ($applicationCommonFolder.fullname + '\' + 'toc.yml')
					Add-Content -Value ($offset + '  href: ' +  $realprefix + $item.name) -Path ($applicationCommonFolder.fullname + '\' + 'toc.yml')
				}
			}
		}
}

# Creates README.md files from overview.md files for every CDM.SchemaDocuments directory.
function CreateReadMe($toFolder, $fromFolder) {
	foreach ($item in Get-ChildItem $toFolder) {	
		if ($item.name -eq 'README.md') {
			Remove-Item $item.fullname
		}
		
		if (Test-Path -Path $item.fullname -PathType Container) {
			CreateReadMe($toFolder + '\' + $item.name) ($fromFolder + '\' + $item.name)
		}
	}
	
	foreach ($item in Get-ChildItem $fromFolder) {	
		if ($item.name -eq 'readme.md') {
			$readmeFile = $item
		}
	}

	Copy-Item $readmeFile.fullname ($toFolder + '/README.md')
	
	# We need to remove the original readme file.
	Remove-Item $readmeFile.fullname
}


# Setup env variables
$docsgitlink = $env:docsgitlink
$docsgitremotebranch = $args[0]
$docsgitlocalbranch = $args[1]
$pac = $env:pac

echo $docsgitbranch

# Add personal access certificate to the github link.
$docsgitlink = $docsgitlink.replace("//", "//"+$pac+"@");

echo $docsgitlink

# Set-up entity API.
cd ..\entity-api
npm install
tsc

cd ..\doc-generator
npm install
npm run build

# Generate temporary md files.
$scriptValue = (node .\dist\main.js ..\..\CDM.SchemaDocuments\)

if (-Not ($scriptValue -contains "The return value is 0")) {
	echo "There has been an error while generating docs."
	exit 1
}
		
# Clone the target repo.
git clone $docsgitlink githubDocs
	
cd githubDocs
				
git checkout $docsgitremotebranch

git checkout -b $docsgitlocalbranch
		
cd ..
	
# Get the origin.
$y = Get-ChildItem
for ($j = 0; $j -lt $y.length; $j++) {
	if ($y[$j].Name -eq "docs") {
		$docsfolder = $y[$j]
	}
}

cd ../..

# Get the schemaDocuments folder.
$y = Get-ChildItem
for ($j = 0; $j -lt $y.length; $j++) {
	if ($y[$j].Name -eq "CDM.SchemaDocuments") {
	$cdmSchemaDocuments = $y[$j]
	}
}

cd CDM.Tools.Internal\doc-generator

CreateReadMe $cdmSchemaDocuments.fullname $docsfolder.fullname

# Copy the README.md from applicationCommon to top level folders.
Remove-Item ($cdmSchemaDocuments.fullname + '/README.md')
Remove-Item ($cdmSchemaDocuments.fullname + '/core/README.md')
Copy-Item ($cdmSchemaDocuments.fullname + '/core/applicationCommon/README.md') ($cdmSchemaDocuments.fullname + '/README.md')
Copy-Item ($cdmSchemaDocuments.fullname + '/core/applicationCommon/README.md') ($cdmSchemaDocuments.fullname + '/core/README.md')
	
cd githubDocs/common-data-model
		
# Get the target.
$y = Get-ChildItem
for ($j = 0; $j -lt $y.length; $j++) {
	if ($y[$j].Name -eq "schema") {
	$githubfolder = $y[$j]
	}
}

# Delete the old content.		
Remove-Item $githubfolder\* -Recurse -Force
		
# Copy the new content.
Copy-Item -Path ($docsfolder.fullname+ '\*') -Recurse -Destination $githubfolder.fullname -Container

cd $githubfolder/core

# Get the applicationCommon folder.
$y = Get-ChildItem
for ($j = 0; $j -lt $y.length; $j++) {
	if ($y[$j].Name -eq "applicationCommon") {
	$applicationCommonFolder = $y[$j]
	}
}

# Write first two lines to have entity reference summary.
Add-Content -Value '- name: Summary' -Path ($applicationCommonFolder.fullname + '\' + 'toc.yml')
Add-Content -Value '  href: overview.md' -Path ($applicationCommonFolder.fullname + '\' + 'toc.yml')

AnalyzeFolder $applicationCommonFolder.fullname 0 ''

cd ../..

git add --all

git commit -m "Update from the script - test for pipeline"

git push origin $docsgitlocalbranch

cd ../../
