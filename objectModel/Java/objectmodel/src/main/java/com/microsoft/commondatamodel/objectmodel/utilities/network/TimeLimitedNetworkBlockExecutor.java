package com.microsoft.commondatamodel.objectmodel.utilities.network;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/**
 * Time-limited block executor will execute a request with a specified timeout, and interrupt the execution
 * if the timeout becomes due.
 */
public class TimeLimitedNetworkBlockExecutor {

    /**
     * Send a CDM request with the retry logic.
     *
     * @param runnable The runnable object which represents code we want to run.
     * @param timeout  The maximum timeout that runnable is allowed to run.
     * @param timeUnit The time unit.
     */
    public static void runWithTimeout(final Runnable runnable, final long timeout, final TimeUnit timeUnit) {
        runWithTimeout(() -> {
            runnable.run();
            return null;
        }, timeout, timeUnit);
    }

    public static <T> T runWithTimeout(final Callable<T> callable, final long timeout, final TimeUnit timeUnit) {
        final ExecutorService executor = Executors.newSingleThreadExecutor();
        final Future<T> future = executor.submit(callable);
        executor.shutdown();
        try {
            return future.get(timeout, timeUnit);
        } catch (final TimeoutException e) {
            // Interrupt the thread and throw timeout exception in the case of failure.
            future.cancel(true);
            throw new CdmTimedOutException();
        } catch (final ExecutionException | InterruptedException e) {
            throw new CdmTimedOutException();
        }
    }
}
