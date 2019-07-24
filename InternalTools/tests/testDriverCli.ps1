# If no resolved files generated, run [.\testDriverCli.ps1 -generate $true] first.
# To test all tests environments, run [.\testDriverCli.ps1 -objectModelPath "..\..\..\CDM.ObjectModel.TS\"].
# To test a specific environment, run [.\testDriverCli.ps1 -objectModelPath "..\..\..\CDM.ObjectModel.TS\" -environment "MiniDyn"].
# For pipeline, run [.\testDriverCli.ps1 -objectModelPath "..\..\" -environment "MiniDyn"].

# Use following script to generate allResolved.txt or compare files:
# node .\testDriver.js ..\testCorpus MiniDyn
# node .\resolvedEntityComparison.js $origAllResolved $newPath

# Input params for test driver cli.
Param (
    [String]$objectModelPath,    # Path to CDM.ObjectModel.TS.
    [String]$testCorpusPath = "..\testCorpus\",    # Path to test corpus.
    [String]$environment,   # Set $environment if you want to test only a specific environment. e.g. MiniDyn
    [String]$entity, # Set $entity if you want to test only a specific entity, not supported by this script yet.
    [Bool]$generate, # Set $generate to true to generate resolved files for all environments in test corpus.
    [Bool]$isPipeline # Set isPipeline to true if it is used in Azure pipeline, so that it will not clean up environment.
)

# Setup local cdm.objectmodel module.
function Setup-Environment {
    [CmdletBinding()]
    param()

    cd $objectModelPath
    Write-Host "Installing object model npm"
    npm install
    Write-Host "Compiling object model TS"
    tsc
    Write-Host "Compiling object model link package"
    npm link

    cd $toolsPath
    Write-Host "Disable tests .npmrc"
    Rename-Item -path ".\.npmrc" -newName ".\temp.npmrc"
    Write-Host "Remove cdm.objectmodel"
    npm uninstall cdm.objectmodel
    Write-Host "Installing tests npm"
    npm install
    Write-Host "Link object model to tests"
    npm link cdm.objectmodel
    Write-Host "Compile TS tests"
    tsc
}

# Cleanup environment before exit
function Cleanup-Environment {
    [CmdletBinding()]
    param()

    # Unlink npm and install OM back to the Tools repo
    Rename-Item -path ".\temp.npmrc" -newName ".\.npmrc"
    npm unlink cdm.objectmodel
    npm install cdm.objectmodel
    cd $objectModelPath
    npm unlink
    cd $toolsPath
}

# Generate allResolved.txt for all environments
# If isTest=true, then compare with the original allResolved files with new ones,
# return true if any of them are different.
function Generate-AllResolved() {
    [CmdletBinding()]
    param([bool]$isTest)

    # Generate resolved entities file
    $result = $false
    foreach($folderItem in Get-ChildItem -Directory $testCorpusPath) {
        $envPath = $folderItem.Name
        Write-Host "Run test driver: node .\testDriver.js $testCorpusPath $envPath"
        $captureOutput = node .\testDriver.js $testCorpusPath $envPath

        # If isTest=false, generate allResolved files with official cdm.objectmodel.
        # If isTest=true, generate allResolved files with local cdm.objectmodel.
        if($isTest){
            $newPath = Join-Path $newResolvedFolderPath $envPath
        } else {
            $newPath = Join-Path $origResolvedFolderPath $envPath
        }

        $captureOutput = New-Item -Force $newPath
        Copy-Item ".\allResolved.txt" $newPath -Force
        Remove-Item ".\allResolved.txt"

        if($isTest) {
            # If isTest=true, compare with the original ones.
            $origAllResolved = Join-Path $origResolvedFolderPath $envPath
            Write-Host "Run comparison: node .\resolvedEntityComparison.js $origAllResolved $newPath"
            $tempResult = (node .\resolvedEntityComparison.js $origAllResolved $newPath)
            if($tempResult -contains "true") {
                Write-Error "The resolved entities file for $envPath is different, please fix it."
                $result = $True
            }
        }
    }
    return $result
}

$origResolvedFolderPath = ".\allResolvedEntitiesList"
$newResolvedFolderPath = ".\newAllResolvedEntitiesList"

npm install -g typescript

# Generate new allResolved.txt files if $generate==$true.
if($generate) {
    Write-Host "Generate resolved entities file for all environments in testCorpus: [$testCorpusPath] and output to [$origResolvedFolderPath]"
    npm install
    tsc
    Generate-AllResolved($false)
    exit 0
} 

# Resolve all path params as global path.
$objectModelPath = Resolve-Path -Path $objectModelPath
$testCorpusPath = Resolve-Path -Path $testCorpusPath
$toolsPath = (Get-Location).path

# Prepare for npm link environment.
Write-Output "ObjectModel path is set to: [$objectModelPath]"
Write-Output "TestCorpus path is set to: [$testCorpusPath]"
Write-Output "Tools path is current folder: [$toolsPath]"

Setup-Environment

# Generate the new version of resolved files and compare with the old version.
if($entity -And $environment) {
    # Tests an entity, not supported by testDriver.ts yet
    Write-Error "Single entity test is not supported yet"
    exit 1
} elseif ($environment) {
    # Tests single environment
    Write-Host "Run test driver: node .\testDriver.js $testCorpusPath $environment"
    node .\testDriver.js $testCorpusPath $environment
    $origAllResolved = Join-Path $origResolvedFolderPath $environment
    Write-Host "Run comparison: node .\resolvedEntityComparison.js $origAllResolved allResolved.txt"
    $result = node .\resolvedEntityComparison.js $origAllResolved allResolved.txt
} else {
    # Tests all environments
    $result = Generate-AllResolved($true)
}

if(!$isPipeline){
    Cleanup-Environment
}

if($result -match "False"){
    Write-Host "Tests passed."
    exit 0
}
else{
    Write-Error "The resolved entity files are different, please fix them."
    exit 1
}