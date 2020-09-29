# Common Data Model usage notes

The Common Data Model library uses assembly lookup to discover and register additional formats. Absense of these assemblies will raise System.IO.FileNotFoundException which will be captured by the Common Data Model library to allow the normal operation to continue. However, if your Visual Studio IDE is set up to break on CLR exceptions, the execution of the library code will be stopped at the moment the exception is raised. Please uncheck breaking on System.IO.FileNotFoundException in Exception Settings window in Visual Studio to prevent interruptions.

# UnitTests

1. Unit tests are in included in the projects named Microsoft.CommonDataModel.ObjectModel*.Tests.csproj.  These can be run using Visual Studio's Test Explorer window or via the command line.
1. A set of Azure Data Lake Storage Gen2 tests are included but disabled by default. To enable them follow the instructions [here](./Microsoft.CommonDataModel.ObjectModel.Tests/README.md)