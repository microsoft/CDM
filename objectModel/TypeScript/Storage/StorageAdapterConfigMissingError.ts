export class StorageAdapterConfigMissingError extends Error {
    constructor(configProperty : string) {
        super (`The config property '${configProperty}' is not configured properly. Please check your storage adapter configs!`);
    }
}