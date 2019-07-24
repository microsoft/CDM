# Use the following command to run all the performance tests
# .\ProfilingCli.ps1 "E:\Repos\CDM.ObjectModel"
# where "E:\Repos\CDM.ObjectModel" is the path to your object model

# Input params for test driver cli.
Param (
    [String]$objectModelPath,    # Path to CDM.ObjectModel.TS.
    [String]$testCorpusPath = "..\perfTestCorpus\",    # Path to test corpus.
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

    cd "$toolsPath\..\entity-api\"
    Write-Host "Remove cdm.objectmodel from entity-api"
    npm uninstall cdm.objectmodel
    Write-Host "Installing entity-api npm"
    npm install
    Write-Host "Link object model to entity-api"
    npm link cdm.objectmodel
    Write-Host "Compile entity-api"
    tsc

    cd $toolsPath
    Write-Host "Remove cdm.objectmodel"
    npm uninstall cdm.objectmodel
    Write-Host "Installing perf tests npm"
    npm install
    Write-Host "Link object model to perf tests"
    npm link cdm.objectmodel
    Write-Host "Compile TS perf tests"
    tsc

}

# Cleanup environment before exit
function Cleanup-Environment {
    [CmdletBinding()]
    param()

    # Unlink npm and install OM back to the Tools repo
    npm unlink cdm.objectmodel
    npm install cdm.objectmodel
    cd $objectModelPath
    npm unlink
    cd $toolsPath
}

# Run the tests
function Run-Tests() {
    [CmdletBinding()]
    param([bool]$isTest)
    Write-Host "Run performance tests: node .\dist\main.js $testCorpusPath"
    $captureOutput = node .\dist\main.js $testCorpusPath
    Write-Host $captureOutput -Separator `n
    foreach($result in $captureOutput.Split("`n")){
        if($result -match 'false$'){
            return "False"
        }
    }
    #echo $captureOutput;
    return "True"
}


npm install -g typescript

if([string]::IsNullOrWhitespace($objectModelPath)){
    Write-Host "Object model path cannot be left empty"
    exit 1
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
$result = Run-Tests

if(!$isPipeline){
    Cleanup-Environment
}

if($result -match "True"){
    Write-Host "Tests passed."
    exit 0
}
else{
    Write-Error "One or more tests did not pass."
    exit 1
}