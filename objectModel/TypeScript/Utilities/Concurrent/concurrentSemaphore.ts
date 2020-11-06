// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

/**
 * Interface that represents each indivial promise waiting in the queue.
 */
interface WaitingPromise {
    resolve: (value?: void | PromiseLike<void>) => void
}

/**
 * Similar to the Semaphore but stops the execution on the Promise level instead of the whole thread.
 * @internal
 */
export class ConcurrentSemaphore {
    /**
     * Number of concurrent promises allowed to run at the same time.
     */
    permits?: number;

    /**
     * Queue of promises waiting for a permit to be available.
     */
    queue: WaitingPromise[];

    constructor() {
        this.permits = undefined;
        this.queue = [];
    }

    /**
     * Acquires a permit to keep the execution.
     * @return a Promise that is completed once there is a permit available.
     */
    public acquire(): Promise<void> {
        // if permits is null, it means that the queue is unbounded.
        if (this.permits === undefined || this.permits === null) {
            return Promise.resolve();
        }

        // if there are enough permits, decrement it by one and allow the completable future to run.
        if (this.permits > 0) {
            this.permits--;
            return Promise.resolve();
        }

        // if there are no permit available, add the completable to the queue
        // and it will be allowed to run when another completable releases a permit.
        return new Promise<void>((resolve, error) => {
            this.queue.push({ 'resolve': resolve });
        });
    }

    /**
     * Releases a permit and allows other Promises to run.
     */
    public release(): void {
        // gets the next completable future from the queue.
        const nextPromise = this.queue.shift();

        if (nextPromise !== undefined) {
            // there is another completable future waiting to run, allow it but don't modify the number of permits.
            nextPromise.resolve();
        } else if (this.permits !== undefined && this.permits !== null) {
            // there is no completable waiting to run so just increment the number of available permits.
            this.permits++;
        }
    }
}
