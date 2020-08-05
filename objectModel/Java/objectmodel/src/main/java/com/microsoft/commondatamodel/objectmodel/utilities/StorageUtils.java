// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import org.apache.commons.lang3.tuple.ImmutablePair;

/**
 * Class to contain storage-related utility methods
 */
public class StorageUtils {
    /**
     * The namespace separator
     */
    public static final String namespaceSeparator = ":/";

    /**
     * Splits the object path into the namespace and path.
     */
    public static ImmutablePair<String, String> splitNamespacePath(String objectPath) {
        if (objectPath == null) {
            return null;
        }

        String namespace = "";
        if (objectPath.contains(namespaceSeparator)) {
            namespace = objectPath.substring(0, objectPath.indexOf(namespaceSeparator));
            objectPath = objectPath.substring(objectPath.indexOf(namespaceSeparator) + 1);
        }
        return new ImmutablePair<>(namespace, objectPath);
    }
}
