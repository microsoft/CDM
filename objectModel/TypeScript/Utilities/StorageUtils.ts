// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

/**
 * Class to contain storage-related utility methods
 */
export class StorageUtils {
    /**
     * The namespace separator
     */
    public static namespaceSeparator: string = ':/';

    /**
     * Splits the object path into the namespace and path.
     */
    public static splitNamespacePath(objectPath: string): [string, string] {
        if (objectPath === undefined) {
            return undefined;
        }
        let namespace: string = '';
        if (objectPath.includes(StorageUtils.namespaceSeparator)) {
            namespace = objectPath.slice(0, objectPath.indexOf(StorageUtils.namespaceSeparator));
            objectPath = objectPath.slice(objectPath.indexOf(StorageUtils.namespaceSeparator) + 1);
        }

        return [namespace, objectPath];
    }
}
