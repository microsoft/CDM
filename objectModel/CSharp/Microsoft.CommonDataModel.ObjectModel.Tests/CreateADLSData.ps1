# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

#
# Check that the needed env vars are set
#
if(-not ($env:ADLS_HOSTNAME -and $env:ADLS_SHAREDKEY -and $env:ADLS_ROOTPATH))
{
    Write-Error "The following environment variables much be set for this script to work: ADLS_HOSTNAME, ADLS_SHAREDKEY, ADLS_ROOTPATH"
    exit -1;
}


#
# Get azure storage context for our ADLS account 
#
$accountName = ($env:ADLS_HOSTNAME).split(".")[0];
if(!$accountName)
{
    Write-Error "Could not determine ADLS storage account name from ADLS_HOSTNAME environment variable"
    exit
}
$context = New-AzStorageContext -StorageAccountName $accountName -StorageAccountKey $env:ADLS_SHAREDKEY
Write-Host "Creating storage context for " -NoNewLine 
Write-Host -ForegroundColor Green $accountName


#
# Get filesystem and root dir for writing the data to  
#
$rootPath = $env:ADLS_ROOTPATH;
if ($rootPath[0] -eq '/')  { $rootPath = $rootPath.SubString(1); }
$index = $rootPath.IndexOf("/")
$filesystem = $rootPath
$path = "."
if($index -gt 0 ) { 
    $filesystem = $rootPath.SubString(0, $index)
    if ($index -lt $rootPath.Length - 1) {
        $path = $rootPath.SubString($index+1);
    }
}
Write-Host "Updating data for container " -NoNewLine; 
Write-Host -ForegroundColor Green $filesystem -NoNewLine
Write-Host " at path " -NoNewLine
Write-Host -ForegroundColor Green $path


#
# Ensure root dir exists and is empty, unless path is empty then just add to the root
#
if($path -ne ".")
{
    $rootDir = Get-AzDataLakeGen2Item -Context $context -FileSystem $filesystem -Path $path
    if($rootDir) {
        Write-Host -ForegroundColor Yellow "WARNING: This will delete all files under " -NoNewLine 
        Write-Host -ForegroundColor Green $rootDir.Directory.Uri.AbsoluteUri
        $answer = Read-Host "Do you want to continue? (y/n)" 
        $answer = $answer.ToLower()
        if($answer -ne "y" -and $answer -ne "yes" )
        {
            Write-Host "Cancelling"
            exit;
        }
        $quiet = Remove-AzDataLakeGen2Item -Context $context -FileSystem $filesystem -Path $path -Force
    }
    else {
        Write-Host $env:ADLS_ROOTPATH does not exist. Creating new folder.
    }

    $rootDir = New-AzDataLakeGen2Item -Context $context -FileSystem $filesystem -Path $path -Directory
}
else {
    Write-Warning "Expected root path to contain a folder path. Files will only be added, not deleted."
}


#
# Create files and directories needed for unit tests
#
$emptyFile = New-TemporaryFile

# create data for write-read tests
Write-Host 
Write-Host "Creating data for write-read tests"
$subPath = Join-Path $path "WriteReadTest"
$quiet = New-AzDataLakeGen2Item -Context $context -FileSystem $filesystem -Path $subpath -Directory
Write-Host "Complete"
Write-Host 

# create data for file enum tests
Write-Host "Creating data for file-enumeration tests"
$subPath = Join-Path $path "FileEnumTest"
$quiet = New-AzDataLakeGen2Item -Context $context -FileSystem $filesystem -Path $subpath -Directory

$percentComplete = 0;
for($i = 1; $i -le 4; $i++)
{
    $folderPath = Join-Path $subPath ("Folder " + $i)
    for($j = 1; $j -le 5; $j++)
    {
        $subfolderPath = Join-Path $folderPath ("subolder " + $j)
        for($k = 1; $k -le 5; $k++)
        {
            $filePath = Join-Path $subfolderPath ("file " + $k + ".csv")
            $quiet = New-AzDataLakeGen2Item -Context $context -FileSystem $filesystem -Path $filePath -Source $emptyFile -Force
            Write-Progress -Activity "Uploading file-enumeration test files" -Status "$percentComplete% complete" -PercentComplete $percentComplete
            $percentComplete++
        }
    }
}
Write-Host "Complete"
Write-Host 

# create data for file-modified-time tests
Write-Host "Creating data for file-modified-time tests"
$subPath = Join-Path $path "FileTimeTest"
$quiet = New-AzDataLakeGen2Item -Context $context -FileSystem $filesystem -Path $subpath -Directory
$filePath = Join-Path $subPath "CheckFileTime.txt"
$quiet = New-AzDataLakeGen2Item -Context $context -FileSystem $filesystem -Path $filePath -Source $emptyFile -Force
Write-Host "Complete"
Write-Host 

Remove-Item $emptyFile
