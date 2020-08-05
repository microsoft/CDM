// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage;

import com.google.common.base.Strings;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Implementation of the resource adapter, enables the access to the files that are marked as resources.
 */
public class ResourceAdapter implements StorageAdapter {
    private static final Logger LOGGER = LoggerFactory.getLogger(ResourceAdapter.class);
    private static final String ROOT = "Microsoft.CommonDataModel.ObjectModel.Resources";
    private String locationHint;

    @Override
    public void setLocationHint(String locationHint) {
        this.locationHint = locationHint;
    }

    @Override
    public String getLocationHint() {
        return locationHint;
    }

    @Override
    public boolean canRead() {
        return true;
    }

    @Override
    public boolean canWrite() {
        return false;
    }

    @Override
    public CompletableFuture<String> readAsync(String corpusPath) {
        return CompletableFuture.supplyAsync(() -> {

            final InputStream resourcePath = ResourceAdapter.class.getResourceAsStream(corpusPath);

            // Read the file from the resource path line by line.
            try (final BufferedReader br = new BufferedReader(new InputStreamReader(resourcePath))) {
                final StringBuilder result = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    result.append(line);
                }
                return result.toString();
            } catch (final IOException exception) {
                throw new StorageAdapterException("There was an issue while reading file at " + corpusPath, exception);
            }
        });
    }

    @Override
    public CompletableFuture<Void> writeAsync(String corpusPath, String data) {
        return CompletableFuture.completedFuture(null);
    }

    @Override
    public String createAdapterPath(String corpusPath) throws StorageAdapterException {
        if (Strings.isNullOrEmpty(corpusPath)) {
            return null;
        }
        
        return ROOT + corpusPath;
    }

    @Override
    public String createCorpusPath(String adapterPath) {
        if (Strings.isNullOrEmpty(adapterPath) || !adapterPath.startsWith(ROOT)) {
            return null;
        }

        return adapterPath.substring(ROOT.length());
    }

    @Override
    public void clearCache() {
        // Intended to return none.
        return;
    }

    @Override
    public CompletableFuture<OffsetDateTime> computeLastModifiedTimeAsync(String corpusPath)
        throws StorageAdapterException {
        return CompletableFuture.completedFuture(OffsetDateTime.now());
    }

    @Override
    public CompletableFuture<List<String>> fetchAllFilesAsync(String folderCorpusPath) {
        return CompletableFuture.completedFuture(null);
    }

    @Override
    public String fetchConfig() {
        throw new UnsupportedOperationException("This adapter does not support the fetchConfig method.");
    }

    @Override
    public void updateConfig(String config) throws IOException {
        throw new UnsupportedOperationException("This adapter does not support the updateConfig method.");
    }
}
