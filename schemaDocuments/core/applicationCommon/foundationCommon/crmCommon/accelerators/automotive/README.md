
# automotive

CDM Solution for the 'AUTOMOTIVE' CDS Solution  

## Entities

|Name|Description|
|---|---|
|[AggregateKPI](AggregateKPI.cdm.json)|Type of KPIs that can be useful for tracking customer, device or business performance.|
|[AggregateKPIContext](AggregateKPIContext.cdm.json)|Context of a given customer, device, business operation or user, in which a given aggregate KPI may be applicable and may have a given target value.|
|[AggregateKPIMeasurement](AggregateKPIMeasurement.cdm.json)|Measured value for a given aggregate KPI in a given context.|
|[AttributeGroup](AttributeGroup.cdm.json)|Group of attribute types, for example representing dimensions, interior, exterior, environmental or other aspects of a device.|
|[AttributeOption](AttributeOption.cdm.json)|Available option for an attribute type that require its value to be selected from a list.|
|[AttributeType](AttributeType.cdm.json)|Type of entry in a device specification, such as length, fuel type, color or any other property that characterizes a given device.|
|[AutoLeadToOpportunitySalesProcess](AutoLeadToOpportunitySalesProcess.cdm.json)|Base entity for process Auto Lead to Opportunity Sales Process|
|[Business](Business.cdm.json)|Legal entity or organization representing, for example, a national sales company, importer, distributor, dealer group or dealer in the ecosystem.|
|[BusinessFacility](BusinessFacility.cdm.json)|Physical facility or building where a business runs operations.|
|[BusinessOperation](BusinessOperation.cdm.json)|Operation run at a business facility, such as new car sales showroom, used car sales or service center.|
|[BusinessOperationCustomerPreference](BusinessOperationCustomerPreference.cdm.json)|Customer preference for a given type of business operation, such as preferred service center or rental depot.|
|[BusinessType](BusinessType.cdm.json)|Type of business, such as national sales company, importer, distributor, dealer group or dealer.|
|[ConfigurationCode](ConfigurationCode.cdm.json)|Unique OEM code for a given combination of configuration options.|
|[ConfigurationOption](ConfigurationOption.cdm.json)|Configuration option included in devices with a given configuration code.|
|[CustomerAttachment](CustomerAttachment.cdm.json)|Document or file related to a given customer or deal file.|
|[CustomerIdentifier](CustomerIdentifier.cdm.json)|Unique identifier for a customer, such as customer number or manufacturers ID.|
|[CustomerIdentifierType](CustomerIdentifierType.cdm.json)|Type of customer identifier, such as customer number or manufacturer ID.|
|[Deal](Deal.cdm.json)|Business proposal for the sale of one or more vehicle or device, including optional trade-ins, add-ons and financial terms.|
|[DealCustomer](DealCustomer.cdm.json)|Customer associated with a given deal.|
|[DealDevice](DealDevice.cdm.json)|Vehicle or device that is the subject of a deal, which may involve one or more vehicle or device.|
|[DealDeviceAddOn](DealDeviceAddOn.cdm.json)|Additional product or service offered with a given vehicle or device in a deal.|
|[DealerPlate](DealerPlate.cdm.json)|License plate applied temporarily to vehicles to provide services such as test drives.|
|[DealerPlateDeviceAssignment](DealerPlateDeviceAssignment.cdm.json)|Record of which dealer plates were used on which vehicle or device over time.|
|[DealFile](DealFile.cdm.json)|Container for deals relating to a given opportunity.|
|[DealTerm](DealTerm.cdm.json)|Terms applicable a given type of deal.|
|[DealType](DealType.cdm.json)|Type of deal, such as new car sales, used car sales, heavy equipment sales, and so on.|
|[Device](Device.cdm.json)|Physical piece of equipment of considerable value such as a vehicle or a device such as an excavator, that can be tracked through its entire life cycle of trade, ownership and service and may be related to one or more customers over time.|
|[DeviceBrand](DeviceBrand.cdm.json)|Brand name of a vehicle or device manufacturer, main vendor for a group of devices or manufacturer or main vendor for supplier items.|
|[DeviceClass](DeviceClass.cdm.json)|Family of vehicles or devices for the specific brand provided by the manufacturer.|
|[DeviceComponent](DeviceComponent.cdm.json)|Physical or logical part of a vehicle or device.|
|[DeviceGeneration](DeviceGeneration.cdm.json)|Specific period in the evolution of a device class over time.|
|[DeviceInspection](DeviceInspection.cdm.json)|Record of inspections carried out on a given vehicle or device over time.|
|[DeviceInspectionChecklist](DeviceInspectionChecklist.cdm.json)|Specific checklist of a given type, such as a pre-delivery inspection or a checklist used for a specific type of service.|
|[DeviceInspectionChecklistType](DeviceInspectionChecklistType.cdm.json)|Type of checklist, such as pre-delivery or service.|
|[DeviceLicensePlate](DeviceLicensePlate.cdm.json)|Record of license plates assigned to a given vehicle or device over time.|
|[DeviceMeasure](DeviceMeasure.cdm.json)|Specific measurable quantity related to a vehicle or device that is used to track usage over time, such as miles driven, engine hours or time since purchase.|
|[DeviceMeasurement](DeviceMeasurement.cdm.json)|Record of usage measurements for a given vehicle or device over time.|
|[DeviceMeter](DeviceMeter.cdm.json)|Usage meter attached to a specific vehicle or device, such as odometer or fuel gauge.|
|[DeviceModel](DeviceModel.cdm.json)|Sub-type of a device class, which may be identified by specific engine option, body styles and other common characteristics. Breaks down further into device model codes.|
|[DeviceModelCode](DeviceModelCode.cdm.json)|Specific configuration of a device, such as a vehicle of specific generation, body style, engine option and transmission.|
|[DeviceObservation](DeviceObservation.cdm.json)|Important observation on the state of a given vehicle or device, typically resulting from an inspection.|
|[DeviceObservationType](DeviceObservationType.cdm.json)|Type of observation, indicating severity and nature of the observation and typically used for classification and filtering of observations.|
|[DeviceRegistration](DeviceRegistration.cdm.json)|Record of registrations of a specific vehicle or device to specific customers over time.|
|[DeviceSensor](DeviceSensor.cdm.json)|Sensor attached to or as part of a vehicle or device. May provide signals of device health or usage.|
|[DeviceState](DeviceState.cdm.json)|Describes state of a vehicle or device, such as New, Used or Scrapped.|
|[DeviceStyle](DeviceStyle.cdm.json)|Distinctive form or type of vehicle or device such as sedan or station wagon car, wheeled or crawler excavator, and so on.|
|[DeviceType](DeviceType.cdm.json)|Fundamental type of device, such as vehicle, truck, harvester, boat engine, and so on.|
|[DeviceVariant](DeviceVariant.cdm.json)|Standard variant of a device model code, with special characteristics such as a specific OEM-fitted accessory package or being a limited edition.|
|[DeviceWarranty](DeviceWarranty.cdm.json)|Relationship indicating that a specific warranty applies to a specific vehicle or device.|
|[DeviceWarrantyLimit](DeviceWarrantyLimit.cdm.json)|Limits of a specific warranty on a specific vehicle or device, such as maximum mileage or specific expiration date.|
|[FinancingOpportunity](FinancingOpportunity.cdm.json)|Financing opportunity associated with a specific vehicle or device included in a lead.|
|[FinancingOpportunityDetail](FinancingOpportunityDetail.cdm.json)|Type of payment that forms part of a financing opportunity.|
|[Fleet](Fleet.cdm.json)|Collection of devices belonging to a specific customer or business operation, typically serving a specific purpose.|
|[FleetDevice](FleetDevice.cdm.json)|Represents a vehicle or device as part of a specific fleet.|
|[Lead](Lead.cdm.json)||
|[LeadDevice](LeadDevice.cdm.json)|Vehicle or device that is the subject of a lead, which may involve one or more vehicles or devices.|
|[LeadDeviceSpecification](LeadDeviceSpecification.cdm.json)|Loose description of a characteristic of a vehicle or device of interest in a lead.|
|[LeadDisposition](LeadDisposition.cdm.json)|Record of activities performed to follow up and nurture a lead over time.|
|[LeadDispositionActivity](LeadDispositionActivity.cdm.json)|Specific activity that should be taken to follow up and nurture a lead.|
|[LeadPriceType](LeadPriceType.cdm.json)|Type of price tag for a vehicle or device, such as MSRP, appraisal or asking price.|
|[LeadProspect](LeadProspect.cdm.json)|Contact associated with a given lead.|
|[LeadSpecificationType](LeadSpecificationType.cdm.json)|Type of characteristic used to loosely describe a vehicle or device of interest in a lead.|
|[OperationCode](OperationCode.cdm.json)|Standard operation performed during service, typically specified by the vehicle or device manufacturer.|
|[OperationType](OperationType.cdm.json)|Type of business operation, such as new car sales showroom, used car sales or service center.|
|[SalesContract](SalesContract.cdm.json)|Contract involving the sale of one or more vehicle or device to a customer.|
|[SalesContractDetail](SalesContractDetail.cdm.json)|Vehicle or device included in a sales contract.|
|[SalesContractPayment](SalesContractPayment.cdm.json)|Payment made in accordance with a sales contract.|
|[SalesContractTerm](SalesContractTerm.cdm.json)|Terms applicable a given type of sales contract.|
|[SalesContractType](SalesContractType.cdm.json)|Type of sales contract, such as new car sales, used car sales, heavy equipment sales, and so on.|
|[ServiceAppointment](ServiceAppointment.cdm.json)|Record of service appointments for a specific vehicle or device over time.|
|[ServiceAppointmentType](ServiceAppointmentType.cdm.json)|Type of service appointment.|
|[ServiceContract](ServiceContract.cdm.json)|Contract involving the service of one or more vehicles or devices owned by a customer.|
|[ServiceContractDetail](ServiceContractDetail.cdm.json)|Vehicle or device included in a service contract.|
|[ServiceContractTerm](ServiceContractTerm.cdm.json)|Terms applicable a given type of service contract.|
|[ServiceContractType](ServiceContractType.cdm.json)|Type of service contract.|
|[ServiceOrder](ServiceOrder.cdm.json)|Service order for a specific vehicle or device.|
|[ServiceOrderGroup](ServiceOrderGroup.cdm.json)|Group of service orders.|
|[ServiceOrderJob](ServiceOrderJob.cdm.json)|Job performed during the execution of a service order. A single service order may require one or more jobs to be completed.|
|[ServiceOrderJobDetail](ServiceOrderJobDetail.cdm.json)|Record of time, material or other information relating to the execution of a given service order job.|
|[ServiceOrderJobType](ServiceOrderJobType.cdm.json)|Type of service job that is performed frequently and should follow a standard procedure.|
|[ServiceOrderType](ServiceOrderType.cdm.json)|Type of service order.|
|[Specification](Specification.cdm.json)|Specification of a vehicle or device with a given combination of configuration options and accessories.|
|[SpecificationAccessory](SpecificationAccessory.cdm.json)|Optional accessories that are included on a vehicle or device with the given specification.|
|[SpecificationAttribute](SpecificationAttribute.cdm.json)|Technical specifications are represented as a grouped list of attribute types that collectively describe key characteristics of a given vehicle or device.|
|[TestDrive](TestDrive.cdm.json)|The physical experience a customer or prospect has of a vehicle or device prior to a possible purchase of same or similar one.|
|[TradeIn](TradeIn.cdm.json)|Vehicle or device that a customer wants to use as part of payment buying another one (new or used).|
|[Unit](Unit.cdm.json)|Types of measures such as Miles, Kilometres, Hours, Days or Months.|
|[Warranty](Warranty.cdm.json)|Contract between a vehicle or device manufacturer, importer, dealer and end customer, promising a certain quality level for a given amount of time or usage.|
|[WarrantyLimit](WarrantyLimit.cdm.json)|Limits to a specific warranty, such as maximum mileage or time until expiration.|
|[WarrantyType](WarrantyType.cdm.json)|Types of warranties, such as standard or extended.|
