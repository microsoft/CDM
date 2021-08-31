# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from enum import Enum


class AzureCloudEndpoint(Enum):
    """
    AzureCloudEndpoint is an utility enum containing URLs for each of the national clouds endpoints,
    as well as the public cloud endpoint
    """

    # Microsoft Azure public cloud. Maps to https://login.microsoftonline.com
    AZURE_PUBLIC = 'https://login.microsoftonline.com/'
    # Microsoft Chinese national cloud. Maps to https://login.chinacloudapi.cn
    AZURE_CHINA = 'https://login.chinacloudapi.cn/'
    # Microsoft German national cloud ("Black Forest"). Maps to https://login.microsoftonline.de
    AZURE_GERMANY = 'https://login.microsoftonline.de/'
    # US Government cloud. Maps to https://login.microsoftonline.us
    AZURE_US_GOVERNMENT = 'https://login.microsoftonline.us/'

