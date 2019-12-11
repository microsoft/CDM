# Sample - Read a Local model.json File and Save It To ADLS

This sample demonstrates CDM Object Model use case in which a model.json file is loaded from a local file-system, its content explored and then changed, and finally saved to an ADLSg2 destination.

**_IMPORTANT: Before running this sample, make sure following is satisfied:_**
  1. The OM library is added to the assembly lookup path
  2. The modelJsonRoot constant points to the location of the example.model.json file
  3. ADLSg2 adapter configuration is updated according to your env setup
  4. The partition location in model.json file is specifying the same ADLSg2 account and file-system settings
  5. Ensure the Azure user object is assigned "Storage Blob Data Contributor" role in the ADLSg2 access management page