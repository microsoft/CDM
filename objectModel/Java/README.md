# Build
The build requires presence of schema docs folder placed on the same level as this folder. This will ensure build script can access foundation files which need to be bundled with the library. Please refer to objectmodel/pom.xml file, resources section, for exact name of the folder.

Some objectmodel project tests that require ADLS credentials are skipped by default. You can run these tests with the following commands:
```
// Run AdlsAdapterTest with shared key.
mvn -Dtest=AdlsAdapterTest -DtestAdlsAccountName="ACCOUNT_NAME" -DtestAdlsRoot="/ROOT" -DtestAdlsSharedKey="SHARED_KEY" test
```
```
// Run AdlsAdapterTest with secret key.
mvn -Dtest=AdlsAdapterTest -DtestAdlsAccountName="ACCOUNT_NAME" -DtestAdlsRoot="/ROOT" -DtestAdlsClientId="CLIENT_ID" -DTEST_ADLS_SECRET="SECRET" test
```
