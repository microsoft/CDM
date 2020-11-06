// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities.concurrent;

import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.CompletableFuture;

/**
 * Similar to the Semaphore but stops the execution on the CompletableFuture
 * level instead of the whole thread.
 * @deprecated for internal use only.
 */
public class ConcurrentSemaphore {
  /**
   * Number of concurrent completable allowed to run at the same time.
   */
  private Integer permits;

  /**
   * Queue of completable futures waiting for a permit to be available.
   */
  private Queue<CompletableFuture<Void>> queue;

  public ConcurrentSemaphore() {
    this.permits = null;
    this.queue = new LinkedList<>();
  }

  /**
   * Acquires a permit to keep the execution.
   * 
   * @return a CompletableFuture that is completed once there is a permit
   *         available.
   */
  public synchronized CompletableFuture<Void> acquire() {
    // if permits is null, it means that the queue is unbounded.
    if (permits == null) {
      return CompletableFuture.completedFuture(null);
    }

    // if there are enough permits, decrement it by one and allow the completable
    // future to run.
    if (permits > 0) {
      permits--;
      return CompletableFuture.completedFuture(null);
    }

    // if there are no permit available, add the completable to the queue
    // and it will be allowed to run when another completable releases a permit.
    CompletableFuture<Void> promise = new CompletableFuture<>();
    queue.add(promise);
    return promise;
  }

  /**
   * Releases a permit and allows other CompletableFutures to run.
   */
  public synchronized void release() {
    // gets the next completable future from the queue.
    CompletableFuture<Void> nextPromise = queue.poll();

    if (nextPromise != null) {
      // there is another completable future waiting to run, allow it but don't modify
      // the number of permits.
      nextPromise.complete(null);
    } else if (permits != null) {
      // there is no completable waiting to run so just increment the number of
      // available permits.
      permits++;
    }
  }

  /**
   * Number of concurrent completable allowed to run at the same time.
   */
  public Integer getPermits() {
    return permits;
  }

  /**
   * Number of concurrent completable allowed to run at the same time.
   */
  public void setPermits(Integer permits) {
    this.permits = permits;
  }
}
