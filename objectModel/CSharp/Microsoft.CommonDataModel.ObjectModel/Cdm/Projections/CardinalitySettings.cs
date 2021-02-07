// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;

    /// <summary>
    /// Class for attribute cardinality
    /// </summary>
    public class CardinalitySettings
    {
        // By default all attributes in CDM are Not Nullable and hence setting the default value to be 1:1
        private const int DefaultMinimum = 1;
        private const int DefaultMaximum = 1;
        private const int InfiniteMaximum = -1;

        private CdmCorpusContext Ctx;
        private CdmAttribute Owner;

        /// <summary>
        /// CardinalitySettings constructor
        /// </summary>
        public CardinalitySettings(CdmAttribute owner)
        {
            Owner = owner;
            Ctx = owner?.Ctx;
        }

        private int _minimumNumber = DefaultMinimum;
        internal int _MinimumNumber
        {
            get { return _minimumNumber; }
            set { _minimumNumber = value; }
        }

        private int _maximumNumber = DefaultMaximum;
        internal int _MaximumNumber
        {
            get { return _maximumNumber; }
            set { _maximumNumber = value; }
        }

        private string _Minimum { get; set; }

        private string _Maximum { get; set; }

        /// <summary>
        /// Minimum cardinality (range -->> "0" .. "n")
        /// </summary>
        public string Minimum
        {
            get
            {
                return _Minimum;
            }
            set
            {
                if (!CardinalitySettings.IsMinimumValid(value))
                {
                    Logger.Error(nameof(CardinalitySettings), this.Ctx, $"Invalid minimum cardinality {value}.");
                }
                else
                {
                    _Minimum = value;
                    _MinimumNumber = GetNumber(_Minimum, DefaultMinimum);

                    // In the case of type attributes, a '0' minimum cardinality represents a nullable attribute
                    if (Owner != null && Owner is CdmTypeAttributeDefinition)
                    {
                        (Owner as CdmTypeAttributeDefinition).IsNullable = (_MinimumNumber == 0);
                    }
                }
            }
        }

        /// <summary>
        /// Maximum cardinality (range -->> "1" .. "*")
        /// </summary>
        public string Maximum
        {
            get
            {
                return _Maximum;
            }
            set
            {
                if (!CardinalitySettings.IsMaximumValid(value))
                {
                    Logger.Error(nameof(CardinalitySettings), this.Ctx, $"Invalid maximum cardinality {value}.");
                }
                else
                {
                    _Maximum = value;
                    _MaximumNumber = GetNumber(_Maximum, DefaultMaximum);
                }
            }
        }

        /// <summary>
        /// Converts the string cardinality to number
        /// </summary>
        /// <param name="value"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        private int GetNumber(string value, int defaultValue)
        {
            if (StringUtils.EqualsWithIgnoreCase(value, "*"))
            {
                return InfiniteMaximum;
            }

            int number;
            bool success = int.TryParse(value, out number);

            if (!success)
            {
                Logger.Error(nameof(CardinalitySettings), this.Ctx, $"Unable to get number for string '{value}'. Falling to default value ${defaultValue}.");
            }

            // defaults to min:max DefaultMinimum:DefaultMaximum in the invalid values
            return (success) ? number : defaultValue;
        }

        /// <summary>
        /// Validate if the minimum cardinality is valid
        /// Min Cardinality valid options are as follows -- '0'..Int.MaxValue.ToString()
        /// By default Min Cardinality is '1'
        /// </summary>
        /// <param name="minimum"></param>
        /// <returns></returns>
        internal static bool IsMinimumValid(string minimum)
        {
            if (!string.IsNullOrWhiteSpace(minimum))
            {
                // By default Min Cardinality is 1
                int minNumber;
                // Min Cardinality valid options are as follows -- '0'..Int.MaxValue.ToString()
                if (int.TryParse(minimum, out minNumber))
                {
                    return (minNumber >= 0 && minNumber <= int.MaxValue);
                }
            }
            return false;
        }

        /// <summary>
        /// Validate if the maximum cardinality is valid
        /// Max Cardinality valid options are as follows -- '1'..Int.MaxValue.ToString(), or can be '*' to define Infinity
        /// By default Max Cardinality is '1'
        /// </summary>
        /// <param name="maximum"></param>
        /// <returns></returns>
        internal static bool IsMaximumValid(string maximum)
        {
            if (!string.IsNullOrWhiteSpace(maximum))
            {
                // By default Max Cardinality is 1
                int maxNumber;
                // Max Cardinality can be '*' to define Infinity
                // If not '*', an explicit value can be provided, but is limited to '1'..Int.MaxValue.ToString()
                if (StringUtils.EqualsWithIgnoreCase(maximum, "*"))
                {
                    return true;
                }
                else if (int.TryParse(maximum, out maxNumber))
                {
                    return (maxNumber >= DefaultMaximum && maxNumber <= int.MaxValue);
                }
            }
            return false;
        }
    }
}
