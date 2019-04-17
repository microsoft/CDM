# sales


## Entities

|Name|Description|
|---|---|
|[Competitor](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/Competitor)|Business competing for the sale represented by a lead or opportunity.  |
|[CompetitorAddress](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/CompetitorAddress)|Additional addresses for a competitor. The first two addresses are stored in the competitor object.  |
|[CompetitorProduct](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/CompetitorProduct)|Association between a competitor and a product offered by the competitor.  |
|[CompetitorSalesLiterature](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/CompetitorSalesLiterature)|  |
|[ContactInvoices](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/ContactInvoices)|  |
|[ContactOrders](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/ContactOrders)|  |
|[ContactQuotes](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/ContactQuotes)|  |
|[Discount](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/Discount)|Price reduction made from the list price of a product or service based on the quantity purchased.  |
|[DiscountList](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/DiscountList)|Type of discount specified as either a percentage or an amount.  |
|[Invoice](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/Invoice)|Order that has been billed.  |
|[InvoiceProduct](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/InvoiceProduct)|Line item in an invoice containing detailed billing information for a product.  |
|[LeadCompetitors](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/LeadCompetitors)|  |
|[LeadProduct](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/LeadProduct)|  |
|[Opportunity](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/Opportunity)|Potential revenue-generating event or a sale to an account, which must be tracked through a sales process to completion.  |
|[OpportunityClose](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/OpportunityClose)|Activity that is created automatically when an opportunity is closed, containing information such as the description of the closing and actual revenue.  |
|[OpportunityCompetitors](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/OpportunityCompetitors)|  |
|[OpportunityProduct](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/OpportunityProduct)|Association between an opportunity and a product.  |
|[OpportunityRelationship](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/OpportunityRelationship)|Relationship between an account or contact and an opportunity.  |
|[Order](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/Order)|Quote that has been accepted.  |
|[OrderClose](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/OrderClose)|Activity generated automatically when an order is closed.  |
|[OrderProduct](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/OrderProduct)|Line item in a sales order.  |
|[PriceListItem](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/PriceListItem)|Information about how to price a product in the specified price level, including pricing method, rounding option, and discount type based on a specified product unit.  |
|[ProductSalesLiterature](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/ProductSalesLiterature)|  |
|[PropertyInstance](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/PropertyInstance)|Instance of a property with its value.  |
|[Quote](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/Quote)|Formal offer for products and/or services, proposed at specific prices and related payment terms, which is sent to a prospective customer.  |
|[QuoteClose](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/QuoteClose)|Activity generated when a quote is closed.  |
|[QuoteProduct](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/QuoteProduct)|Product line item in a quote. The details include such information as product ID, description, quantity, and cost.  |
|[SalesAttachment](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/SalesAttachment)|Item in the sales literature collection.  |
|[SalesLiterature](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/sales/SalesLiterature)|Storage of sales literature, which may contain one or more documents.  |
