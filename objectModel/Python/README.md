# Introduction

Python SDK for Common Data Model.

# Setup Instructions

Note: These instructions were verified on Windows. For Mac, the steps might change a bit.

1. Download Python 3.5.4 x86-64 executable installer from [python.org](https://www.python.org/downloads/release/python-354/).
2. Run the installer. Make sure 'Add Python 3.5 to PATH' checkbox is ticked during installation.
3. Open command prompt, change to the cloned repository folder and type `python -m venv env` to create a virtual Python environment.
4. Make sure that you have Visual Studio Code installed. Type `code .` to open the folder in Visual Studio Code.
5. In Visual Studio Code, install the [Python extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-python.python).
6. Select `Python: Create Terminal` command from the Command Palette (Ctrl+Shift+P). From the terminal, type `pip3 install -r requirements.txt` to install project dependencies.
7. To enable debugging of sample code in VSCode, please update your launch.json file with following settings:
   "cwd": "${workspaceFolder}",
   "env": {
   "PYTHONPATH": "${workspaceRoot}"
   }

Note: If in step 6 on Mac you receive error mentioning TLSV1_ALERT_PROTOCOL_VERSION, you need to upgrade pip with command `curl https://bootstrap.pypa.io/get-pip.py | python3 - 'pip==9.0.3' --user`, followed by `pip3 install --upgrade setuptools --user`. Then repeat the command to install all of the project requirements from step 6.
