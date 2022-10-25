// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Samples
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Text;
    using System.Threading.Tasks;

    [TestClass]
    public class ConfigureAdaptersTests
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private readonly string testsSubpath = "Samples";

        [TestInitialize]
        public void CheckSampleRunTestsFlag()
        {
            if (Environment.GetEnvironmentVariable("SAMPLE_RUNTESTS") != "1")
            {
                // this will cause tests to appear as "Skipped" in the final result
                Assert.Inconclusive("SAMPLE_RUNTESTS environment variable not set.");
            }
        }

        [TestMethod]
        public void TestConfigureAdapters()
        {
            TestHelper.DeleteFilesFromActualOutput(TestHelper.GetActualOutputFolderPath(testsSubpath, nameof(TestConfigureAdapters)));

            var testInputPath = Path.Combine(TestHelper.GetInputFolderPath(testsSubpath, nameof(TestConfigureAdapters)), "input.txt");
            var testActualOutputPath = Path.Combine(TestHelper.GetActualOutputFolderPath(testsSubpath, nameof(TestConfigureAdapters)), "output.txt");

            using (var reader = new StreamReader(testInputPath, Encoding.UTF8))
            {
                using (var writer = new StreamWriter(testActualOutputPath, false, Encoding.UTF8))
                {
                    Console.SetIn(reader);
                    Console.SetOut(writer);

                    ConfigureAdapters();
                }
            }

            TestHelper.AssertFileContentEquality(
                File.ReadAllText(Path.Combine(TestHelper.GetExpectedOutputFolderPath(testsSubpath, nameof(TestConfigureAdapters)), "output.txt")),
                File.ReadAllText(testActualOutputPath));
        }

        private void ConfigureAdapters()
        {
            while (true)
            {
                Console.WriteLine("List of storage adapters:");
                Console.WriteLine("  1: LocalAdapter");
                Console.WriteLine("  2: CdmStandardsAdapter");
                Console.WriteLine("  3: RemoteAdapter");
                Console.WriteLine("  4: ADLSAdapter");
                Console.WriteLine("Pick a number to configure that storage adapter or press [enter] to exit.");

                // Get the user's input.
                string input = Console.ReadLine();
                if (input == null || input == "")
                    break;

                // Make sure the input is a number.
                int choice = 0;
                if (int.TryParse(input, out choice))
                {
                    switch (choice)
                    {
                        // Local adapter.
                        case 1:
                            ConfigureLocalAdapter();
                            break;
                        // CDM Standards adapter.
                        case 2:
                            ConfigureCdmStandardsAdapter();
                            break;
                        // Remote adapter.
                        case 3:
                            ConfigureRemoteAdapter();
                            break;
                        // ADLS adapter.
                        case 4:
                            ConfigureADLSAdapter();
                            break;
                        default:
                            Console.WriteLine("\nEnter a number between 1-3.");
                            break;
                    }
                }
                else
                {
                    Console.WriteLine("\nEnter a number.");
                }
            }
        }

        static void ConfigureLocalAdapter()
        {
            string root = GetParameterValueFromUser("root path", "LocalAdapter", "../../../../../../example-public-standards" /* this is just to show what the value should look like. */);

            // Create a local adapter with the parameter values given by the user.
            // Note: You can also configure an adapter for a network drive (file system on a different machine instead of local fs) 
            // using the local adapter. Just point the local adapter root to the network drive.
            var adapter = new LocalAdapter(root);

            // List the newly configured adapter's properties.
            Console.WriteLine("\nLocalAdapter configured. Properties of this LocalAdapter are:");
            Console.WriteLine("  Root: " + adapter.Root);
            Console.WriteLine();
        }

        // The CDM Standards adapter is configured to point to a CDN endpoint from where the standards schemas can be reliably fetched.
        static void ConfigureCdmStandardsAdapter()
        {
            // Default values for the optional parameters used by the CDM standards adapter.
            string timeout = "2000";
            string maximumTimeout = "10000";
            string numberOfRetries = "2";

            // Ask the user if optional parameters should be configured, or if defaults should just be used.
            if (ConfigureOptionalParameters("CdmStandardsAdapter"))
            {
                // Configure optional parameters.
                timeout = GetOptionalParameterValueFromUser("timeout", "CdmStandardsAdapter", timeout /* this is just to show what the value should look like. */);
                maximumTimeout = GetOptionalParameterValueFromUser("maximum timeout", "CdmStandardsAdapter", maximumTimeout);
                numberOfRetries = GetOptionalParameterValueFromUser("number of retries", "CdmStandardsAdapter", numberOfRetries);
            }

            // Create a CDM Standards adapter with the parameter values given by the user.
            var adapter = new CdmStandardsAdapter()
            {
                Timeout = TimeSpan.FromMilliseconds(int.Parse(timeout)),
                MaximumTimeout = TimeSpan.FromMilliseconds(int.Parse(maximumTimeout)),
                NumberOfRetries = int.Parse(numberOfRetries)
                // WaitTimeCallback is another optional parameter and can also be configured here.
            };

            // List the newly configured adapter's properties.
            Console.WriteLine("\nCdmStandardsAdapter configured. Properties of this CdmStandardsAdapter are:");
            Console.WriteLine("  Timeout: " + adapter.Timeout.Value.TotalMilliseconds);
            Console.WriteLine("  MaximumTimeout: " + adapter.MaximumTimeout.Value.TotalMilliseconds);
            Console.WriteLine("  NumberOfRetries: " + adapter.NumberOfRetries);
            Console.WriteLine();
        }

        static void ConfigureRemoteAdapter()
        {
            // Get the list of hosts from the user.
            Dictionary<string, string> hosts = new Dictionary<string, string>();
            Console.WriteLine("The RemoteAdapter contains a dictionary of hosts. The mapping is from a key to a host. (Ex. { \"contoso\": \"http://contoso.com\" })");
            // The RemoteAdapter can have multiple hosts, so keep asking for values until the user is done.
            while (true)
            {
                Console.WriteLine("Enter the key for the host, or press [enter] if you're done adding hosts. (Ex. \"contoso\").");
                string key = Console.ReadLine().Trim();
                if (string.IsNullOrWhiteSpace(key))
                {
                    // The user doesn't have any more hosts to add.
                    break;
                }

                Console.WriteLine("Enter the host. (Ex. \"http://contoso.com\").");
                string path;
                while (true)
                {
                    path = Console.ReadLine().Trim();
                    if (string.IsNullOrWhiteSpace(path))
                    {
                        Console.WriteLine("Enter the host.");
                    }
                    else
                    {
                        break;
                    }
                }
                hosts.Add(key, path);
            }

            // Default values for the optional parameters used by the remote adapter.
            string timeout = "2000";
            string maximumTimeout = "10000";
            string numberOfRetries = "2";

            // Ask the user if optional parameters should be configured, or if defaults should just be used.
            if (ConfigureOptionalParameters("RemoteAdapter"))
            {
                // Configure optional parameters.
                timeout = GetOptionalParameterValueFromUser("timeout", "RemoteAdapter", timeout /* this is just to show what the value should look like. */);
                maximumTimeout = GetOptionalParameterValueFromUser("maximum timeout", "RemoteAdapter", maximumTimeout);
                numberOfRetries = GetOptionalParameterValueFromUser("number of retries", "RemoteAdapter", numberOfRetries);
            }

            // Create a remote adapter with the values given by the user.
            var adapter = new RemoteAdapter()
            {
                Timeout = TimeSpan.FromMilliseconds(int.Parse(timeout)),
                MaximumTimeout = TimeSpan.FromMilliseconds(int.Parse(maximumTimeout)),
                NumberOfRetries = int.Parse(numberOfRetries),
                Hosts = hosts
                // WaitTimeCallback is another optional parameter and can also be configured here.
            };

            // List the newly configured adapter's properties.
            Console.WriteLine("\nRemoteAdapter configured. Properties of this RemoteAdapter are:");
            // Print the key-value pair for the hosts.
            Console.WriteLine("  Hosts: ");
            foreach (KeyValuePair<string, string> pair in adapter.Hosts)
            {
                Console.WriteLine($"    {{ \"{pair.Key}\": \"{pair.Value}\" }}");
            }
            Console.WriteLine("  Timeout: " + adapter.Timeout.Value.TotalMilliseconds);
            Console.WriteLine("  MaximumTimeout: " + adapter.MaximumTimeout.Value.TotalMilliseconds);
            Console.WriteLine("  NumberOfRetries: " + adapter.NumberOfRetries);
            Console.WriteLine();
        }

        static void ConfigureADLSAdapter()
        {
            Console.WriteLine("\nEnter 1 to configure the ADLSAdapter through a shared key authentication. Enter 2 to configure through a token authentication.");
            int choice = 1;
            while (true)
            {
                // Get the user's input.
                string input = Console.ReadLine().Trim();
                if (!string.IsNullOrWhiteSpace(input))
                {
                    if (int.TryParse(input, out choice) && (choice == 1 || choice == 2))
                    {
                        break;
                    }
                }
                Console.WriteLine("\nEnter 1 or 2.");
            }

            // Shared key authentication selected.
            if (choice == 1)
            {
                string hostname = GetParameterValueFromUser("hostname", "ADLSAdapter", "test.dfs.core.windows.net" /* this is just to show what the value should look like. */);
                string root = GetParameterValueFromUser("root", "ADLSAdapter", "../../../../../../example-public-standards");
                // DEV-NOTE: This is just a mock shared key used to demonstrate what a shared key should look like. It is not a real shared key. 
                string sharedKey = GetParameterValueFromUser("shared key", "ADLSAdapter", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

                // Default values for the optional parameters used by the ADLS adapter.
                string timeout = "2000";
                string maximumTimeout = "10000";
                string numberOfRetries = "2";

                // Ask the user if optional parameters should be configured, or if defaults should just be used.
                if (ConfigureOptionalParameters("ADLSAdapter"))
                {
                    timeout = GetOptionalParameterValueFromUser("timeout", "ADLSAdapter", timeout /* this is just to show what the value should look like. */);
                    maximumTimeout = GetOptionalParameterValueFromUser("maximum timeout", "ADLSAdapter", maximumTimeout);
                    numberOfRetries = GetOptionalParameterValueFromUser("number of retries", "ADLSAdapter", numberOfRetries);
                }

                // Create an ADLS adapter with the parameter values given by the user.
                var adapter = new ADLSAdapter(hostname, root, sharedKey)
                {
                    Timeout = TimeSpan.FromMilliseconds(int.Parse(timeout)),
                    MaximumTimeout = TimeSpan.FromMilliseconds(int.Parse(maximumTimeout)),
                    NumberOfRetries = int.Parse(numberOfRetries)
                    // WaitTimeCallback is another optional parameter and can also be configured here.
                };

                // List the newly configured adapter's properties.
                Console.WriteLine("\nADLSAdapter configured. Properties of this ADLSAdapter are:");
                Console.WriteLine($"  {nameof(adapter.Hostname)}: " + adapter.Hostname);
                Console.WriteLine("  Root: " + adapter.Root);
                Console.WriteLine("  SharedKey: " + adapter.SharedKey);
                Console.WriteLine("  Timeout: " + adapter.Timeout.Value.TotalMilliseconds);
                Console.WriteLine("  MaximumTimeout: " + adapter.MaximumTimeout.Value.TotalMilliseconds);
                Console.WriteLine("  NumberOfRetries: " + adapter.NumberOfRetries);
                Console.WriteLine();
            }
            // Token (clientId/secret) authentication selected.
            else
            {
                string hostname = GetParameterValueFromUser("hostname", "ADLSAdapter", "test.dfs.core.windows.net" /* this is just to show what the value should look like. */);
                string root = GetParameterValueFromUser("root path", "ADLSAdapter", "../../../../../../example-public-standards");
                string tenant = GetParameterValueFromUser("tenant", "ADLSAdapter", "00x000xx-00x0-00xx-00xx-0x0xx000xx00");
                string clientId = GetParameterValueFromUser("client ID", "ADLSAdapter", "xxx00x0x-0x00-0000-x0x0-00xxx000xxx0");
                // DEV-NOTE: This is just a mock secret used to demonstrate what a secret should look like. It is not a real secret. 
                string secret = GetParameterValueFromUser("secret", "ADLSAdapter", "dummySecret");

                // Default values for the optional parameters used by the ADLS adapter.
                string timeout = "2000";
                string maximumTimeout = "10000";
                string numberOfRetries = "2";

                // Ask the user if optional parameters should be configured, or if defaults should just be used.
                if (ConfigureOptionalParameters("ADLSAdapter"))
                {
                    timeout = GetOptionalParameterValueFromUser("timeout", "ADLSAdapter", timeout /* this is just to show what the value should look like. */);
                    maximumTimeout = GetOptionalParameterValueFromUser("maximum timeout", "ADLSAdapter", maximumTimeout);
                    numberOfRetries = GetOptionalParameterValueFromUser("number of retries", "ADLSAdapter", numberOfRetries);
                }

                // Create an ADLS adapter with the parameter values given by the user.
                var adapter = new ADLSAdapter(hostname, root, tenant, clientId, secret)
                {
                    Timeout = TimeSpan.FromMilliseconds(int.Parse(timeout)),
                    MaximumTimeout = TimeSpan.FromMilliseconds(int.Parse(maximumTimeout)),
                    NumberOfRetries = int.Parse(numberOfRetries)
                    // WaitTimeCallback is another optional parameter and can also be configured here.
                };

                // List the newly configured adapter's properties.
                Console.WriteLine("\nADLSAdapter configured. Properties of this ADLSAdapter are:");
                Console.WriteLine("  Hostname: " + adapter.Hostname);
                Console.WriteLine("  Root: " + adapter.Root);
                Console.WriteLine("  Tenant: " + adapter.Tenant);
                Console.WriteLine("  ClientId: " + adapter.ClientId);
                Console.WriteLine("  Secret: " + adapter.Secret);
                Console.WriteLine("  Timeout: " + adapter.Timeout.Value.TotalMilliseconds);
                Console.WriteLine("  MaximumTimeout: " + adapter.MaximumTimeout.Value.TotalMilliseconds);
                Console.WriteLine("  NumberOfRetries: " + adapter.NumberOfRetries);
                Console.WriteLine();
            }
        }

        /// <summary>
        /// Gets the specified parameter value from the user.
        /// </summary>
        /// <param name="parameter">The parameter we want to get from the user.</param>
        /// <param name="adapter">The storage adapter type we are configuring.</param>
        /// <param name="example">An example of how the parameter value should look like.</param>
        /// <returns>The user-specified parameter value.</returns>
        static string GetParameterValueFromUser(string parameter, string adapter, string example = null)
        {
            if (example == null)
            {
                Console.WriteLine($"\nEnter a {parameter} for the {adapter}.");
            }
            else
            {
                Console.WriteLine($"\nEnter a {parameter} for the {adapter}. (Ex. \"{example}\")");
            }
            string value = null;
            while (true)
            {
                // Get the user's input.
                value = Console.ReadLine().Trim();
                if (string.IsNullOrWhiteSpace(value))
                {
                    Console.WriteLine($"\nA {parameter} must be provided.");
                }
                else
                {
                    break;
                }
            }
            return value;
        }

        /// <summary>
        /// Asks the user whether optional parameters should be configured.
        /// </summary>
        /// <param name="adapter">The storage adapter type we are configuring.</param>
        /// <returns>A boolean denoting whether optional parameters should be configured.</returns>
        static bool ConfigureOptionalParameters(string adapter)
        {
            Console.WriteLine($"\nThe {adapter} has optional parameters. Would you like to configure them? (yes/no)");
            string input = null;
            while (true)
            {
                // Get the user's input.
                input = Console.ReadLine().Trim();
                if (!string.IsNullOrWhiteSpace(input) && (input == "yes" || input == "no"))
                {
                    break;
                }
                Console.WriteLine("\nEnter yes or no.");
            }
            if (input == "yes")
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// Gets the specified optional parameter value from the user.
        /// </summary>
        /// <param name="parameter">The optional parameter we want to get from the user.</param>
        /// <param name="adapter">The storage adapter type we are configuring.</param>
        /// <param name="example">An example of how the parameter value should look like.</param>
        /// <returns>The user-specified optional parameter value.</returns>
        static string GetOptionalParameterValueFromUser(string parameter, string adapter, string example = null)
        {
            if (example == null)
            {
                Console.WriteLine($"\nEnter a {parameter} for the {adapter}, or press [enter] to skip.");
            }
            else
            {
                Console.WriteLine($"\nEnter a {parameter} for the {adapter}, or press [enter] to skip. (Ex. \"{example}\"). Default is {example}.");
            }

            string value = null;
            while (true)
            {
                // Get the user's input.
                value = Console.ReadLine().Trim();

                if (!string.IsNullOrWhiteSpace(value))
                {
                    // Input must be numeric.
                    int num = 0;
                    if (int.TryParse(value, out num))
                    {
                        break;
                    }
                    else
                    {
                        Console.WriteLine("\nEnter a numeric value, or press [enter] to skip.");
                    }
                }
                else
                {
                    // This parameter is optional anyways, so it's okay if there's no input. 
                    return example;
                }
            }
            return value;
        }
    }
}
