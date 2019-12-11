# Build
Some tests that require ADLS credentials are skipped on default. You can run these tests with the following commands.

```
// Run AdlsAdapterTest with shared key.
mvn -Dtest=AdlsAdapterTest -DtestAdlsAccountName="ACCOUNT_NAME" -DtestAdlsRoot="/ROOT" -DtestAdlsSharedKey="SHARED_KEY" test
```
```
// Run AdlsAdapterTest with secret key.
mvn -Dtest=AdlsAdapterTest -DtestAdlsAccountName="ACCOUNT_NAME" -DtestAdlsRoot="/ROOT" -DtestAdlsClientId="CLIENT_ID" -DTEST_ADLS_SECRET="SECRET" test
```