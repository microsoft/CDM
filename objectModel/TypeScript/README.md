# Introduction

Typescript SDK for Common Data Model.

# Setup Instructions

The build process requires PowerShell. Make sure to add Powershell to your PATH - `C:\Windows\System32\WindowsPowerShell\v1.0`

Install [Node.js](https://nodejs.org/en/download/).

In Visual Studio Code, install [Jest Test Explore](https://marketplace.visualstudio.com/items?itemName=rtbenfield.vscode-jest-test-adapter) to run the tests using an extensible user interface - [Test Explorer UI](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-test-explorer).

# Build

1. To build the project type `npm run build`

# Unit tests

1. To run the unit tests type `npm run test`
1. A set of Azure Data Lake Storage Gen2 tests are included but disabled by default. To enable them follow the instructions [here](../CSharp/Microsoft.CommonDataModel.ObjectModel.Tests/README.md)