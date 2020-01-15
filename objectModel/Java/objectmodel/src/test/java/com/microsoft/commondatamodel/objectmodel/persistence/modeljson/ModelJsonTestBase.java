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
import java.io.IOException;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;

public class ModelJsonTestBase {

  static final ObjectMapper TEST_MAPPER;

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
}
