# Build
The build requires presence of schema docs folder, which will ensure build script can access foundation files for bundling them in the library. Please refer to objectmodel/pom.xml file, resources section, for exact location of the folder.

To build CDM library packages with all 3rd-party dependencies bundled, use following command:
```
mvn clean package -P build-with-dependencies 
```
// disable path
//
Some objectmodel project tests communicate with Azure Data Lake Stroage Gen2. These tests are disabled by default. To enable these tests follow the instructions [here](../CSharp/Microsoft.CommonDataModel.ObjectModel.Tests/README.md)
