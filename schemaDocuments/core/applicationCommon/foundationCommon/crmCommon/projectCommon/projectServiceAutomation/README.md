
# projectServiceAutomation

CDM standard entities  

## Entities

|Name|Description|
|---|---|
|[Account](Account.cdm.json)|Business that represents a customer or potential customer. The company that is billed in business transactions.|
|[AccountPriceList](AccountPriceList.cdm.json)|Sales price list for this customer to capture special pricing agreements for products, roles and categories.|
|[ActualDataExport](ActualDataExport.cdm.json)|Data export entity for the actual entity.|
|[BatchJob](BatchJob.cdm.json)|Placeholder for workflows used for machine learning scenarios.|
|[BookableResourceCategory](BookableResourceCategory.cdm.json)|Categorize resources that have capacity into categories such as roles.|
|[BookableResourceCategoryAssn](BookableResourceCategoryAssn.cdm.json)|Association entity to model the categorization of resources.|
|[BookableResourceCharacteristic](BookableResourceCharacteristic.cdm.json)|Associates resources with their characteristics and specifies the proficiency level of a resource for that characteristic.|
|[Characteristic](Characteristic.cdm.json)|Skills, education and certifications of resources.|
|[ContactPriceList](ContactPriceList.cdm.json)|Specific sales price list for this customer to capture special pricing agreements for products, roles, and categories.|
|[ContractLineInvoiceSchedule](ContractLineInvoiceSchedule.cdm.json)|List of dates that shows when invoicing for this customer should be run. This list is used by the invoice creation job.|
|[ContractLineScheduleOfValue](ContractLineScheduleOfValue.cdm.json)|List of billing milestones and invoice amounts for this project contract line.|
|[Delegation](Delegation.cdm.json)|Delegation of time, expense entities among users|
|[Estimate](Estimate.cdm.json)|Labor, cost, and revenue estimates for a project.|
|[EstimateLine](EstimateLine.cdm.json)|Estimates on a per day timescale.|
|[Expense](Expense.cdm.json)|Main container that holds expense information.|
|[ExpenseCategory](ExpenseCategory.cdm.json)|Main container that holds expense category information.|
|[ExpenseReceipt](ExpenseReceipt.cdm.json)|Table that contains expense receipt information.|
|[Fact](Fact.cdm.json)|Aggregated fact entity for actual transactions.|
|[FieldComputation](FieldComputation.cdm.json)|Product properties whose values are to be considered as factors for quantity computation on a transaction line.|
|[FindWorkEvent](FindWorkEvent.cdm.json)|Entity used for counting the number of times resources apply for open positions and other behavioral attributes of resources.|
|[IntegrationJob](IntegrationJob.cdm.json)|Staging table for integration data|
|[IntegrationJobDetail](IntegrationJobDetail.cdm.json)|Staging table for integration data lines|
|[Invoice](Invoice.cdm.json)|Order that has been billed.|
|[InvoiceFrequency](InvoiceFrequency.cdm.json)|Setup entity for invoice schedules.|
|[InvoiceFrequencyDetail](InvoiceFrequencyDetail.cdm.json)|List of days expressed as dates or day of week for a specific invoice schedule template.|
|[InvoiceLineTransaction](InvoiceLineTransaction.cdm.json)|Transactions that are associated to an invoice line.|
|[InvoiceProduct](InvoiceProduct.cdm.json)|Line item in an invoice containing detailed billing information for a product.|
|[Journal](Journal.cdm.json)|Unposted business transactions, for example, time and expense.|
|[JournalLine](JournalLine.cdm.json)|Unposted business transaction line details.|
|[Opportunity](Opportunity.cdm.json)|Potential revenue-generating event, or sale to an account, which needs to be tracked through a sales process to completion.|
|[OpportunityLineResourceCategory](OpportunityLineResourceCategory.cdm.json)|List of roles that will be considered as costs when understanding the profit of an opportunity line (Deprecated in v3.0)|
|[OpportunityLineTransaction](OpportunityLineTransaction.cdm.json)|Sales estimate detail of an opportunity line (Deprecated in v3.0)|
|[OpportunityLineTransactionCategory](OpportunityLineTransactionCategory.cdm.json)|List of transaction categories that will be considered as costs when computing the profit of an opportunity line (Deprecated in v3.0)|
|[OpportunityLineTransactionClassification](OpportunityLineTransactionClassification.cdm.json)|List of transaction classification heads, which are four broad cost categories of time, expense, material, and fee, that will be considered as costs when computing the profit of an opportunity line (Deprecated in v3.0)|
|[OpportunityPriceList](OpportunityPriceList.cdm.json)|Sales price list that will used by the opportunity to set default sales prices on all project-based components such as time and expense.|
|[OpportunityProduct](OpportunityProduct.cdm.json)|Association between an opportunity and a product.|
|[Order](Order.cdm.json)|Quote that has been accepted.|
|[OrderLineResourceCategory](OrderLineResourceCategory.cdm.json)|List of roles that will be considered as costs when computing the profit of a project contract line.|
|[OrderLineTransaction](OrderLineTransaction.cdm.json)|Sales estimate detail of an project contract line.|
|[OrderLineTransactionCategory](OrderLineTransactionCategory.cdm.json)|List of transaction categories that will be considered as costs when computing the profit of a project contract line.|
|[OrderLineTransactionClassification](OrderLineTransactionClassification.cdm.json)|List of transaction classification heads, which are four broad cost categories of time, expense, material, and fee, that will be considered as costs when computing the profit of a project contract line.|
|[OrderPriceList](OrderPriceList.cdm.json)|Sales price list used on the contract to set default sales prices on all project-based components such as time and expense.|
|[OrderProduct](OrderProduct.cdm.json)|Line item in a sales order.|
|[PriceList](PriceList.cdm.json)|Entity that defines pricing levels.|
|[PricingDimension](PricingDimension.cdm.json)||
|[PricingDimensionFieldName](PricingDimensionFieldName.cdm.json)|Provides ability to override the field name for pricing dimension if the entity doesn't follow the same naming convention for the pricing dimension field as the price entity.|
|[ProcessNotes](ProcessNotes.cdm.json)|Stores messages or notes relevant to an operation or process executed by an entity.|
|[Product](Product.cdm.json)|Information about products and their pricing information.|
|[Project](Project.cdm.json)|Delivery entity in an engagement.|
|[ProjectApproval](ProjectApproval.cdm.json)||
|[ProjectParameter](ProjectParameter.cdm.json)|List of settings that determine the behavior of the project-based service solution.|
|[ProjectParameterPriceList](ProjectParameterPriceList.cdm.json)|Set of default cost and sales price lists that the company uses when there are no specific pricing agreements for cost and sales.|
|[ProjectPriceList](ProjectPriceList.cdm.json)||
|[ProjectServiceApproval](ProjectServiceApproval.cdm.json)|Container for approvals.|
|[ProjectTask](ProjectTask.cdm.json)|Tasks related to project.|
|[ProjectTaskDependency](ProjectTaskDependency.cdm.json)|Dependency data between tasks.|
|[ProjectTaskStatusUser](ProjectTaskStatusUser.cdm.json)|User status for project tasks (Deprecated in v3.0).|
|[ProjectTeam](ProjectTeam.cdm.json)|Entity used to model relationship between resources and project teams.|
|[ProjectTeamMemberSignUp](ProjectTeamMemberSignUp.cdm.json)|Entity used to capture all resources that have applied for open position on projects.|
|[ProjectTransactionCategory](ProjectTransactionCategory.cdm.json)|(Deprecated in v3.0)|
|[Quote](Quote.cdm.json)|Formal offer for products and/or services, proposed at specific prices and related payment terms, which is sent to a prospective customer.|
|[QuoteLineAnalyticsBreakdown](QuoteLineAnalyticsBreakdown.cdm.json)|Reporting entity that is used to show quoted sales and estimated cost amounts by various dimensions.|
|[QuoteLineInvoiceSchedule](QuoteLineInvoiceSchedule.cdm.json)|List of dates on which invoicing for this customer should be run. This list is used by an invoice creation job.|
|[QuoteLineResourceCategory](QuoteLineResourceCategory.cdm.json)|List of roles that will be considered as costs when understanding the profit of a quote line.|
|[QuoteLineScheduleOfValue](QuoteLineScheduleOfValue.cdm.json)|List of billing milestones and invoice amounts for this quote line.|
|[QuoteLineTransaction](QuoteLineTransaction.cdm.json)|Sales estimate detail of a quote line.|
|[QuoteLineTransactionCategory](QuoteLineTransactionCategory.cdm.json)|List of transaction categories that will be considered as costs when computing the profit of a quote line.|
|[QuoteLineTransactionClassification](QuoteLineTransactionClassification.cdm.json)|List of transaction classification heads, the four broad cost classifications of time, expense, material, and fee, that will be considered as costs when computing the profit of a quote line.|
|[QuotePriceList](QuotePriceList.cdm.json)|Sales price list that will used by the quote to default sales prices on all project-based components such as time and expense.|
|[QuoteProduct](QuoteProduct.cdm.json)|Product line item in a quote. The details include such information as product ID, description, quantity, and cost.|
|[RatingModel](RatingModel.cdm.json)|Represents a model to evaluate skills or other related entities.|
|[ResourceAssignment](ResourceAssignment.cdm.json)|Entity used to keep track of resource assignment header information  on tasks.|
|[ResourceAssignmentDetail](ResourceAssignmentDetail.cdm.json)|Entity used to keep track of resource assignment details on tasks.|
|[ResourceCategoryPriceLevel](ResourceCategoryPriceLevel.cdm.json)|List of prices by role on a price list.|
|[ResourceRequest](ResourceRequest.cdm.json)|Entity that wraps the resource requirement to capture the type of resources, skills, and location required.|
|[ResultCache](ResultCache.cdm.json)|Cache for scored work items per resource that are returned from Azure Machine Learning.|
|[RoleCompetencyRequirement](RoleCompetencyRequirement.cdm.json)|Entity used  to associate skills in a role.|
|[RolePriceMarkup](RolePriceMarkup.cdm.json)|List of markups for prices by role on a price list.|
|[RoleUtilization](RoleUtilization.cdm.json)|Gathers data about utilization per role to display in a chart|
|[TimeEntry](TimeEntry.cdm.json)|Entity used  for time entry.|
|[TimeOffCalendar](TimeOffCalendar.cdm.json)|Relationship table for time off calendar entries.|
|[TransactionCategory](TransactionCategory.cdm.json)|Business transaction categories to classify costs and revenue.|
|[TransactionCategoryClassification](TransactionCategoryClassification.cdm.json)|Entity used to associate a category broadly as time, expense or material.|
|[TransactionCategoryHierarchyElement](TransactionCategoryHierarchyElement.cdm.json)|Hierarchical relationship of the transaction category with a root node.|
|[TransactionCategoryPriceLevel](TransactionCategoryPriceLevel.cdm.json)|List of prices by category on a price list.|
|[TransactionConnection](TransactionConnection.cdm.json)|System entity used to establish connections between the cost, unbilled revenue, and billed revenue components of a transaction as they happen.|
|[TransactionType](TransactionType.cdm.json)|Broad classification, such as time or expense, and the context such cost, unbilled revenue, or billed revenue of a project actual.|
|[UserWorkHistory](UserWorkHistory.cdm.json)|Entity used to look up resources based on demonstrated skills.|
