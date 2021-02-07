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
public class ResourceAdapter extends StorageAdapterBase {
    private static final Logger LOGGER = LoggerFactory.getLogger(ResourceAdapter.class);
    private static final String ROOT = "Microsoft.CommonDataModel.ObjectModel.Resources";
    
    @Override
    public boolean canRead() {
        return true;
    }

    @Override
    public CompletableFuture<String> readAsync(String corpusPath) {
        return CompletableFuture.supplyAsync(() -> {

            final InputStream resourcePath = ResourceAdapter.class.getResourceAsStream(corpusPath);

            if (resourcePath == null) {
                throw new StorageAdapterException("There is no resource found for " + corpusPath);
            }

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
}
