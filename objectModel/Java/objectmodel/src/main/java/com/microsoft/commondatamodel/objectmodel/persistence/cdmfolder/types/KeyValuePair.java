// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
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
    private K name;
    private V value;

    public KeyValuePair() {
    }

    public KeyValuePair(final K name, final V value) {
        this.name = name;
        this.value = value;
    }

    public K getName() {
        return this.name;
    }

    public void setName(final K name) {
        this.name = name;
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
            " name='" + getName() + "'" +
            ", value='" + getValue() + "'" +
            "}";
    }
}

class KeyValuePairSerializer extends JsonSerializer<KeyValuePair> {
    @Override
    public void serialize(final KeyValuePair kvp, final JsonGenerator jsonGenerator,
                          final SerializerProvider serializerProvider) throws IOException {

        jsonGenerator.writeStartObject();
        jsonGenerator.writeFieldName("name");
        jsonGenerator.writeString(kvp.getName().toString());
        jsonGenerator.writeFieldName("value");
        jsonGenerator.writeString(kvp.getValue().toString());
        jsonGenerator.writeEndObject();
    }
}

class KeyValuePairDeserializer extends JsonDeserializer<KeyValuePair> {
    @Override
    public KeyValuePair<?, ?> deserialize(
        final JsonParser jsonParser,
        final DeserializationContext deserializationContext) throws IOException {

        /** Input data could either be
         *  Scenario 1:
         * {
         *   "test": "something"
         * }
         * or
         * Scenario 2:
         * {
         *   "key": "test",
         *   "value": "somethingelse"
         * }
         */
        final JsonNode node = jsonParser.readValueAsTree();

        // Scenario 1:
        if (node.size() == 1) {
            final String name = node.fieldNames().next();
            return new KeyValuePair<>(name, node.get(name).asText());
        } else if (node.has("key")) {
            return new KeyValuePair<>(node.get("key").asText(), node.get("value").asText());
        } else if (node.has("name")) {
            return new KeyValuePair<>(node.get("name").asText(), node.get("value").asText());
        }

        return null;
    }
}
