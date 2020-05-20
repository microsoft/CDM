# Build
The build requires presence of schema docs folder, which will ensure build script can access foundation files for bundling them in the library. Please refer to objectmodel/pom.xml file, resources section, for exact location of the folder.

To build CDM library packages with all 3rd-party dependencies bundled, use following command:
```
mvn clean package -P build-with-dependencies 
```

Some objectmodel project tests that require ADLS credentials are skipped by default. You can run these tests with the following commands:
```
// Run AdlsAdapterTest with shared key.
mvn -Dtest=AdlsAdapterTest -DtestAdlsAccountName="ACCOUNT_NAME" -DtestAdlsRoot="/ROOT" -DtestAdlsSharedKey="SHARED_KEY" test
```
```
// Run AdlsAdapterTest with secret key.
mvn -Dtest=AdlsAdapterTest -DtestAdlsAccountName="ACCOUNT_NAME" -DtestAdlsRoot="/ROOT" -DtestAdlsClientId="CLIENT_ID" -DTEST_ADLS_SECRET="SECRET" test
```
