// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage;

import com.google.common.base.Strings;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Implementation of the resource adapter, enables the access to the files that are marked as resources.
 */
public class ResourceAdapter implements StorageAdapter {
    private static final Logger LOGGER = LoggerFactory.getLogger(ResourceAdapter.class);

    private String locationHint;
    private String root;
    private static final String[] resourceFolders = {
        "extensions",
        "ODI_analogs/customer",
        "ODI_analogs"};

    public ResourceAdapter() {
        try {
            this.root =
                ResourceAdapter.class.getProtectionDomain()
                    .getCodeSource()
                    .getLocation()
                    .toURI()
                    .getPath();
        } catch (URISyntaxException e) {
            LOGGER.error("There was an issue with constructing the root path for resources.");
        }
    }

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

        String adapterPath = corpusPath.replace("-", "_");

        if (adapterPath.startsWith("/")) {
            adapterPath = StringUtils.stripStart(adapterPath, "/");
        }
        return root + adapterPath;
    }

    @Override
    public String createCorpusPath(String adapterPath) {
        if (Strings.isNullOrEmpty(adapterPath) || !adapterPath.startsWith(this.root)) {
            return null;
        }

        final String corpusPathWithSlashes = adapterPath.substring(root.length());

        final String[] corpusPathWithSlashesArray = corpusPathWithSlashes.split("/");

        // Iterate through possible folders.
        for (final String folder : resourceFolders) {
            final String[] folderPathArray = folder.split("/");

            // Check if the folder and the subfolder match.
            if ((corpusPathWithSlashesArray.length > 1 && folderPathArray.length > 1
                && Objects.equals(corpusPathWithSlashesArray[0], folderPathArray[0])
                && Objects.equals(corpusPathWithSlashesArray[1], folderPathArray[1]))
                || (corpusPathWithSlashesArray.length > 0
                && Objects.equals(corpusPathWithSlashesArray[0], folder))) {
                return "/" + folder.replace("_", "-")
                    + "/" + corpusPathWithSlashes.substring(folder.length() + 1);
            }
        }

        // If the adapter path doesn't contain any folder.
        return "/" + corpusPathWithSlashes;
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
