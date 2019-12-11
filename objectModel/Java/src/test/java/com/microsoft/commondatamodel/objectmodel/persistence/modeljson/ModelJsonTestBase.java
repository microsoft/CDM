package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.RemoteAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import org.testng.Assert;

public class ModelJsonTestBase {

  static final ObjectMapper TEST_MAPPER;
  private static final String LOCAL = "local";
  private static final String CDM = "cdm";
  private static final String CONTOSO = "contoso";
  private static final String HTTP_CONTOSO_COM = "http://contoso.com";
  private static final String REMOTE = "remote";
  private static final String SCHEMA_DOCS_ROOT = "../CDM.SchemaDocuments";

  static {
    SimpleModule timeModule = new JavaTimeModule();
    timeModule.addSerializer(OffsetDateTime.class, new JsonSerializer<OffsetDateTime>() {
          final DateTimeFormatter simpleDateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSSSSSXXX");

          @Override
          public void serialize(OffsetDateTime offsetDateTime, JsonGenerator
              jsonGenerator, SerializerProvider serializerProvider) throws IOException {
            jsonGenerator.writeString(simpleDateFormat.format(offsetDateTime));
          }
        }
    );

    TEST_MAPPER = new ObjectMapper().setSerializationInclusion(JsonInclude.Include.NON_NULL)
        .registerModule(timeModule)
        .enable(SerializationFeature.INDENT_OUTPUT)
        .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false)
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
  }

  /**
   * Uses predefined settings to serialize an object.
   *
   * @param data The object to be serialized
   * @return A string containing the serialized object.
   */
  public static String serialize(Object data) throws JsonProcessingException {
    final JsonNode result = TEST_MAPPER.valueToTree(data);
    return TEST_MAPPER.writeValueAsString(result);
  }

  /**
   * se predefined settings to deserialize an object.
   *
   * @param data The type of the object to be deserialized
   * @param <T>  String to be deserialized into an object
   * @return The deserialized object.
   */
  public static <T> T deserialize(String data, Class<T> convertToClass) throws IOException {
    return TEST_MAPPER.readValue(data, convertToClass);
  }

  /**
   * Gets local corpus.
   *
   * @return {@link CdmCorpusDefinition}
   */
  protected CdmCorpusDefinition getLocalCorpus(final String testFilesRoot) {
    Assert.assertTrue((Files.isDirectory(Paths.get(SCHEMA_DOCS_ROOT))), "SchemaDocsRoot not found!!!");

    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    cdmCorpus.getStorage().setDefaultNamespace(LOCAL);

    final StorageAdapter localAdapter = new LocalAdapter(testFilesRoot);
    cdmCorpus.getStorage().mount(LOCAL, localAdapter);

    final LocalAdapter cdmAdapter = new LocalAdapter(SCHEMA_DOCS_ROOT);
    cdmCorpus.getStorage().mount(CDM, cdmAdapter);

    // Un-mounts the default cdm and mounts the resource adapter. This will
    // also implicitly test the resource adapter functionality.
    cdmCorpus.getStorage().unmount(CDM);

    final RemoteAdapter remoteAdapter = new RemoteAdapter();
    remoteAdapter.setTimeout(Duration.ofMillis(5000));
    remoteAdapter.setMaximumTimeout(Duration.ofMillis(10000));
    remoteAdapter.setNumberOfRetries(2);
    remoteAdapter.addHost(CONTOSO, HTTP_CONTOSO_COM);

    cdmCorpus.getStorage().mount(REMOTE, remoteAdapter);

    return cdmCorpus;
  }
}
