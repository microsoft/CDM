To run the auto-doc generation tool:

1. Build CDM.ObjectModel.TS

- To ensure resolved entity has is.linkedEntity.identifier trait which released version of cdm.objectmodel don't have, we need to npm link to newest source code before.

    ```
    cd CDM.ObjectModel.TS
    npm install
    tsc
    npm link
    ```

NOTE: In order to run locally with npm link do teh following for entity-api too. The commands for that are: 
    1. cd entity-api
    2. npm uninstall cdm.objectmodel
    3. npm install
    4. npm link cdm.objectmodel
    5. tsc
    
2. Build doc-generator

NOTE: By default the readme files are generated with links for test run, if you want full run links, switch parameters at Marker FullRun.
    Param1: path to CDM.SchemaDocs root (default: ../testCorpus/)  
    Param2: target folder path for output (default: doc)  
    Param3: language setting, decide which strings.json file to read. (default: en)

    ```
    cd doc-generator
    npm uninstall cdm.objectmodel
    npm install
    npm link cdm.objectmodel
    npm run build
    node --max-old-space-size=4096 .\dist\main.js ..\..\CDM.SchemaDocuments\
    ```

    Doc-generator is directly calling entity-api in github-pages-gen folder which needs to be changed in the future.