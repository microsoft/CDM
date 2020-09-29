# Azure Data Lake Storage Gen2 Tests

The Object Model code includes unit tests for communicating with Azure Data Lake Storage via the ADLSAdapter in each supported language. These tests are disabled by default as they require a properly configured Azure Storage Account and configuration data for communicating with that account. If you have an Azure Data Lake Storage Gen2 storage account and wish to run these tests follow the instructions below.

### Instructions

1. Set the environment variables listed in the table below on the machine you wish to run the tests.
1. Install [Azure Powershell](https://docs.microsoft.com/en-us/powershell/azure/).
1. Run the [CreateADLSData.ps1](CreateADLSData.ps1) powershell script. You will only need to run this script once, not each time you run the tests.
1. Now when running unit tests in any language the ADLSAdapter tests will be included.

### Environment Variables

| Environment Variable Name | Description of Value | Example Value |
| :------------- | :----------: | -----------: |
| ADLS_RUNTESTS | If this variable exists tests will run | 1 |
| ADLS_HOSTNAME | Endpoint for your storage account | mystorageaccount.dfs.core.windows.net |
| ADLS_ROOTPATH | Path to the TestData folder in your ADLS container | containername/TestData |
| ADLS_TENANT | ID GUID of your Azure tenant | 6A7621BF-95B8-4676-AE69-4F7E94226B10 |
| ADLS_CLIENTID | App registration ID GUID for clientId/secret authentication | 268F02D4-91FB-4953-84B5-8AA540E3BC6E |
| ADLS_CLIENTSECRET | App registration secret for clientId/secret authentication | [string of random characters] |
| ADLS_SHAREDKEY | Access key string for using shared key authentication | [string of random characters] |
