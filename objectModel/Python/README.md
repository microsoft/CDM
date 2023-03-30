# Introduction

Python SDK for Common Data Model.

# Setup Instructions

Note: These instructions were verified on Windows. For Mac, the steps might change a bit.

1. Download Python 3.7+ x86-64 executable installer from [python.org](https://www.python.org/downloads/).
1. Run the installer. Make sure 'Add Python 3.7 to PATH' checkbox is ticked during installation.
1. Open command prompt, change to the cloned repository folder and type `python -m venv env` to create a virtual Python environment.
1. Make sure that you have Visual Studio Code installed. Type `code .` to open the folder in Visual Studio Code.
1. In Visual Studio Code, install the [Python extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-python.python).
1. Select `Python: Create Terminal` command from the Command Palette (Ctrl+Shift+P). From the terminal, type:
   * `pip3 install -r requirements.txt` to install project runtime dependencies.
   * `pip3 install -r dev-requirements.txt` to install project development dependencies.
1. The project requires some base files that are present in the schemaDocuments folder. Run `python .\setup.py copy_resources` to copy the necessary files to the project.
1. To enable debugging of sample code in VSCode, please update your launch.json file with following settings:
   "cwd": "${workspaceFolder}",
   "env": {
   "PYTHONPATH": "${workspaceRoot}"
   }

Note: If in step 6 on Mac you receive error mentioning TLSV1_ALERT_PROTOCOL_VERSION, you need to upgrade pip with command `curl https://bootstrap.pypa.io/get-pip.py | python3 - 'pip==9.0.3' --user`, followed by `pip3 install --upgrade setuptools --user`. Then repeat the command to install all of the project requirements from step 6.

# Run Unit Tests

1. To run the unit tests type `python -m unittest`
1. A set of Azure Data Lake Storage Gen2 tests are included but disabled by default. To enable them follow the instructions [here](../CSharp/Microsoft.CommonDataModel.ObjectModel.Tests/README.md)


If running Python: Create Terminal gives errors about running scripts and execution policies, add this to the settings.json for vscode:
"terminal.integrated.profiles.windows": {
  "PowerShell": {
    "source": "PowerShell",
    "icon": "terminal-powershell",
    "args": ["-ExecutionPolicy", "Bypass"]
  }
},
"terminal.integrated.defaultProfile.windows": "PowerShell",