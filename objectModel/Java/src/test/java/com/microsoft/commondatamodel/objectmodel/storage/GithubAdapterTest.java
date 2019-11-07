package com.microsoft.commondatamodel.objectmodel.storage;

import java.time.Duration;
import java.util.concurrent.ExecutionException;
import org.testng.Assert;
import org.testng.annotations.Test;

public class GithubAdapterTest {

    @Test
    public void checkSuccessfulRead() throws ExecutionException, InterruptedException {
        final GithubAdapter githubAdapter = new GithubAdapter();
        githubAdapter.setTimeout(Duration.ofMillis(5000));
        githubAdapter.setMaximumTimeout(Duration.ofMillis(10000));
        githubAdapter.setNumberOfRetries(2);
        final String s = githubAdapter.readAsync("/foundations.cdm.json").get();

        Assert.assertNotNull(s);
    }
}
