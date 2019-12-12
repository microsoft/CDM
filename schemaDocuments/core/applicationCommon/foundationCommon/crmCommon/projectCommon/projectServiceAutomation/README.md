
# projectServiceAutomation


## Entities

|Name|Description|
|---|---|
|[Account](Account.md)|Business that represents a customer or potential customer. The company that is billed in business transactions.  |
|[AccountPriceList](AccountPriceList.md)|Sales price list for this customer to capture special pricing agreements for products, roles and categories.  |
|[ActualDataExport](ActualDataExport.md)|Data export entity for the actual entity.  |
|[BatchJob](BatchJob.md)|Placeholder for workflows used for machine learning scenarios.  |
|[BookableResourceCategory](BookableResourceCategory.md)|Categorize resources that have capacity into categories such as roles.  |
|[BookableResourceCategoryAssn](BookableResourceCategoryAssn.md)|Association entity to model the categorization of resources.  |
|[BookableResourceCharacteristic](BookableResourceCharacteristic.md)|Associates resources with their characteristics and specifies the proficiency level of a resource for that characteristic.  |
|[Characteristic](Characteristic.md)|Skills, education and certifications of resources.  |
|[ContactPriceList](ContactPriceList.md)|Specific sales price list for this customer to capture special pricing agreements for products, roles, and categories.  |
|[ContractLineInvoiceSchedule](ContractLineInvoiceSchedule.md)|List of dates that shows when invoicing for this customer should be run. This list is used by the invoice creation job.  |
|[ContractLineScheduleOfValue](ContractLineScheduleOfValue.md)|List of billing milestones and invoice amounts for this project contract line.  |
|[Delegation](Delegation.md)|Delegation of time, expense entities among users  |
|[Estimate](Estimate.md)|Labor, cost, and revenue estimates for a project.  |
|[EstimateLine](EstimateLine.md)|Estimates on a per day timescale.  |
|[Expense](Expense.md)|Main container that holds expense information.  |
|[ExpenseCategory](ExpenseCategory.md)|Main container that holds expense category information.  |
|[ExpenseReceipt](ExpenseReceipt.md)|Table that contains expense receipt information.  |
|[Fact](Fact.md)|Aggregated fact entity for actual transactions.  |
|[FieldComputation](FieldComputation.md)|Product properties whose values are to be considered as factors for quantity computation on a transaction line.  |
|[FindWorkEvent](FindWorkEvent.md)|Entity used for counting the number of times resources apply for open positions and other behavioral attributes of resources.  |
|[IntegrationJob](IntegrationJob.md)|Staging table for integration data  |
|[IntegrationJobDetail](IntegrationJobDetail.md)|Staging table for integration data lines  |
|[Invoice](Invoice.md)|Order that has been billed.  |
|[InvoiceFrequency](InvoiceFrequency.md)|Setup entity for invoice schedules.  |
|[InvoiceFrequencyDetail](InvoiceFrequencyDetail.md)|List of days expressed as dates or day of week for a specific invoice schedule template.  |
|[InvoiceLineTransaction](InvoiceLineTransaction.md)|Transactions that are associated to an invoice line.  |
|[InvoiceProduct](InvoiceProduct.md)|Line item in an invoice containing detailed billing information for a product.  |
|[Journal](Journal.md)|Unposted business transactions, for example, time and expense.  |
|[JournalLine](JournalLine.md)|Unposted business transaction line details.  |
|[Opportunity](Opportunity.md)|Potential revenue-generating event, or sale to an account, which needs to be tracked through a sales process to completion.  |
|[OpportunityLineResourceCategory](OpportunityLineResourceCategory.md)|List of roles that will be considered as costs when understanding the profit of an opportunity line (Deprecated in v3.0)  |
|[OpportunityLineTransaction](OpportunityLineTransaction.md)|Sales estimate detail of an opportunity line (Deprecated in v3.0)  |
|[OpportunityLineTransactionCategory](OpportunityLineTransactionCategory.md)|List of transaction categories that will be considered as costs when computing the profit of an opportunity line (Deprecated in v3.0)  |
|[OpportunityLineTransactionClassification](OpportunityLineTransactionClassification.md)|List of transaction classification heads, which are four broad cost categories of time, expense, material, and fee, that will be considered as costs when computing the profit of an opportunity line (Deprecated in v3.0)  |
|[OpportunityPriceList](OpportunityPriceList.md)|Sales price list that will used by the opportunity to set default sales prices on all project-based components such as time and expense.  |
|[OpportunityProduct](OpportunityProduct.md)|Association between an opportunity and a product.  |
|[Order](Order.md)|Quote that has been accepted.  |
|[OrderLineResourceCategory](OrderLineResourceCategory.md)|List of roles that will be considered as costs when computing the profit of a project contract line.  |
|[OrderLineTransaction](OrderLineTransaction.md)|Sales estimate detail of an project contract line.  |
|[OrderLineTransactionCategory](OrderLineTransactionCategory.md)|List of transaction categories that will be considered as costs when computing the profit of a project contract line.  |
|[OrderLineTransactionClassification](OrderLineTransactionClassification.md)|List of transaction classification heads, which are four broad cost categories of time, expense, material, and fee, that will be considered as costs when computing the profit of a project contract line.  |
|[OrderPriceList](OrderPriceList.md)|Sales price list used on the contract to set default sales prices on all project-based components such as time and expense.  |
|[OrderProduct](OrderProduct.md)|Line item in a sales order.  |
|[PriceList](PriceList.md)|Entity that defines pricing levels.  |
|[PricingDimensionFieldName](PricingDimensionFieldName.md)|Provides ability to override the field name for pricing dimension if the entity doesn't follow the same naming convention for the pricing dimension field as the price entity.  |
|[ProcessNotes](ProcessNotes.md)|Stores messages or notes relevant to an operation or process executed by an entity.  |
|[Product](Product.md)|Information about products and their pricing information.  |
|[Project](Project.md)|Delivery entity in an engagement.  |
|[ProjectParameter](ProjectParameter.md)|List of settings that determine the behavior of the project-based service solution.  |
|[ProjectParameterPriceList](ProjectParameterPriceList.md)|Set of default cost and sales price lists that the company uses when there are no specific pricing agreements for cost and sales.  |
|[ProjectServiceApproval](ProjectServiceApproval.md)|Container for approvals.  |
|[ProjectTask](ProjectTask.md)|Tasks related to project.  |
|[ProjectTaskDependency](ProjectTaskDependency.md)|Dependency data between tasks.  |
|[ProjectTaskStatusUser](ProjectTaskStatusUser.md)|User status for project tasks (Deprecated in v3.0).  |
|[ProjectTeam](ProjectTeam.md)|Entity used to model relationship between resources and project teams.  |
|[ProjectTeamMemberSignUp](ProjectTeamMemberSignUp.md)|Entity used to capture all resources that have applied for open position on projects.  |
|[ProjectTransactionCategory](ProjectTransactionCategory.md)|(Deprecated in v3.0)  |
|[Quote](Quote.md)|Formal offer for products and/or services, proposed at specific prices and related payment terms, which is sent to a prospective customer.  |
|[QuoteLineAnalyticsBreakdown](QuoteLineAnalyticsBreakdown.md)|Reporting entity that is used to show quoted sales and estimated cost amounts by various dimensions.  |
|[QuoteLineInvoiceSchedule](QuoteLineInvoiceSchedule.md)|List of dates on which invoicing for this customer should be run. This list is used by an invoice creation job.  |
|[QuoteLineResourceCategory](QuoteLineResourceCategory.md)|List of roles that will be considered as costs when understanding the profit of a quote line.  |
|[QuoteLineScheduleOfValue](QuoteLineScheduleOfValue.md)|List of billing milestones and invoice amounts for this quote line.  |
|[QuoteLineTransaction](QuoteLineTransaction.md)|Sales estimate detail of a quote line.  |
|[QuoteLineTransactionCategory](QuoteLineTransactionCategory.md)|List of transaction categories that will be considered as costs when computing the profit of a quote line.  |
|[QuoteLineTransactionClassification](QuoteLineTransactionClassification.md)|List of transaction classification heads, the four broad cost classifications of time, expense, material, and fee, that will be considered as costs when computing the profit of a quote line.  |
|[QuotePriceList](QuotePriceList.md)|Sales price list that will used by the quote to default sales prices on all project-based components such as time and expense.  |
|[QuoteProduct](QuoteProduct.md)|Product line item in a quote. The details include such information as product ID, description, quantity, and cost.  |
|[RatingModel](RatingModel.md)|Represents a model to evaluate skills or other related entities.  |
|[ResourceAssignment](ResourceAssignment.md)|Entity used to keep track of resource assignment header information  on tasks.  |
|[ResourceAssignmentDetail](ResourceAssignmentDetail.md)|Entity used to keep track of resource assignment details on tasks.   |
|[ResourceCategoryPriceLevel](ResourceCategoryPriceLevel.md)|List of prices by role on a price list.  |
|[ResourceRequest](ResourceRequest.md)|Entity that wraps the resource requirement to capture the type of resources, skills, and location required.  |
|[ResultCache](ResultCache.md)|Cache for scored work items per resource that are returned from Azure Machine Learning.  |
|[RoleCompetencyRequirement](RoleCompetencyRequirement.md)|Entity used  to associate skills in a role.  |
|[RolePriceMarkup](RolePriceMarkup.md)|List of markups for prices by role on a price list.  |
|[RoleUtilization](RoleUtilization.md)|Gathers data about utilization per role to display in a chart  |
|[TimeEntry](TimeEntry.md)|Entity used  for time entry.  |
|[TimeOffCalendar](TimeOffCalendar.md)|Relationship table for time off calendar entries.  |
|[TransactionCategory](TransactionCategory.md)|Business transaction categories to classify costs and revenue.  |
|[TransactionCategoryClassification](TransactionCategoryClassification.md)|Entity used to associate a category broadly as time, expense or material.  |
|[TransactionCategoryHierarchyElement](TransactionCategoryHierarchyElement.md)|Hierarchical relationship of the transaction category with a root node.  |
|[TransactionCategoryPriceLevel](TransactionCategoryPriceLevel.md)|List of prices by category on a price list.  |
|[TransactionConnection](TransactionConnection.md)|System entity used to establish connections between the cost, unbilled revenue, and billed revenue components of a transaction as they happen.  |
|[TransactionType](TransactionType.md)|Broad classification, such as time or expense, and the context such cost, unbilled revenue, or billed revenue of a project actual.  |
|[UserWorkHistory](UserWorkHistory.md)|Entity used to look up resources based on demonstrated skills.  |
