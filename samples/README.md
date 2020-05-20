# Common Data Model samples

This folder contains the samples demonstrating different scenarios of using the Common Data Model APIs.

The Common Data Model library uses assembly lookup to discover and register additional formats. Absense of these assemblies will raise System.IO.FileNotFoundException which will be captured by the Common Data Model library to allow the normal operation to continue. However, if your Visual Studio IDE is set up to break on CLR exceptions, the execution of the sample will be stopped at the moment the exception is raised. Please uncheck breaking on System.IO.FileNotFoundException in Exception Settings window in Visual Studio to prevent interruptions.