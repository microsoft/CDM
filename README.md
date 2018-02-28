# Common Data Model (CDM) Schema

The Common Data Model is a library of entities to represent commonly used objects and activities across business and productivity applications. CDM provides well-defined, modular, and extensible business entities, such as Account, Business Unit, Case, Contact, Lead, Opportunity, Product, Purchase Order, and customer interactions such as lead follow-ups, support calls, etc. Anyone can build on and extend CDM definitions to capture additional business-specific ideas.

# Introduction

The Common Data Model standard defines a common language for business entities covering customer relationship management (CRM), marketing, product services, and will expand to enterprise resource planning (ERP) and other areas over time. The goal of CDM is to enable data interoperability spanning multiple channels, service implementations, and vendors.

CDM is undergoing a specification effort driven by Microsoft. The documents published here are a preview, and iterated on.

# Repository Layout

There are two primary ways to consume the information in this repository

1. Entity Reference Index
2. [Visual Entity Browser](schemaDocuments/readme.md) for visually navigating entities, entity inheritance, attributes, and entity relationships

# Versioning

Maintaining forward and backwards compatibility is a key goal of CDM. Therefore, CDM uses purely additive versioning, which means any revision of the CDM following an initial 1.0 release will not:

* introduce new mandatory properties on existing entities
* rename existing properties
* remove previously defined properties
* remove or restrict previously supported property values

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

# Legal Notices

Microsoft and any contributors grant you a license to the Microsoft documentation and other content
in this repository under the [Creative Commons Attribution 4.0 International Public License](https://creativecommons.org/licenses/by/4.0/legalcode),
see the [LICENSE](LICENSE) file, and grant you a license to any code in the repository under the [MIT License](https://opensource.org/licenses/MIT), see the
[LICENSE-CODE](LICENSE-CODE) file.

Microsoft, Windows, Microsoft Azure and/or other Microsoft products and services referenced in the documentation
may be either trademarks or registered trademarks of Microsoft in the United States and/or other countries.
The licenses for this project do not grant you rights to use any Microsoft names, logos, or trademarks.
Microsoft's general trademark guidelines can be found at http://go.microsoft.com/fwlink/?LinkID=254653.

Privacy information can be found at https://privacy.microsoft.com/en-us/

Microsoft and any contributors reserve all others rights, whether under their respective copyrights, patents,
or trademarks, whether by implication, estoppel or otherwise.
