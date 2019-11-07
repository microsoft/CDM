package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.io.IOException;

/**
 * Key and value pair class.
 * 
 * @param <K> Key type
 * @param <V> Value type
 */
@JsonSerialize(using = KeyValuePairSerializer.class)
@JsonDeserialize(using = KeyValuePairDeserializer.class)
public class KeyValuePair<K, V> {
    private K key;
    private V value;

    public KeyValuePair() {
    }

    public KeyValuePair(final K key, final V value) {
        this.key = key;
        this.value = value;
    }

    public K getKey() {
        return this.key;
    }

    public void setKey(final K key) {
        this.key = key;
    }

    public V getValue() {
        return this.value;
    }

    public void setValue(final V value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "{" +
            " key='" + getKey() + "'" +
            ", value='" + getValue() + "'" +
            "}";
    }
}

class KeyValuePairSerializer extends JsonSerializer<KeyValuePair> {
    @Override
    public void serialize(final KeyValuePair kvp, final JsonGenerator jsonGenerator,
                          final SerializerProvider serializerProvider) throws IOException {

        jsonGenerator.writeStartObject();
        jsonGenerator.writeFieldName(kvp.getKey().toString());
        jsonGenerator.writeString(kvp.getValue().toString());
        jsonGenerator.writeEndObject();
    }
}

class KeyValuePairDeserializer extends JsonDeserializer<KeyValuePair> {
    @Override
    public KeyValuePair deserialize(final JsonParser jsonParser,
                                    final DeserializationContext deserializationContext) throws IOException {

        String tmp = jsonParser.getText(); // {
        jsonParser.nextToken();
        final String key = jsonParser.getText();
        jsonParser.nextToken();
        final String value = jsonParser.getText();
        jsonParser.nextToken();
        tmp = jsonParser.getText(); // }

        return new KeyValuePair(key, value);
    }
}