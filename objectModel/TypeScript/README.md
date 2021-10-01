# Introduction

Typescript SDK for Common Data Model.

# Setup Instructions

1. The build process requires PowerShell. Make sure to add Powershell to your PATH - `C:\Windows\System32\WindowsPowerShell\v1.0`

1. Install [Node.js](https://nodejs.org/en/download/).

1. To set up debugging in Visual Studio Code, create launch.json configuration with following:

    ```json
   {
        "version": "0.2.0",
        "configurations": [
            {
                "name": "Debug Jest Tests",
                "type": "node",
                "request": "launch",
                "runtimeArgs": [
                "--inspect-brk",
                "--trace-uncaught",
                "${workspaceRoot}/node_modules/jest/bin/jest.js",
                "--runInBand"
                ],
                "console": "integratedTerminal",
                "internalConsoleOptions": "neverOpen",
                "port": 9229
            }
        ]
   }
   ```

   You can optionally install [Jest Test Explorer](https://marketplace.visualstudio.com/items?itemName=kavod-io.vscode-jest-test-adapter) to run the tests using an extensible user interface - [Test Explorer UI](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-test-explorer).

# Build

1. To download packages and their dependencies type `npm ci`.
    > **__Note:__** Use **`npm ci`** instead of **`npm install`**. One of the biggest downside of the `npm install` command is its unexpected behavior that it may mutate the `package-lock.json`, whereas `npm ci` only uses the version in the lockfile and produces an error if the `package-lock.json` and `package.json` are out of sync.

1. To build the project type `npm run build`

# Unit tests

1. To run the unit tests type `npm run test`
1. A set of Azure Data Lake Storage Gen2 tests are included but disabled by default. To enable them follow the instructions [here](../CSharp/Microsoft.CommonDataModel.ObjectModel.Tests/README.md)
