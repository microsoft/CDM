
# automotive


## Entities

|Name|Description|
|---|---|
|[AggregateKPI](AggregateKPI.md)|Type of KPIs that can be useful for tracking customer, device or business performance.  |
|[AggregateKPIContext](AggregateKPIContext.md)|Context of a given customer, device, business operation or user, in which a given aggregate KPI may be applicable and may have a given target value.  |
|[AggregateKPIMeasurement](AggregateKPIMeasurement.md)|Measured value for a given aggregate KPI in a given context.  |
|[AttributeGroup](AttributeGroup.md)|Group of attribute types, for example representing dimensions, interior, exterior, environmental or other aspects of a device.  |
|[AttributeOption](AttributeOption.md)|Available option for an attribute type that require its value to be selected from a list.  |
|[AttributeType](AttributeType.md)|Type of entry in a device specification, such as length, fuel type, color or any other property that characterizes a given device.  |
|[AutoLeadToOpportunitySalesProcess](AutoLeadToOpportunitySalesProcess.md)|Base entity for process Auto Lead to Opportunity Sales Process  |
|[Business](Business.md)|Legal entity or organization representing, for example, a national sales company, importer, distributor, dealer group or dealer in the ecosystem.  |
|[BusinessFacility](BusinessFacility.md)|Physical facility or building where a business runs operations.  |
|[BusinessOperation](BusinessOperation.md)|Operation run at a business facility, such as new car sales showroom, used car sales or service center.  |
|[BusinessOperationCustomerPreference](BusinessOperationCustomerPreference.md)|Customer preference for a given type of business operation, such as preferred service center or rental depot.  |
|[BusinessType](BusinessType.md)|Type of business, such as national sales company, importer, distributor, dealer group or dealer.  |
|[ConfigurationCode](ConfigurationCode.md)|Unique OEM code for a given combination of configuration options.  |
|[ConfigurationOption](ConfigurationOption.md)|Configuration option included in devices with a given configuration code.  |
|[CustomerAttachment](CustomerAttachment.md)|Document or file related to a given customer or deal file.  |
|[CustomerIdentifier](CustomerIdentifier.md)|Unique identifier for a customer, such as customer number or manufacturers ID.  |
|[CustomerIdentifierType](CustomerIdentifierType.md)|Type of customer identifier, such as customer number or manufacturer ID.  |
|[Deal](Deal.md)|Business proposal for the sale of one or more vehicle or device, including optional trade-ins, add-ons and financial terms.  |
|[DealCustomer](DealCustomer.md)|Customer associated with a given deal.  |
|[DealDevice](DealDevice.md)|Vehicle or device that is the subject of a deal, which may involve one or more vehicle or device.  |
|[DealDeviceAddOn](DealDeviceAddOn.md)|Additional product or service offered with a given vehicle or device in a deal.  |
|[DealerPlate](DealerPlate.md)|License plate applied temporarily to vehicles to provide services such as test drives.  |
|[DealerPlateDeviceAssignment](DealerPlateDeviceAssignment.md)|Record of which dealer plates were used on which vehicle or device over time.  |
|[DealFile](DealFile.md)|Container for deals relating to a given opportunity.  |
|[DealTerm](DealTerm.md)|Terms applicable a given type of deal.  |
|[DealType](DealType.md)|Type of deal, such as new car sales, used car sales, heavy equipment sales, and so on.  |
|[Device](Device.md)|Physical piece of equipment of considerable value such as a vehicle or a device such as an excavator, that can be tracked through its entire life cycle of trade, ownership and service and may be related to one or more customers over time.  |
|[DeviceBrand](DeviceBrand.md)|Brand name of a vehicle or device manufacturer, main vendor for a group of devices or manufacturer or main vendor for supplier items.  |
|[DeviceClass](DeviceClass.md)|Family of vehicles or devices for the specific brand provided by the manufacturer.  |
|[DeviceComponent](DeviceComponent.md)|Physical or logical part of a vehicle or device.  |
|[DeviceGeneration](DeviceGeneration.md)|Specific period in the evolution of a device class over time.  |
|[DeviceInspection](DeviceInspection.md)|Record of inspections carried out on a given vehicle or device over time.  |
|[DeviceInspectionChecklist](DeviceInspectionChecklist.md)|Specific checklist of a given type, such as a pre-delivery inspection or a checklist used for a specific type of service.  |
|[DeviceInspectionChecklistType](DeviceInspectionChecklistType.md)|Type of checklist, such as pre-delivery or service.  |
|[DeviceLicensePlate](DeviceLicensePlate.md)|Record of license plates assigned to a given vehicle or device over time.  |
|[DeviceMeasure](DeviceMeasure.md)|Specific measurable quantity related to a vehicle or device that is used to track usage over time, such as miles driven, engine hours or time since purchase.  |
|[DeviceMeasurement](DeviceMeasurement.md)|Record of usage measurements for a given vehicle or device over time.  |
|[DeviceMeter](DeviceMeter.md)|Usage meter attached to a specific vehicle or device, such as odometer or fuel gauge.  |
|[DeviceModel](DeviceModel.md)|Sub-type of a device class, which may be identified by specific engine option, body styles and other common characteristics. Breaks down further into device model codes.  |
|[DeviceModelCode](DeviceModelCode.md)|Specific configuration of a device, such as a vehicle of specific generation, body style, engine option and transmission.  |
|[DeviceObservation](DeviceObservation.md)|Important observation on the state of a given vehicle or device, typically resulting from an inspection.  |
|[DeviceObservationType](DeviceObservationType.md)|Type of observation, indicating severity and nature of the observation and typically used for classification and filtering of observations.  |
|[DeviceRegistration](DeviceRegistration.md)|Record of registrations of a specific vehicle or device to specific customers over time.  |
|[DeviceSensor](DeviceSensor.md)|Sensor attached to or as part of a vehicle or device. May provide signals of device health or usage.  |
|[DeviceState](DeviceState.md)|Describes state of a vehicle or device, such as New, Used or Scrapped.  |
|[DeviceStyle](DeviceStyle.md)|Distinctive form or type of vehicle or device such as sedan or station wagon car, wheeled or crawler excavator, and so on.  |
|[DeviceType](DeviceType.md)|Fundamental type of device, such as vehicle, truck, harvester, boat engine, and so on.  |
|[DeviceVariant](DeviceVariant.md)|Standard variant of a device model code, with special characteristics such as a specific OEM-fitted accessory package or being a limited edition.  |
|[DeviceWarranty](DeviceWarranty.md)|Relationship indicating that a specific warranty applies to a specific vehicle or device.  |
|[DeviceWarrantyLimit](DeviceWarrantyLimit.md)|Limits of a specific warranty on a specific vehicle or device, such as maximum mileage or specific expiration date.  |
|[FinancingOpportunity](FinancingOpportunity.md)|Financing opportunity associated with a specific vehicle or device included in a lead.  |
|[FinancingOpportunityDetail](FinancingOpportunityDetail.md)|Type of payment that forms part of a financing opportunity.  |
|[Fleet](Fleet.md)|Collection of devices belonging to a specific customer or business operation, typically serving a specific purpose.  |
|[FleetDevice](FleetDevice.md)|Represents a vehicle or device as part of a specific fleet.  |
|[LeadDevice](LeadDevice.md)|Vehicle or device that is the subject of a lead, which may involve one or more vehicles or devices.  |
|[LeadDeviceSpecification](LeadDeviceSpecification.md)|Loose description of a characteristic of a vehicle or device of interest in a lead.  |
|[LeadDisposition](LeadDisposition.md)|Record of activities performed to follow up and nurture a lead over time.  |
|[LeadDispositionActivity](LeadDispositionActivity.md)|Specific activity that should be taken to follow up and nurture a lead.  |
|[LeadPriceType](LeadPriceType.md)|Type of price tag for a vehicle or device, such as MSRP, appraisal or asking price.  |
|[LeadProspect](LeadProspect.md)|Contact associated with a given lead.  |
|[LeadSpecificationType](LeadSpecificationType.md)|Type of characteristic used to loosely describe a vehicle or device of interest in a lead.  |
|[OperationCode](OperationCode.md)|Standard operation performed during service, typically specified by the vehicle or device manufacturer.  |
|[OperationType](OperationType.md)|Type of business operation, such as new car sales showroom, used car sales or service center.  |
|[SalesContract](SalesContract.md)|Contract involving the sale of one or more vehicle or device to a customer.  |
|[SalesContractDetail](SalesContractDetail.md)|Vehicle or device included in a sales contract.  |
|[SalesContractPayment](SalesContractPayment.md)|Payment made in accordance with a sales contract.  |
|[SalesContractTerm](SalesContractTerm.md)|Terms applicable a given type of sales contract.  |
|[SalesContractType](SalesContractType.md)|Type of sales contract, such as new car sales, used car sales, heavy equipment sales, and so on.  |
|[ServiceAppointment](ServiceAppointment.md)|Record of service appointments for a specific vehicle or device over time.  |
|[ServiceAppointmentType](ServiceAppointmentType.md)|Type of service appointment.  |
|[ServiceContract](ServiceContract.md)|Contract involving the service of one or more vehicles or devices owned by a customer.  |
|[ServiceContractDetail](ServiceContractDetail.md)|Vehicle or device included in a service contract.  |
|[ServiceContractTerm](ServiceContractTerm.md)|Terms applicable a given type of service contract.  |
|[ServiceContractType](ServiceContractType.md)|Type of service contract.  |
|[ServiceOrder](ServiceOrder.md)|Service order for a specific vehicle or device.  |
|[ServiceOrderGroup](ServiceOrderGroup.md)|Group of service orders.  |
|[ServiceOrderJob](ServiceOrderJob.md)|Job performed during the execution of a service order. A single service order may require one or more jobs to be completed.  |
|[ServiceOrderJobDetail](ServiceOrderJobDetail.md)|Record of time, material or other information relating to the execution of a given service order job.  |
|[ServiceOrderJobType](ServiceOrderJobType.md)|Type of service job that is performed frequently and should follow a standard procedure.  |
|[ServiceOrderType](ServiceOrderType.md)|Type of service order.  |
|[Specification](Specification.md)|Specification of a vehicle or device with a given combination of configuration options and accessories.  |
|[SpecificationAccessory](SpecificationAccessory.md)|Optional accessories that are included on a vehicle or device with the given specification.  |
|[SpecificationAttribute](SpecificationAttribute.md)|Technical specifications are represented as a grouped list of attribute types that collectively describe key characteristics of a given vehicle or device.  |
|[TestDrive](TestDrive.md)|The physical experience a customer or prospect has of a vehicle or device prior to a possible purchase of same or similar one.  |
|[TradeIn](TradeIn.md)|Vehicle or device that a customer wants to use as part of payment buying another one (new or used).  |
|[Unit](Unit.md)|Types of measures such as Miles, Kilometres, Hours, Days or Months.  |
|[Warranty](Warranty.md)|Contract between a vehicle or device manufacturer, importer, dealer and end customer, promising a certain quality level for a given amount of time or usage.  |
|[WarrantyLimit](WarrantyLimit.md)|Limits to a specific warranty, such as maximum mileage or time until expiration.  |
|[WarrantyType](WarrantyType.md)|Types of warranties, such as standard or extended.  |
