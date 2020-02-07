
# sales


## Entities

|Name|Description|
|---|---|
|[Competitor](Competitor.cdm.json)|Business competing for the sale represented by a lead or opportunity.|
|[CompetitorAddress](CompetitorAddress.cdm.json)|Additional addresses for a competitor. The first two addresses are stored in the competitor object.|
|[CompetitorProduct](CompetitorProduct.cdm.json)|Association between a competitor and a product offered by the competitor.|
|[CompetitorSalesLiterature](CompetitorSalesLiterature.cdm.json)||
|[ContactInvoices](ContactInvoices.cdm.json)||
|[ContactOrders](ContactOrders.cdm.json)||
|[ContactQuotes](ContactQuotes.cdm.json)||
|[Discount](Discount.cdm.json)|Price reduction made from the list price of a product or service based on the quantity purchased.|
|[DiscountList](DiscountList.cdm.json)|Type of discount specified as either a percentage or an amount.|
|[Invoice](Invoice.cdm.json)|Order that has been billed.|
|[InvoiceProduct](InvoiceProduct.cdm.json)|Line item in an invoice containing detailed billing information for a product.|
|[LeadCompetitors](LeadCompetitors.cdm.json)||
|[LeadProduct](LeadProduct.cdm.json)||
|[Opportunity](Opportunity.cdm.json)|Potential revenue-generating event, or sale to an account, which needs to be tracked through a sales process to completion.|
|[OpportunityClose](OpportunityClose.cdm.json)|Activity that is created automatically when an opportunity is closed, containing information such as the description of the closing and actual revenue.|
|[OpportunityCompetitors](OpportunityCompetitors.cdm.json)||
|[OpportunityProduct](OpportunityProduct.cdm.json)|Association between an opportunity and a product.|
|[OpportunityRelationship](OpportunityRelationship.cdm.json)|Relationship between an account or contact and an opportunity.|
|[Order](Order.cdm.json)|Quote that has been accepted.|
|[OrderClose](OrderClose.cdm.json)|Activity generated automatically when an order is closed.|
|[OrderProduct](OrderProduct.cdm.json)|Line item in a sales order.|
|[PriceListItem](PriceListItem.cdm.json)|Information about how to price a product in the specified price level, including pricing method, rounding option, and discount type based on a specified product unit.|
|[ProductSalesLiterature](ProductSalesLiterature.cdm.json)||
|[PropertyInstance](PropertyInstance.cdm.json)|Instance of a property with its value.|
|[Quote](Quote.cdm.json)|Formal offer for products and/or services, proposed at specific prices and related payment terms, which is sent to a prospective customer.|
|[QuoteClose](QuoteClose.cdm.json)|Activity generated when a quote is closed.|
|[QuoteProduct](QuoteProduct.cdm.json)|Product line item in a quote. The details include such information as product ID, description, quantity, and cost.|
|[SalesAttachment](SalesAttachment.cdm.json)|Item in the sales literature collection.|
|[SalesLiterature](SalesLiterature.cdm.json)|Storage of sales literature, which may contain one or more documents.|
