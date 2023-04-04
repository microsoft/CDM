// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.samples;

import com.microsoft.commondatamodel.objectmodel.FileReadWriteUtil;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.storage.AdlsAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.CdmStandardsAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.RemoteAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import org.testng.annotations.Test;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.net.MalformedURLException;
import java.nio.file.FileSystems;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class ConfigureAdaptersTest extends SampleTestBase {
    private static final String TEST_NAME = "TestConfigureAdapters";
    private static Scanner SCANNER = null;

    @Test
    public void testConfigureAdapters() throws InterruptedException, IOException {
        this.checkSampleRunTestsFlag();

        TestHelper.deleteFilesFromActualOutput(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, TEST_NAME));
        String testInputPath = new File(TestHelper.getInputFolderPath(TESTS_SUBPATH, TEST_NAME), "input.txt").toString();
        String testActualOutputPath = new File(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, TEST_NAME), "output.txt").toString();

        FileInputStream fileInputStream = new FileInputStream(new File(testInputPath));
        PrintStream printStream = new PrintStream(new File(testActualOutputPath));

        SCANNER = new Scanner(fileInputStream, "UTF-8");
        System.setOut(printStream);

        configureAdapters();

        // Set system.out back to avoid recording tests information in the output.txt
        fileInputStream.close();
        printStream.close();
        System.setOut(System.out);

        TestHelper.assertFileContentEquality(
                FileReadWriteUtil.readFileToString(new File(TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, TEST_NAME), "output.txt").toString()).replace("\uFEFF", ""),
                FileReadWriteUtil.readFileToString(testActualOutputPath).replace("\uFEFF", ""));
    }

    private void configureAdapters() {
        while (true) {
            System.out.println("List of storage adapters:");
            System.out.println("  1: LocalAdapter");
            System.out.println("  2: RemoteAdapter");
            System.out.println("  3: ADLSAdapter");
            System.out.println("Pick a number to configure that storage adapter or press [enter] to exit.");

            // Get the user's input.
            final String input = SCANNER.nextLine().trim().replace("\uFEFF", "");

            if (StringUtils.isNullOrEmpty(input)) {
                break;
            }

            // Make sure the input is a number.
            try {
                final int choice = Integer.parseInt(input);
                switch (choice) {
                    // Local adapter.
                    case 1:
                        configureLocalAdapter();
                        break;
                    // Remote adapter
                    case 2:
                        configureRemoteAdapter();
                        break;
                    // ADLS adapter.
                    case 3:
                        configureADLSAdapter();
                        break;
                    default:
                        System.out.println("\nEnter a number between 1-3.");
                        break;
                }
            } catch (final Exception e) {
                System.out.println("\nEnter a number.");
                SCANNER.next();
                continue;
            }
        }
    }

    static void configureLocalAdapter() {
        final String root = getParameterValueFromUser(
                "root path",
                "LocalAdapter",
                "../../../../../../example-public-standards"
                /* this is just to show what the value should look like. */);

        // Create a local adapter with the parameter values given by the user.
        // Note: You can also configure an adapter for a network drive
        // (file system on a different machine instead of local fs)
        // using the local adapter. Just point the local adapter root to the network drive.
        final LocalAdapter adapter = new LocalAdapter(root);

        // List the newly configured adapter's properties.
        System.out.println("\nLocalAdapter configured. Properties of this LocalAdapter are:");
        System.out.println("  Root: " + adapter.getRoot());
        System.out.println();
    }

    static void configureRemoteAdapter() {
        // Get the list of hosts from the user.
        final Map<String, String> hosts = new HashMap<>();
        System.out.println("The RemoteAdapter contains a dictionary of hosts. The mapping is from a key to a host. (Ex. { \"contoso\": \"http://contoso.com\" })");
        // The RemoteAdapter can have multiple hosts, so keep asking for values until the user is done.
        while (true) {
            System.out.println("Enter the key for the host, or press [enter] if you're done adding hosts. (Ex. \"contoso\").");
            final String key = SCANNER.nextLine().trim();
            if (StringUtils.isNullOrTrimEmpty(key)) {
                // The user doesn't have any more hosts to add.
                break;
            }

            System.out.println("Enter the host. (Ex. \"http://contoso.com\").");
            String path;
            while (true) {
                path = SCANNER.nextLine().trim();
                if (StringUtils.isNullOrTrimEmpty(path)) {
                    System.out.println("Enter the host.");
                } else {
                    break;
                }
            }
            hosts.put(key, path);
        }

        // Default values for the optional parameters used by the remote adapter.
        String timeout = "2000";
        String maximumTimeout = "10000";
        String numberOfRetries = "2";

        // Ask the user if optional parameters should be configured, or if defaults should just be used.
        if (configureOptionalParameters("RemoteAdapter")) {
            // Configure optional parameters.
            timeout = getOptionalParameterValueFromUser(
                    "timeout",
                    "RemoteAdapter",
                    timeout
                    /* this is just to show what the value should look like. */);
            maximumTimeout = getOptionalParameterValueFromUser(
                    "maximum timeout",
                    "RemoteAdapter",
                    maximumTimeout);
            numberOfRetries = getOptionalParameterValueFromUser(
                    "number of retries",
                    "RemoteAdapter",
                    numberOfRetries);
        }

        // Create a remote adapter with the values given by the user.
        final RemoteAdapter adapter = new RemoteAdapter();
        adapter.setTimeout(Duration.ofMillis(Integer.parseInt(timeout)));
        adapter.setMaximumTimeout(Duration.ofMillis(Integer.parseInt(maximumTimeout)));
        adapter.setNumberOfRetries(Integer.parseInt(numberOfRetries));
        adapter.setHosts(hosts);
        // WaitTimeCallback is another optional parameter and can also be configured here.

        // List the newly configured adapter's properties.
        System.out.println("\nRemoteAdapter configured. Properties of this RemoteAdapter are:");
        // Print the key-value pair for the hosts.
        System.out.println("  Hosts: ");
        adapter.getHosts().entrySet().stream().sorted(Map.Entry.comparingByKey()).forEach(pair ->
                System.out.println("    { \"" + pair.getKey() + "\": \"" + pair.getValue() + "\" }")
        );

        System.out.println("  " + ConfigureParameters.Timeout + ": " + adapter.getTimeout().toMillis());
        System.out.println("  " + ConfigureParameters.MaximumTimeout + ": " + adapter.getMaximumTimeout().toMillis());
        System.out.println("  " + ConfigureParameters.NumberOfRetries + ": " + adapter.getNumberOfRetries());
        System.out.println();
    }

    static void configureADLSAdapter() throws MalformedURLException {
        System.out.println(
                "\nEnter 1 to configure the ADLSAdapter through a shared key authentication. "
                        + "Enter 2 to configure through a token authentication.");
        int choice = 1;
        while (true) {
            // Get the user's input.
            try {
                final String input = SCANNER.nextLine().trim();
                if (!StringUtils.isNullOrTrimEmpty(input)) {
                    choice = Integer.parseInt(input);
                    if (choice == 1 || choice == 2) {
                        break;
                    }
                }
            } catch (final Exception e) {
                System.out.println("\nEnter 1 or 2.");
                SCANNER.next();
                continue;
            }
        }

        // Shared key authentication selected.
        if (choice == 1) {
            final String hostname =
                    getParameterValueFromUser(
                            "hostname",
                            "ADLSAdapter",
                            "test.dfs.core.windows.net" /* this is just to show what the value should look like. */);
            final String root =
                    getParameterValueFromUser(
                            "root",
                            "ADLSAdapter",
                            "../../../../../../example-public-standards");
            // DEV-NOTE: This is just a mock shared key used to demonstrate what a shared key should look like. It is not a real shared key.
            final String sharedKey =
                    getParameterValueFromUser(
                            "shared key",
                            "ADLSAdapter",
                            "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

            // Default values for the optional parameters used by the ADLS adapter.
            String timeout = "2000";
            String maximumTimeout = "10000";
            String numberOfRetries = "2";

            if (configureOptionalParameters("ADLSAdapter")) {
                timeout = getOptionalParameterValueFromUser(
                        "timeout",
                        "ADLSAdapter",
                        timeout /* this is just to show what the value should look like. */);
                maximumTimeout = getOptionalParameterValueFromUser(
                        "maximum timeout",
                        "ADLSAdapter", maximumTimeout);
                numberOfRetries = getOptionalParameterValueFromUser(
                        "number of retries",
                        "ADLSAdapter",
                        numberOfRetries);
            }

            // Create an ADLS adapter with the parameter values given by the user.
            final AdlsAdapter adapter = new AdlsAdapter(hostname, root, sharedKey);
            adapter.setTimeout(Duration.ofMillis(Integer.parseInt(timeout)));
            adapter.setMaximumTimeout(Duration.ofMillis(Integer.parseInt(maximumTimeout)));
            adapter.setNumberOfRetries(Integer.parseInt(numberOfRetries));
            // waitTimeCallback is another optional parameter and can also be configured here.

            // List the newly configured adapter's properties.
            System.out.println("\nADLSAdapter configured. Properties of this ADLSAdapter are:");
            System.out.println("  " + ConfigureParameters.Hostname + ": " + adapter.getHostname());
            System.out.println("  " + ConfigureParameters.Root + ": " + adapter.getRoot());
            System.out.println("  " + ConfigureParameters.SharedKey + ": " + adapter.getSharedKey());
            System.out.println("  " + ConfigureParameters.Timeout + ": " + adapter.getTimeout().toMillis());
            System.out.println("  " + ConfigureParameters.MaximumTimeout + ": " + adapter.getMaximumTimeout().toMillis());
            System.out.println("  " + ConfigureParameters.NumberOfRetries + ": " + adapter.getNumberOfRetries());
            System.out.println();
            // Token (clientId/secret) authentication selected.
        } else {
            final String hostname = getParameterValueFromUser(
                    "hostname",
                    "ADLSAdapter",
                    "test.dfs.core.windows.net" /* this is just to show what the value should look like. */);
            final String root = getParameterValueFromUser(
                    "root path",
                    "ADLSAdapter",
                    "../../../../../../example-public-standards");
            final String tenant = getParameterValueFromUser(
                    "tenant",
                    "ADLSAdapter",
                    "00x000xx-00x0-00xx-00xx-0x0xx000xx00");
            final String clientId = getParameterValueFromUser(
                    "client ID",
                    "ADLSAdapter",
                    "xxx00x0x-0x00-0000-x0x0-00xxx000xxx0");
            // DEV-NOTE: This is just a mock secret used to demonstrate what a secret should look like.
            // It is not a real secret.
            final String secret = getParameterValueFromUser(
                    "secret",
                    "ADLSAdapter",
                    "dummySecret");

            // Default values for the optional parameters used by the ADLS adapter.
            String timeout = "2000";
            String maximumTimeout = "10000";
            String numberOfRetries = "2";

            if (configureOptionalParameters("ADLSAdapter")) {
                timeout = getOptionalParameterValueFromUser(
                        "timeout",
                        "ADLSAdapter",
                        timeout /* this is just to show what the value should look like. */);
                maximumTimeout = getOptionalParameterValueFromUser(
                        "maximum timeout",
                        "ADLSAdapter",
                        maximumTimeout);
                numberOfRetries = getOptionalParameterValueFromUser(
                        "number of retries",
                        "ADLSAdapter",
                        numberOfRetries);
            }

            // Create an ADLS adapter with the parameter values given by the user.
            final AdlsAdapter adapter = new AdlsAdapter(hostname, root, tenant, clientId, secret);
            adapter.setTimeout(Duration.ofMillis(Integer.parseInt(timeout)));
            adapter.setMaximumTimeout(Duration.ofMillis(Integer.parseInt(maximumTimeout)));
            adapter.setNumberOfRetries(Integer.parseInt(numberOfRetries));
            // waitTimeCallback is another optional parameter and can also be configured here.

            // List the newly configured adapter's properties.
            System.out.println("\nADLSAdapter configured. Properties of this ADLSAdapter are:");
            System.out.println("  " + ConfigureParameters.Hostname + ": " + adapter.getHostname());
            System.out.println("  " + ConfigureParameters.Root + ": " + adapter.getRoot());
            System.out.println("  " + ConfigureParameters.Tenant + ": " + adapter.getTenant());
            System.out.println("  " + ConfigureParameters.ClientId + ": " + adapter.getClientId());
            System.out.println("  " + ConfigureParameters.Secret + ": " + adapter.getSecret());
            System.out.println("  " + ConfigureParameters.Timeout + ": " + adapter.getTimeout().toMillis());
            System.out.println("  " + ConfigureParameters.MaximumTimeout + ": " + adapter.getMaximumTimeout().toMillis());
            System.out.println("  " + ConfigureParameters.NumberOfRetries + ": " + adapter.getNumberOfRetries());
            System.out.println();
        }
    }

    /**
     * Gets the specified parameter value from the user without providing an example.
     *
     * @param parameter The parameter we want to get from the user.
     * @param adapter   The storage adapter type we are configuring.
     * @return The user-specified parameter value.
     */
    private static String getParameterValueFromUser(
            final String parameter,
            final String adapter) {
        return getParameterValueFromUser(parameter, adapter, null);
    }

    /**
     * Gets the specified parameter value from the user.
     *
     * @param parameter The parameter we want to get from the user.
     * @param adapter   The storage adapter type we are configuring.
     * @param example   An example of how the parameter value should look like.
     * @return The user-specified parameter value.
     */
    private static String getParameterValueFromUser(
            final String parameter,
            final String adapter,
            final String example) {
        if (example == null) {
            System.out.println("\nEnter a " + parameter.toString() + " for the " + adapter + ".");
        } else {
            System.out.println("\nEnter a " + parameter.toString() + " for the " + adapter + ". (Ex. \"" + example + "\")");
        }
        String value;
        while (true) {
            // Get the user's input.
            value = SCANNER.nextLine().trim();
            if (StringUtils.isNullOrTrimEmpty(value)) {
                System.out.println("\nA " + parameter.toString() + " must be provided.");
            } else {
                break;
            }
        }
        return value;
    }

    /**
     * Asks the user whether optional parameters should be configured.
     *
     * @param adapter The storage adapter type we are configuring.
     * @return A boolean denoting whether optional parameters should be configured.
     */
    private static boolean configureOptionalParameters(final String adapter) {
        System.out.println("\nThe " + adapter + " has optional parameters. Would you like to configure them? (yes/no)");
        String input;
        while (true) {
            // Get the user's input.
            input = SCANNER.nextLine().trim();
            if (!StringUtils.isNullOrTrimEmpty(input)
                    && ("yes".equals(input)
                    || "no".equals(input))) {
                break;
            }
            System.out.println("\nEnter yes or no.");
        }
        return "yes".equals(input);
    }

    /**
     * Gets the specified optional parameter value from the user without providing an example.
     *
     * @param parameter The optional parameter we want to get from the user.
     * @param adapter   The storage adapter type we are configuring.
     * @return The user-specified optional parameter value.
     */
    private static String getOptionalParameterValueFromUser(
            final String parameter,
            final String adapter) {
        return getOptionalParameterValueFromUser(parameter, adapter, null);
    }

    /**
     * Gets the specified optional parameter value from the user.
     *
     * @param parameter The optional parameter we want to get from the user.
     * @param adapter   The storage adapter type we are configuring.
     * @param example   An example of how the parameter value should look like.
     * @return The user-specified optional parameter value.
     */
    private static String getOptionalParameterValueFromUser(
            final String parameter,
            final String adapter,
            final String example) {
        if (example == null) {
            System.out.println("\nEnter a " + parameter + " for the " + adapter + ", or press [enter] to skip.");
        } else {
            System.out.println("\nEnter a " + parameter + " for the " + adapter + ", or press [enter] to skip. (Ex. \"" + example + "\"). Default is " + example + ".");
        }

        String value;
        while (true) {
            // Get the user's input.
            value = SCANNER.nextLine().trim().replace("\uFEFF", "");
            if (!StringUtils.isNullOrTrimEmpty(value)) {
                // Input must be numeric.
                try {
                    Integer.parseInt(value);
                    break;
                } catch (final Exception e) {
                    System.out.println("\nEnter a numeric value, or press [enter] to skip.");
                }
            } else {
                // This parameter is optional anyways, so it's okay if there's no input.
                return example;
            }

        }
        return value;
    }

    /**
     * Converts the given path to an absolute path.
     *
     * @param path Any kind of path
     * @return absolute path
     */
    private static String convertPathToAbsolutePath(final String path) {
        return FileSystems.getDefault()
                .getPath(path)
                .normalize().toAbsolutePath()
                .toString();
    }

    private enum ConfigureParameters {
        Hostname,
        Root,
        SharedKey,
        Timeout,
        MaximumTimeout,
        NumberOfRetries,
        RootPath,
        Tenant,
        ClientId,
        Secret
    }
}
