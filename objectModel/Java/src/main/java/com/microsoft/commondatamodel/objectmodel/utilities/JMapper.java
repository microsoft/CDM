package com.microsoft.commondatamodel.objectmodel.utilities;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.util.DefaultIndenter;
import com.fasterxml.jackson.core.util.DefaultPrettyPrinter;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class JMapper {
  public static final ObjectMapper MAP;
  public static final ObjectMapper MAPPER_FOR_SPEW;
  public static final ObjectWriter WRITER;

  static {
    final SimpleModule timeModule = new JavaTimeModule();
    timeModule.addSerializer(OffsetDateTime.class, new JsonSerializer<OffsetDateTime>() {
          final DateTimeFormatter simpleDateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");

          @Override
          public void serialize(final OffsetDateTime offsetDateTime, final JsonGenerator jsonGenerator, final SerializerProvider serializerProvider) throws IOException {
            jsonGenerator.writeString(simpleDateFormat.format(offsetDateTime));
          }
        }
    );

    timeModule.addDeserializer(OffsetDateTime.class, new JsonDeserializer<OffsetDateTime>() {
      @Override
      public OffsetDateTime deserialize(
          final JsonParser jsonParser,
          final DeserializationContext deserializationContext)
          throws IOException {
        final String datetimeStr =  jsonParser.getText();
        try {
          return OffsetDateTime.parse(datetimeStr);
        } catch (final DateTimeParseException e) {
          return LocalDateTime.parse(datetimeStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME).atOffset(OffsetDateTime.now().getOffset());
        }
      }
    });

    MAP = new ObjectMapper().setSerializationInclusion(JsonInclude.Include.NON_NULL)
        .registerModule(timeModule)
        .enable(SerializationFeature.INDENT_OUTPUT)
        .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false)
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    final DefaultPrettyPrinter prettyPrinter = new DefaultPrettyPrinter()
        .withArrayIndenter(new DefaultIndenter("  ", "\n"));

    MAPPER_FOR_SPEW = MAP.copy().disable(SerializationFeature.INDENT_OUTPUT);

    WRITER = MAP.writer(prettyPrinter);
  }

  public static String asTextOrNull(final JsonNode node) {
    return node != null ? node.asText() : null;
  }
}
