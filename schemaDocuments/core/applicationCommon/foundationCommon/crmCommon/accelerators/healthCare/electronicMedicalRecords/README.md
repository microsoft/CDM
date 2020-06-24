
# electronicMedicalRecords

CDM standard entities for 'electronicMedicalRecords'  

## Entities

|Name|Description|
|---|---|
|[Account](Account.cdm.json)|Business that represents a customer or potential customer. The company that is billed in business transactions.|
|[AccountType](AccountType.cdm.json)||
|[ActivityDefinition](ActivityDefinition.cdm.json)|This entity allows for the definition of some activity to be performed, independent of a particular patient, practitioner, or other performance context.|
|[ActivityDefinitionBodySite](ActivityDefinitionBodySite.cdm.json)|Indicates the sites on the subject's body where the procedure should be performed (I.e. the target sites).|
|[ActivityDefinitionContact](ActivityDefinitionContact.cdm.json)|Contact details to assist a user in finding and communicating with the publisher.|
|[ActivityDefinitionContributor](ActivityDefinitionContributor.cdm.json)|A contributor to the content of the asset, including authors, editors, reviewers, and endorsers.|
|[ActivityDefinitionContributorContact](ActivityDefinitionContributorContact.cdm.json)|Contact details to assist a user in finding and communicating with the contributor.|
|[ActivityDefinitionDosage](ActivityDefinitionDosage.cdm.json)|Provides detailed dosage instructions in the same way that they are described for Medication Request entities.|
|[ActivityDefinitionDynamicValue](ActivityDefinitionDynamicValue.cdm.json)|Dynamic values that will be evaluated to produce values for elements of the resulting entity.|
|[ActivityDefinitionJurisdiction](ActivityDefinitionJurisdiction.cdm.json)|A legal or geographic region in which the activity definition is intended to be used.|
|[ActivityDefinitionLibrary](ActivityDefinitionLibrary.cdm.json)|A reference to a Library entity containing any formal logic used by the asset.|
|[ActivityDefinitionParticipant](ActivityDefinitionParticipant.cdm.json)|Indicates who should participate in performing the action described.|
|[ActivityDefinitionRelatedArtifact](ActivityDefinitionRelatedArtifact.cdm.json)|Related artifacts such as additional documentation, justification, or bibliographic references.|
|[ActivityDefinitionTopic](ActivityDefinitionTopic.cdm.json)|Descriptive topics related to the content of the activity. Topics provide a high-level categorization of the activity that can be useful for filtering and searching.|
|[ActivityDefinitionUseContext](ActivityDefinitionUseContext.cdm.json)|The content was developed with a focus and intent of supporting the contexts that are listed. These terms may be used to assist with indexing and searching for appropriate activity definition instance|
|[AdditionalName](AdditionalName.cdm.json)|It consists the patient additional names.|
|[Address](Address.cdm.json)|Address and shipping information. Used to store additional addresses for an account or contact.|
|[AllergyIntolerance](AllergyIntolerance.cdm.json)|Risk of harmful or undesirable, physiological response which is unique to an individual and associated with exposure to a substance.|
|[AppointmentEMR](AppointmentEMR.cdm.json)|A booking of a healthcare event among patient(s), practitioner(s), related person(s) and/or device(s) for a specific date/time. This may result in one or more Encounter(s).|
|[AppointmentEMRIndication](AppointmentEMRIndication.cdm.json)|Reason the appointment has been scheduled to take place, as specified using information from another entity. The indication will typically be a Condition or a Procedure|
|[AppointmentEMRParticipant](AppointmentEMRParticipant.cdm.json)|List of participants involved in the appointment.|
|[AppointmentEMRReason](AppointmentEMRReason.cdm.json)|The reason that this appointment is being scheduled. This is more clinical than administrative.|
|[AppointmentEMRReferralRequest](AppointmentEMRReferralRequest.cdm.json)|The referral request this appointment is allocated to assess (incoming referral).|
|[AppointmentEMRRequestedPeriod](AppointmentEMRRequestedPeriod.cdm.json)|A set of date ranges (potentially including times) that the appointment is preferred to be scheduled within.|
|[AppointmentEMRServiceType](AppointmentEMRServiceType.cdm.json)|The specific service that is to be performed during this appointment.s|
|[AppointmentEMRSlot](AppointmentEMRSlot.cdm.json)|The slots from the participants' schedules that will be filled by the appointment.|
|[AppointmentEMRSpecialty](AppointmentEMRSpecialty.cdm.json)|The specialty of a practitioner that would be required to perform the service requested in this appointment.|
|[AppointmentServiceCategory](AppointmentServiceCategory.cdm.json)|A broad categorization of the service that is to be performed during this appointment.|
|[BodySite](BodySite.cdm.json)|Record details about the anatomical location of a specimen or body part. This entity may be used when a coded concept does not provide the necessary detail needed for the use case.|
|[CarePlan](CarePlan.cdm.json)|Describes the intention of how one or more practitioners intend to deliver care for a particular patient, group or community for a period of time, possibly limited to care for a specific condition|
|[CarePlanActivity](CarePlanActivity.cdm.json)|Identifies a planned action to occur as part of the plan. For example, a medication to be used, lab tests to perform, self-monitoring, education, etc.|
|[CarePlanActivityGoal](CarePlanActivityGoal.cdm.json)|Internal reference that identifies the goals that this activity is intended to contribute towards meeting.|
|[CarePlanActivityOutcome](CarePlanActivityOutcome.cdm.json)|Identifies the outcome at the point when the status of the activity is assessed. For example, the outcome of an education activity could be patient understands (or not).|
|[CarePlanActivityOutcomeReference](CarePlanActivityOutcomeReference.cdm.json)|Details of the outcome or action resulting from the activity.|
|[CarePlanActivityPerformer](CarePlanActivityPerformer.cdm.json)|Identifies who's expected to be involved in the activity.|
|[CarePlanActivityReason](CarePlanActivityReason.cdm.json)|Provides the rationale that drove the inclusion of this particular activity as part of the plan or the reason why the activity was prohibited.|
|[CarePlanActivityReasonCode](CarePlanActivityReasonCode.cdm.json)|Provides the rationale that drove the inclusion of this particular activity as part of the plan or the reason why the activity was prohibited.|
|[CarePlanActivityReasonReference](CarePlanActivityReasonReference.cdm.json)|Provides the health condition(s) that drove the inclusion of this particular activity as part of the plan.|
|[CarePlanAddresses](CarePlanAddresses.cdm.json)|Identifies the conditions/problems/concerns/diagnoses/etc. whose management and/or mitigation are handled by this plan.|
|[CarePlanAuthor](CarePlanAuthor.cdm.json)|Identifies the individual(s) or organization who is responsible for the content of the care plan.|
|[CarePlanBasedOn](CarePlanBasedOn.cdm.json)|A care plan that is fulfilled in whole or in part by this care plan.|
|[CarePlanCareTeam](CarePlanCareTeam.cdm.json)|Identifies all people and organizations who are expected to be involved in the care envisioned by this plan.|
|[CarePlanCategory](CarePlanCategory.cdm.json)|Identifies what "kind" of plan this is to support differentiation between multiple co-existing plans; e.g. "Home health", "psychiatric", "asthma", "disease management", "wellness plan", etc.|
|[CarePlanDefinition](CarePlanDefinition.cdm.json)|Identifies the protocol, questionnaire, guideline or other specification the care plan should be conducted in accordance with.|
|[CarePlanGoal](CarePlanGoal.cdm.json)|Describes the intended objective(s) of carrying out the care plan.|
|[CarePlanGoalMeasure](CarePlanGoalMeasure.cdm.json)||
|[CarePlanGoalOutcome](CarePlanGoalOutcome.cdm.json)||
|[CarePlanPartOf](CarePlanPartOf.cdm.json)|A larger care plan of which this particular care plan is a component or step.|
|[CarePlanReplace](CarePlanReplace.cdm.json)|Completed or terminated care plan whose function is taken by this new care plan.|
|[CarePlanSupportInfo](CarePlanSupportInfo.cdm.json)|Identifies portions of the patient's record that specifically influenced the formation of the plan. These might include co-morbidities, recent procedures, limitations, recent assessments, etc.|
|[CareTeam](CareTeam.cdm.json)|The Care Team includes all the people and organizations who plan to participate in the coordination and delivery of care for a patient.|
|[CareTeamCategory](CareTeamCategory.cdm.json)|Identifies what kind of team. This is to support differentiation between multiple co-existing teams, such as care plan team, episode of care team, longitudinal care team.|
|[CareTeamManagingOrganization](CareTeamManagingOrganization.cdm.json)|The organization responsible for the care team.|
|[CareTeamParticipant](CareTeamParticipant.cdm.json)|Identifies all people and organizations who are expected to be involved in the care team.|
|[CareTeamParticipantRole](CareTeamParticipantRole.cdm.json)|Indicates specific responsibility of an individual within the care team, such as "Primary care physician", "Trained social worker counselor", "Caregiver", etc.|
|[CareTeamReasonCode](CareTeamReasonCode.cdm.json)|Describes why the care team exists.|
|[CareTeamReasonReference](CareTeamReasonReference.cdm.json)|Condition(s) that this care team addresses.|
|[ClinicalImpression](ClinicalImpression.cdm.json)|A record of a clinical assessment performed to determine what problem(s) may affect the patient and before planning the treatments or management strategies that are best to manage a patient condition|
|[ClinicalImpressionAction](ClinicalImpressionAction.cdm.json)|Action taken as part of assessment procedure.|
|[ClinicalImpressionFinding](ClinicalImpressionFinding.cdm.json)|Specific findings or diagnoses that was considered likely or relevant to ongoing treatment.|
|[ClinicalImpressionInvestigation](ClinicalImpressionInvestigation.cdm.json)|One or more sets of investigations (signs, etc.). The actual grouping of investigations vary greatly depending on the type and context of the assessment.|
|[ClinicalImpressionInvestigationItem](ClinicalImpressionInvestigationItem.cdm.json)|A record of a specific investigation that was undertaken.|
|[ClinicalImpressionProblem](ClinicalImpressionProblem.cdm.json)|This a list of the relevant problems/conditions for a patient.|
|[ClinicalImpressionPrognosis](ClinicalImpressionPrognosis.cdm.json)|Estimate of likely outcome.|
|[ClinicalImpressionProtocol](ClinicalImpressionProtocol.cdm.json)|Reference to a specific published clinical protocol that was followed during this assessment, and/or that provides evidence in support of the diagnosis.|
|[CodeableConcept](CodeableConcept.cdm.json)|A Codeable Concept represents a value that is usually supplied by providing a reference to one or more terminologies, but may also be defined by the provision of text.|
|[Communication](Communication.cdm.json)|An occurrence of information being transmitted; e.g. an alert that was sent to a responsible provider, a public health agency was notified about a reportable condition.|
|[CommunicationRequest](CommunicationRequest.cdm.json)|A request to convey information.|
|[CommunicationRequestBasedOn](CommunicationRequestBasedOn.cdm.json)|A plan or proposal that is fulfilled in whole or in part by this request.|
|[CommunicationRequestCategory](CommunicationRequestCategory.cdm.json)|The type of message to be sent such as alert, notification, reminder, instruction, etc.|
|[CommunicationRequestMedium](CommunicationRequestMedium.cdm.json)|A channel that was used for this communication (e.g. email, fax).|
|[CommunicationRequestPayload](CommunicationRequestPayload.cdm.json)|Text, attachment(s), or resource(s) to be communicated to the recipient.|
|[CommunicationRequestReason](CommunicationRequestReason.cdm.json)|Describes why the request is being made in coded or textual form.|
|[CommunicationRequestReasonReference](CommunicationRequestReasonReference.cdm.json)|Indicates another resource whose existence justifies this request.|
|[CommunicationRequestRecipient](CommunicationRequestRecipient.cdm.json)|The entity (e.g. person, organization, clinical information system, device, group, or care team) which is the intended target of the communication.|
|[CommunicationRequestReplace](CommunicationRequestReplace.cdm.json)|Completed or terminated request(s) whose function is taken by this new request.|
|[CommunicationRequestTopic](CommunicationRequestTopic.cdm.json)|The entities which were related to producing this communication request.|
|[Condition](Condition.cdm.json)|A clinical condition, problem, diagnosis, or other event, situation, issue, or clinical concept that has risen to a level of concern.|
|[ConditionBodySite](ConditionBodySite.cdm.json)|The anatomical location where this condition manifests itself.|
|[ConditionCategory](ConditionCategory.cdm.json)|A category assigned to the condition.|
|[ConditionEvidence](ConditionEvidence.cdm.json)|Supporting Evidence / manifestations that are the basis on which this condition is suspected or confirmed.|
|[ConditionStage](ConditionStage.cdm.json)|Clinical stage or grade of a condition. May include formal severity assessments.|
|[Contact](Contact.cdm.json)|Person with whom a business unit has a relationship, such as customer, supplier, and colleague.|
|[ContactLink](ContactLink.cdm.json)|Link to another patient entity that concerns the same actual patient.|
|[DataReqCodeFilterValueCodeableConcept](DataReqCodeFilterValueCodeableConcept.cdm.json)|The Codeable Concepts for the code filter.|
|[DataRequirement](DataRequirement.cdm.json)|Describes a required data item for evaluation in terms of the type of data, and optional code or date-based filters of the data.|
|[DataRequirementCodeFilter](DataRequirementCodeFilter.cdm.json)|Code filters specify additional constraints on the data, specifying the value set of interest for a particular element of the data.|
|[DataRequirementCodeFilterValueCode](DataRequirementCodeFilterValueCode.cdm.json)|The codes for the code filter.|
|[DataRequirementCodeFilterValueCoding](DataRequirementCodeFilterValueCoding.cdm.json)|The Coding for the code filter.|
|[DataRequirementDateFilter](DataRequirementDateFilter.cdm.json)|Date filters specify additional constraints on the data in terms of the applicable date range for specific elements.|
|[DataRequirementMustSupport](DataRequirementMustSupport.cdm.json)|Indicates that specific elements of the type are referenced by the knowledge module and must be supported by the consumer in order to obtain an effective evaluation.|
|[DataRequirementProfile](DataRequirementProfile.cdm.json)|If specified, this indicates a profile that the input data must conform to, or that the output data will conform to.|
|[Device](Device.cdm.json)|This entity identifies an instance or a type of a manufactured item that is used in the provision of healthcare without being substantially changed through that activity.|
|[DeviceCalibration](DeviceCalibration.cdm.json)|Describes the calibrations that have been performed or that are required to be performed.|
|[DeviceComponent](DeviceComponent.cdm.json)|The characteristics, operational status and capabilities of a medical-related component of a medical device.|
|[DeviceComponentOperationalStatus](DeviceComponentOperationalStatus.cdm.json)|The current operational status of the device. For example: On, Off, Standby, etc.|
|[DeviceComponentProductionSpecification](DeviceComponentProductionSpecification.cdm.json)|The production specification such as component revision, serial number, etc.|
|[DeviceContactPoint](DeviceContactPoint.cdm.json)|Contact details for an organization or a particular human that is responsible for the device.|
|[DeviceMetric](DeviceMetric.cdm.json)|Describes a measurement, calculation or setting capability of a medical device.|
|[DeviceMetricType](DeviceMetricType.cdm.json)|Describes the type of the metric. For example: Heart Rate, PEEP Setting, etc.|
|[DeviceRequest](DeviceRequest.cdm.json)|Represents a request for a patient to employ a medical device. The device may be an implantable device, or an external assistive device, such as a walker.|
|[DeviceRequestBasedOn](DeviceRequestBasedOn.cdm.json)|Plan/proposal/order fulfilled by this request.|
|[DeviceRequestDefinition](DeviceRequestDefinition.cdm.json)|Protocol or definition followed by this request.|
|[DeviceRequestPriorRequest](DeviceRequestPriorRequest.cdm.json)|The request takes the place of the referenced completed or terminated request(s).|
|[DeviceRequestReasonCode](DeviceRequestReasonCode.cdm.json)|Reason or justification for the use of this device.|
|[DeviceRequestReasonReference](DeviceRequestReasonReference.cdm.json)|Reason or justification for the use of this device.|
|[DeviceRequestRelevantHistory](DeviceRequestRelevantHistory.cdm.json)|Key events in the history of the request.|
|[DeviceRequestSupportingInfo](DeviceRequestSupportingInfo.cdm.json)|Additional clinical information about the patient that may influence the request fulfillment. For example, this may includes body where on the subject's the device will be used.|
|[DeviceSafety](DeviceSafety.cdm.json)|Provides additional safety characteristics about a medical device. For example devices containing latex.|
|[DeviceStatus](DeviceStatus.cdm.json)||
|[Dosage](Dosage.cdm.json)|Indicates how the medication is/was taken or should be taken by the patient.|
|[DosageAddInstruction](DosageAddInstruction.cdm.json)|Additional instruction such as "Swallow with plenty of water" which may or may not be coded.|
|[Encounter](Encounter.cdm.json)|An interaction between a patient and healthcare provider(s) for the purpose of providing healthcare service(s) or assessing the health status of a patient.|
|[EncounterAccount](EncounterAccount.cdm.json)|The set of accounts that may be used for billing for this Encounter.|
|[EncounterClassHistory](EncounterClassHistory.cdm.json)|The class history permits the tracking of the encounters transitions without needing to go through the entity history.|
|[EncounterDiagnosis](EncounterDiagnosis.cdm.json)|The list of diagnosis relevant to this encounter.|
|[EncounterEpisodeOfCare](EncounterEpisodeOfCare.cdm.json)|Where a specific encounter should be classified as a part of a specific episode(s) of care this field should be used.|
|[EncounterHospitalizationArrangement](EncounterHospitalizationArrangement.cdm.json)|Any special requests that have been made for this hospitalization encounter, such as the provision of specific equipment or other things.|
|[EncounterHospitalizationCourtesy](EncounterHospitalizationCourtesy.cdm.json)|Special courtesies (VIP, board member).|
|[EncounterHospitalizationDiet](EncounterHospitalizationDiet.cdm.json)|Used to track patient's diet restrictions and/or preference.|
|[EncounterLocation](EncounterLocation.cdm.json)|List of locations where the patient has been during this encounter.|
|[EncounterParticipant](EncounterParticipant.cdm.json)|The list of people responsible for providing the service.|
|[EncounterParticipantType](EncounterParticipantType.cdm.json)|The participant type indicates how an individual participates in an encounter.|
|[EncounterReason](EncounterReason.cdm.json)|Reason the encounter takes place, expressed as a code. For admissions, this can be used for a coded admission diagnosis.|
|[EncounterReferralRequest](EncounterReferralRequest.cdm.json)|The referral request this encounter satisfies (incoming referral).|
|[EncounterStatusHistory](EncounterStatusHistory.cdm.json)|The status history permits the encounter entity to contain the status history without needing to read through the historical versions of the entity, or even have the server store them|
|[EncounterType](EncounterType.cdm.json)|Specific type of encounter (e.g. e-mail consultation, surgical day-care, skilled nursing, rehabilitation).|
|[Endpoint](Endpoint.cdm.json)|The technical details of an endpoint that can be used for electronic services.This may include any security context information.|
|[EndpointContact](EndpointContact.cdm.json)|Contact details for a human to contact about the subscription. The primary use of this for system administrator troubleshooting.|
|[EndpointHeader](EndpointHeader.cdm.json)|Additional headers / information to send as part of the notification.|
|[EndpointPayloadMimeType](EndpointPayloadMimeType.cdm.json)|The mime type to send the payload in . If the mime type is not specified, then the sender could send any content .|
|[EndpointPayloadType](EndpointPayloadType.cdm.json)|The payload type describes the acceptable content that can be communicated on the endpoint.|
|[EpisodeOfCare](EpisodeOfCare.cdm.json)|An association between a patient and an organization / healthcare provider(s) during which time encounters may occur.|
|[EpisodeOfCareAccount](EpisodeOfCareAccount.cdm.json)|The set of accounts that may be used for billing for this Episode Of Care.|
|[EpisodeOfCareCareTeam](EpisodeOfCareCareTeam.cdm.json)|The list of practitioners that may be facilitating this episode of care for specific purposes.|
|[EpisodeOfCareDiagnosis](EpisodeOfCareDiagnosis.cdm.json)|The list of diagnosis relevant to this episode of care.|
|[EpisodeOfCareHistory](EpisodeOfCareHistory.cdm.json)|The history of statuses that the Episode Of Care has been through (without requiring processing the history of the resource).|
|[EpisodeOfCareReferralRequest](EpisodeOfCareReferralRequest.cdm.json)|Referral Request(s) that are fulfilled by this Episode Of Care, incoming referrals.|
|[EpisodeOfCareType](EpisodeOfCareType.cdm.json)|A classification of the type of episode of care; e.g. specialist referral, disease management, type of funded care.|
|[FamilyMemberHistory](FamilyMemberHistory.cdm.json)|Significant health events and conditions for a person related to the patient relevant in the context of care for the patient.|
|[FamilyMemberHistoryCondition](FamilyMemberHistoryCondition.cdm.json)|The significant Conditions (or condition) that the family member had.|
|[FamilyMemberHistoryDefinition](FamilyMemberHistoryDefinition.cdm.json)|A protocol or questionnaire that was adhered to in whole or in part by this event.|
|[FamilyMemberHistoryReason](FamilyMemberHistoryReason.cdm.json)|Describes why the family member history occurred in coded or textual form.|
|[FamilyMemberHistoryReasonReference](FamilyMemberHistoryReasonReference.cdm.json)|Indicates a Condition, Observation, Allergy Intolerance, or Questionnaire Response that justifies this family member history event.|
|[Goal](Goal.cdm.json)|Describes the intended objective(s) for a patient, group or organization care|
|[GoalAddresses](GoalAddresses.cdm.json)|The identified conditions and other health record elements that are intended to be addressed by the goal.|
|[GoalCategory](GoalCategory.cdm.json)|Indicates a category the goal falls within.|
|[GoalOutcome](GoalOutcome.cdm.json)|Identifies the change (or lack of change) at the point when the status of the goal is assessed.|
|[GoalOutcomeReference](GoalOutcomeReference.cdm.json)|Details of what's changed (or not changed).|
|[HealthcareService](HealthcareService.cdm.json)|The details of a healthcare service available at a location.|
|[HealthcareServiceAvailableTime](HealthcareServiceAvailableTime.cdm.json)|A collection of times that the Service Site is available.|
|[HealthcareServiceCategory](HealthcareServiceCategory.cdm.json)|Identifies the broad category of service being performed or delivered.|
|[HealthcareServiceCharacteristic](HealthcareServiceCharacteristic.cdm.json)|Collection of characteristics (attributes).|
|[HealthcareServiceCoverageArea](HealthcareServiceCoverageArea.cdm.json)|The location(s) that this service is available to (not where the service is provided).|
|[HealthcareServiceEndpoint](HealthcareServiceEndpoint.cdm.json)|Technical endpoints providing access to services operated for the specific healthcare services defined at this entity.|
|[HealthcareServiceLocation](HealthcareServiceLocation.cdm.json)|The location(s) where this healthcare service may be provided.|
|[HealthcareServiceProgramName](HealthcareServiceProgramName.cdm.json)|Program Names that can be used to categorize the service.|
|[HealthcareServiceProvision](HealthcareServiceProvision.cdm.json)|The code(s) that detail the conditions under which the healthcare service is available/offered.|
|[HealthcareServiceReferralMethod](HealthcareServiceReferralMethod.cdm.json)|Ways that the service accepts referrals, if this is not provided then it is implied that no referral is required.|
|[HealthcareServiceSpecialty](HealthcareServiceSpecialty.cdm.json)|Collection of specialties handled by the service site.|
|[HealthcareServiceTelecom](HealthcareServiceTelecom.cdm.json)|List of contacts related to this specific healthcare service.|
|[Location](Location.cdm.json)|Details and position information for a physical place where services are provided and resources and participants may be stored, found, contained or accommodated.|
|[LocationEndPoint](LocationEndPoint.cdm.json)|Technical endpoints providing access to services operated for the location.|
|[LocationTelecom](LocationTelecom.cdm.json)|The contact details of communication devices available at the location. This can include phone numbers, fax numbers, mobile numbers, email addresses and web sites.|
|[MedicalIdentifier](MedicalIdentifier.cdm.json)||
|[Medication](Medication.cdm.json)|Medications|
|[MedicationAdministration](MedicationAdministration.cdm.json)|Describes the event of a patient consuming or otherwise being administered a medication.|
|[MedicationAdministrationDefinition](MedicationAdministrationDefinition.cdm.json)|A protocol, guideline, order set or other definition that was adhered to in whole or in part by this event.|
|[MedicationAdministrationDevice](MedicationAdministrationDevice.cdm.json)|The device used in administering the medication to the patient. For example, a particular infusion pump.|
|[MedicationAdministrationEventHistory](MedicationAdministrationEventHistory.cdm.json)|A summary of the events of interest that have occurred, such as when the administration was verified.|
|[MedicationAdministrationPartOf](MedicationAdministrationPartOf.cdm.json)|A larger event of which this particular event is a component or step.|
|[MedicationAdministrationPerformer](MedicationAdministrationPerformer.cdm.json)|The individual who was responsible for giving the medication to the patient.|
|[MedicationAdministrationReasonCode](MedicationAdministrationReasonCode.cdm.json)|A code indicating why the medication was given.|
|[MedicationAdministrationReasonNotGiven](MedicationAdministrationReasonNotGiven.cdm.json)|A code indicating why the administration was not performed.|
|[MedicationAdministrationReasonReference](MedicationAdministrationReasonReference.cdm.json)|Condition or observation that supports why the medication was administered.|
|[MedicationAdministrationSupportingInformation](MedicationAdministrationSupportingInformation.cdm.json)|Additional information (for example, patient height and weight) that supports the administration of the medication.|
|[MedicationCode](MedicationCode.cdm.json)||
|[MedicationForm](MedicationForm.cdm.json)|Describes the form of the item. Powder; tablets; capsule.|
|[MedicationImage](MedicationImage.cdm.json)|Photo(s) or graphic representation(s) of the medication.|
|[MedicationIngredient](MedicationIngredient.cdm.json)|Identifies a particular constituent of interest in the product.|
|[MedicationPackageBatch](MedicationPackageBatch.cdm.json)|Information about a group of medication produced or packaged from one production run.|
|[MedicationPackageContent](MedicationPackageContent.cdm.json)|A set of components that go to make up the described item.|
|[MedicationRequest](MedicationRequest.cdm.json)|An order or request for both supply of the medication and the instructions for administration of the medication to a patient.|
|[MedicationRequestBasedOn](MedicationRequestBasedOn.cdm.json)|A plan or request that is fulfilled in whole or in part by this medication request.|
|[MedicationRequestDefinition](MedicationRequestDefinition.cdm.json)|Protocol or definition followed by this request.|
|[MedicationRequestDetectedIssue](MedicationRequestDetectedIssue.cdm.json)|Indicates an actual or potential clinical issue with or between one or more active or proposed clinical actions for a patient; e.g. Drug-drug interaction, duplicate therapy, dosage alert etc.|
|[MedicationRequestDosageInstruction](MedicationRequestDosageInstruction.cdm.json)|Indicates how the medication is to be used by the patient.|
|[MedicationRequestEventHistory](MedicationRequestEventHistory.cdm.json)|Links to Provenance records for past versions of this entity that identify key state transitions or updates that are likely to be relevant to user looking at the current version of the entity.|
|[MedicationRequestReasonCode](MedicationRequestReasonCode.cdm.json)|The reason or the indication for ordering the medication.|
|[MedicationRequestReasonReference](MedicationRequestReasonReference.cdm.json)|Condition or observation that supports why the medication was ordered.|
|[MedicationRequestSupportingInfo](MedicationRequestSupportingInfo.cdm.json)|Include additional information (for example, patient height and weight) that supports the ordering of the medication.|
|[NutritionOrder](NutritionOrder.cdm.json)|A request to supply a diet, formula feeding (eternal) or oral nutritional supplement to a patient/resident.|
|[NutritionOrderAllergyIntolerance](NutritionOrderAllergyIntolerance.cdm.json)|A link to a record of allergies or intolerance which should be included in the nutrition order.|
|[NutritionOrderEnteralFormulaAdministration](NutritionOrderEnteralFormulaAdministration.cdm.json)|Formula administration instructions as structured data. This repeating structure allows for changing the administration rate or volume over time for both bolus and continuous feeding.|
|[NutritionOrderExcludeFoodModifier](NutritionOrderExcludeFoodModifier.cdm.json)|This modifier is used to convey order-specific modifiers about the type of food that should NOT be given. These can be derived from patient allergies, intolerance, or preferences such as No Red Meat,|
|[NutritionOrderFoodPreferenceModifier](NutritionOrderFoodPreferenceModifier.cdm.json)|This modifier is used to convey order-specific modifiers about the type of food that should be given. These can be derived from patient allergies, intolerance, or preferences.|
|[NutritionOrderOralDietFluidConsistencyType](NutritionOrderOralDietFluidConsistencyType.cdm.json)|The required consistency (e.g. honey-thick, nectar-thick, thin, thickened.) of liquids or fluids served to the patient.|
|[NutritionOrderOralDietNutrient](NutritionOrderOralDietNutrient.cdm.json)|Class that defines the quantity and type of nutrient modifications (for example carbohydrate, fiber or sodium) required for the oral diet.|
|[NutritionOrderOralDietSchedule](NutritionOrderOralDietSchedule.cdm.json)|The time period and frequency at which the diet should be given. The diet should be given for the combination of all schedules if more than one schedule is present.|
|[NutritionOrderOralDietTexture](NutritionOrderOralDietTexture.cdm.json)|Class that describes any texture modifications required for the patient to safely consume various types of solid foods.|
|[NutritionOrderOralDietType](NutritionOrderOralDietType.cdm.json)|The kind of diet or dietary restriction such as fiber restricted diet or diabetic diet.|
|[NutritionOrderSupplement](NutritionOrderSupplement.cdm.json)|Oral nutritional products given in order to add further nutritional value to the patient's diet.|
|[NutritionOrderSupplementSchedule](NutritionOrderSupplementSchedule.cdm.json)|The time period and frequency at which the supplement(s) should be given. The supplement should be given for the combination of all schedules if more than one schedule is present.|
|[Observation](Observation.cdm.json)|Measurements and simple assertions made about a patient, device or other subject.|
|[ObservationBasedOn](ObservationBasedOn.cdm.json)|A plan, proposal or order that is fulfilled in whole or in part by this event.|
|[ObservationCategory](ObservationCategory.cdm.json)|A code that classifies the general type of observation being made.|
|[ObservationCode](ObservationCode.cdm.json)|Describes what was observed.|
|[ObservationComponent](ObservationComponent.cdm.json)|Some observations have multiple component observations. These component observations are expressed as separate code value pairs that share the same attributes.|
|[ObservationComponentReferenceRange](ObservationComponentReferenceRange.cdm.json)|Guidance on how to interpret the value by comparison to a normal or recommended range.|
|[ObservationInterpretation](ObservationInterpretation.cdm.json)|The assessment made based on the result of the observation.|
|[ObservationMethod](ObservationMethod.cdm.json)|Indicates the mechanism used to perform the observation.|
|[ObservationPerformer](ObservationPerformer.cdm.json)|Who was responsible for asserting the observed value as "true".|
|[ObservationReferenceRange](ObservationReferenceRange.cdm.json)|Guidance on how to interpret the value by comparison to a normal or recommended range.|
|[ObservationReferenceRangeAppliesTo](ObservationReferenceRangeAppliesTo.cdm.json)|Codes to indicate the target population this reference range applies to. For example, a reference range may be based on the normal population or a particular sex or race.|
|[ObservationRelatedResource](ObservationRelatedResource.cdm.json)|A reference to another entity(usually another Observation) whose relationship is defined by the relationship type code.|
|[PlanDefinition](PlanDefinition.cdm.json)|This entity allows for the definition of various types of plans as a shareable, consumable, and executable artifact.|
|[PlanDefinitionAction](PlanDefinitionAction.cdm.json)|An action to be taken as part of the plan.|
|[PlanDefinitionActionAction](PlanDefinitionActionAction.cdm.json)|Sub actions that are contained within the action. The behavior of this action determines the functionality of the sub-actions.|
|[PlanDefinitionActionArtifact](PlanDefinitionActionArtifact.cdm.json)|Didactic or other informational entities associated with the action that can be provided to the CDS recipient. Information entities can include inline text commentary and links to web resources.|
|[PlanDefinitionActionCode](PlanDefinitionActionCode.cdm.json)|A code that provides meaning for the action or action group. For example, a section may have a LOINC code for a the section of a documentation template.|
|[PlanDefinitionActionCondition](PlanDefinitionActionCondition.cdm.json)|An expression that describes applicability criteria, or start/stop conditions for the action.|
|[PlanDefinitionActionDynamicValue](PlanDefinitionActionDynamicValue.cdm.json)|Customization that should be applied to the statically defined entity.|
|[PlanDefinitionActionGoal](PlanDefinitionActionGoal.cdm.json)|Identifies goals that this action supports. The reference must be to a goal element defined within this plan definition.|
|[PlanDefinitionActionInput](PlanDefinitionActionInput.cdm.json)|Defines input data requirements for the action.|
|[PlanDefinitionActionOutput](PlanDefinitionActionOutput.cdm.json)|Defines the outputs of the action, if any.|
|[PlanDefinitionActionReason](PlanDefinitionActionReason.cdm.json)|A description of why this action is necessary or appropriate.|
|[PlanDefinitionActionRelatedAction](PlanDefinitionActionRelatedAction.cdm.json)|A relationship to another action such as "before" or "30-60 minutes after start of".|
|[PlanDefinitionActionTriggerDefinition](PlanDefinitionActionTriggerDefinition.cdm.json)|A description of when the action should be triggered.|
|[PlanDefinitionArtifact](PlanDefinitionArtifact.cdm.json)|Related artifacts such as additional documentation, justification, or bibliographic references.|
|[PlanDefinitionContributor](PlanDefinitionContributor.cdm.json)|A contributor to the content of the asset, including authors, editors, reviewers, and endorsers.|
|[PlanDefinitionContributorContact](PlanDefinitionContributorContact.cdm.json)|Contact details to assist a user in finding and communicating with the contributor.|
|[PlanDefinitionGoal](PlanDefinitionGoal.cdm.json)|Goals that describe what the activities within the plan are intended to achieve.|
|[PlanDefinitionGoalAddresses](PlanDefinitionGoalAddresses.cdm.json)|Identifies problems, conditions, issues, or concerns the goal is intended to address.|
|[PlanDefinitionGoalArtifact](PlanDefinitionGoalArtifact.cdm.json)|Didactic or other informational resources associated with the goal that provide further supporting information about the goal. Information resources can include inline text commentary and links to web|
|[PlanDefinitionGoalTarget](PlanDefinitionGoalTarget.cdm.json)|Indicates what should be done and within what time frame.|
|[PlanDefinitionJurisdiction](PlanDefinitionJurisdiction.cdm.json)|A legal or geographic region in which the plan definition is intended to be used.|
|[PlanDefinitionLibrary](PlanDefinitionLibrary.cdm.json)|A reference to a Library entity containing any formal logic used by the plan definition.|
|[PlanDefinitionParticipant](PlanDefinitionParticipant.cdm.json)|Indicates who should participate in performing the action described.|
|[PlanDefinitionTopic](PlanDefinitionTopic.cdm.json)|Descriptive topics related to the content of the plan definition. Topics provide a high-level categorization of the definition that can be useful for filtering and searching.|
|[PlanDefinitionUseContext](PlanDefinitionUseContext.cdm.json)|The content was developed with a focus and intent of supporting the contexts that are listed. These terms may be used to assist with indexing and searching for appropriate plan definition instances.|
|[PractitionerQualification](PractitionerQualification.cdm.json)|Qualifications obtained by training and certification.|
|[PractitionerRole](PractitionerRole.cdm.json)|A specific set of Roles/Locations/specialties/services that a practitioner may perform at an organization for a period of time.|
|[PractitionerRoleAvailableTime](PractitionerRoleAvailableTime.cdm.json)|A collection of times that the Service Site is available.|
|[PractitionerRoleCode](PractitionerRoleCode.cdm.json)|Roles which this practitioner is authorized to perform for the organization.|
|[PractitionerRoleEndPoint](PractitionerRoleEndPoint.cdm.json)|Technical endpoints providing access to services operated for the practitioner with this role.|
|[PractitionerRoleHealthcareService](PractitionerRoleHealthcareService.cdm.json)|The list of healthcare services that this worker provides for this role's Organization/Location(s).|
|[PractitionerRoleLocation](PractitionerRoleLocation.cdm.json)|The location(s) at which this practitioner provides care.|
|[PractitionerRoleSpecialty](PractitionerRoleSpecialty.cdm.json)|Specific specialty of the practitioner.|
|[PractitionerRoleTelecom](PractitionerRoleTelecom.cdm.json)|Contact details that are specific to the role/location/service.|
|[PractitionerSpecialty](PractitionerSpecialty.cdm.json)|Specific specialty of the practitioner.|
|[Procedure](Procedure.cdm.json)|An action that is or was performed on a patient. This can be a physical intervention like an operation, or less invasive like counseling or hypnotherapy.|
|[ProcedureBasedOn](ProcedureBasedOn.cdm.json)|A reference to a resource that contains details of the request for this procedure.|
|[ProcedureBodySite](ProcedureBodySite.cdm.json)|Detailed and structured anatomical location information. Multiple locations are allowed - e.g. multiple punch biopsies of a lesion.|
|[ProcedureCode](ProcedureCode.cdm.json)||
|[ProcedureComplication](ProcedureComplication.cdm.json)|Any complications that occurred during the procedure, or in the immediate post-performance period.|
|[ProcedureComplicationDetail](ProcedureComplicationDetail.cdm.json)|Any complications that occurred during the procedure, or in the immediate post-performance period.|
|[ProcedureDefinition](ProcedureDefinition.cdm.json)|A protocol, guideline, order set or other definition that was adhered to in whole or in part by this procedure.|
|[ProcedureFocalDevice](ProcedureFocalDevice.cdm.json)|A device that is implanted, removed or otherwise manipulated (calibration, battery replacement, fitting a prosthesis, attaching a wound-vac, etc.) as a focal portion of the Procedure.|
|[ProcedureFollowUp](ProcedureFollowUp.cdm.json)|If the procedure required specific follow up - e.g. removal of sutures. The followup may be represented as a simple note.|
|[ProcedurePartOf](ProcedurePartOf.cdm.json)|A larger event of which this particular procedure is a component or step.|
|[ProcedurePerformer](ProcedurePerformer.cdm.json)|Limited to 'real' people rather than equipment.|
|[ProcedureReason](ProcedureReason.cdm.json)|The coded reason why the procedure was performed. This may be coded entity of some type, or may simply be present as text.|
|[ProcedureReasonReference](ProcedureReasonReference.cdm.json)|The condition that is the reason why the procedure was performed.|
|[ProcedureReport](ProcedureReport.cdm.json)|Procedure report could represent histology result, pathology report, surgical report, etc.|
|[ProcedureRequest](ProcedureRequest.cdm.json)|A record of a request for diagnostic investigations, treatments, or operations to be performed.|
|[ProcedureRequestBasedOn](ProcedureRequestBasedOn.cdm.json)|Plan/proposal/order fulfilled by this request.|
|[ProcedureRequestBodySite](ProcedureRequestBodySite.cdm.json)|Anatomic location where the procedure should be performed. This is the target site.|
|[ProcedureRequestCategory](ProcedureRequestCategory.cdm.json)|A code that classifies the procedure for searching, sorting and display purposes (e.g. "Surgical Procedure").|
|[ProcedureRequestDefinition](ProcedureRequestDefinition.cdm.json)|Protocol or definition followed by this request.|
|[ProcedureRequestReasonCode](ProcedureRequestReasonCode.cdm.json)|An explanation or justification for why this diagnostic investigation is being requested in coded or textual form. This is often for billing purposes. May relate to the resources referred to in supp|
|[ProcedureRequestReasonReference](ProcedureRequestReasonReference.cdm.json)|Indicates another resource that provides a justification for why this diagnostic investigation is being requested. May relate to the resources referred to in supporting Information.|
|[ProcedureRequestRelevantHistory](ProcedureRequestRelevantHistory.cdm.json)|Key events in the history of the request.|
|[ProcedureRequestReplace](ProcedureRequestReplace.cdm.json)|The request takes the place of the referenced completed or terminated request(s).|
|[ProcedureRequestSpecimen](ProcedureRequestSpecimen.cdm.json)|One or more specimens that the laboratory procedure will use.|
|[ProcedureRequestSupportingInformation](ProcedureRequestSupportingInformation.cdm.json)|Additional clinical information about the patient or specimen that may influence the procedure or diagnostics or their interpretations.|
|[ProcedureUsedCode](ProcedureUsedCode.cdm.json)|Identifies coded items that were used as part of the procedure.|
|[ProcedureUsedReference](ProcedureUsedReference.cdm.json)|Identifies medications, devices and any other substance used as part of the procedure.|
|[ReferenceRangeAppliesTo](ReferenceRangeAppliesTo.cdm.json)||
|[ReferralRequest](ReferralRequest.cdm.json)|Used to record and send details about a request for referral service or transfer of a patient to the care of another provider or provider organization.|
|[ReferralRequestBasedOn](ReferralRequestBasedOn.cdm.json)|Indicates any plans, proposals or orders that this request is intended to satisfy - in whole or in part.|
|[ReferralRequestDefinition](ReferralRequestDefinition.cdm.json)|A protocol, guideline, order set or other definition that is adhered to in whole or in part by this request.|
|[ReferralRequestReasonCode](ReferralRequestReasonCode.cdm.json)|Description of clinical condition indicating why referral/transfer of care is requested.|
|[ReferralRequestReasonReference](ReferralRequestReasonReference.cdm.json)|Indicates another resource whose existence justifies this request.|
|[ReferralRequestRecipient](ReferralRequestRecipient.cdm.json)|The healthcare provider(s) or provider organization(s) who/which is to receive the referral/transfer of care request.|
|[ReferralRequestRelevantHistory](ReferralRequestRelevantHistory.cdm.json)|Links to Provenance records for past versions of this entity or fulfilling request or event resources.|
|[ReferralRequestReplace](ReferralRequestReplace.cdm.json)|Completed or terminated request(s) whose function is taken by this new request.|
|[ReferralRequestServiceRequested](ReferralRequestServiceRequested.cdm.json)|The service(s) that is/are requested to be provided to the patient. For example: cardiac pacemaker insertion.|
|[ReferralRequestSupportingInformation](ReferralRequestSupportingInformation.cdm.json)|Any additional (administrative, financial or clinical) information required to support request for referral or transfer of care.|
|[RelatedPerson](RelatedPerson.cdm.json)|Information about a person that is involved in the care for a patient, but who is not the target of healthcare, nor has a formal responsibility in the care process.|
|[RequestGroup](RequestGroup.cdm.json)|A group of related requests that can be used to capture intended activities that have inter-dependencies such as "give this medication after that one".|
|[RequestGroupAction](RequestGroupAction.cdm.json)|The actions, if any, produced by the evaluation of the artifact.|
|[RequestGroupActionAction](RequestGroupActionAction.cdm.json)|Sub actions.|
|[RequestGroupActionCode](RequestGroupActionCode.cdm.json)|A code that provides meaning for the action or action group. For example, a section may have a LOINC code for a the section of a documentation template.|
|[RequestGroupActionCondition](RequestGroupActionCondition.cdm.json)|An expression that describes applicability criteria, or start/stop conditions for the action.|
|[RequestGroupActionDocumentation](RequestGroupActionDocumentation.cdm.json)|Didactic or other informational resources associated with the action that can be provided to the CDS recipient. Information resources can include inline text commentary and links to web resources.|
|[RequestGroupActionParticipant](RequestGroupActionParticipant.cdm.json)|The participant that should perform or be responsible for this action.|
|[RequestGroupActionRelatedAction](RequestGroupActionRelatedAction.cdm.json)|A relationship to another action such as "before" or "30-60 minutes after start of".|
|[RequestGroupBasedOn](RequestGroupBasedOn.cdm.json)|A plan, proposal or order that is fulfilled in whole or in part by this request.|
|[RequestGroupDefinition](RequestGroupDefinition.cdm.json)|A protocol, guideline, order set or other definition that is adhered to in whole or in part by this request.|
|[RequestGroupReplace](RequestGroupReplace.cdm.json)|Completed or terminated request(s) whose function is taken by this new request.|
|[RiskAssessment](RiskAssessment.cdm.json)|An assessment of the likely outcome(s) for a patient or other subject as well as the likelihood of each outcome.|
|[RiskAssessmentBasis](RiskAssessmentBasis.cdm.json)|Indicates the source data considered as part of the assessment (Family History, Observations, Procedures, Conditions, etc.).|
|[RiskAssessmentPrediction](RiskAssessmentPrediction.cdm.json)|Describes the expected outcome for the subject.|
|[Schedule](Schedule.cdm.json)|A container for slots of time that may be available for booking appointments.|
|[ScheduleActor](ScheduleActor.cdm.json)|The specialty of a practitioner that would be required to perform the service requested in this appointment.|
|[ScheduleServiceType](ScheduleServiceType.cdm.json)|The specific service that is to be performed during this appointment.|
|[ScheduleSpecialty](ScheduleSpecialty.cdm.json)|A container for slots of time that may be available for booking appointments.|
|[Slot](Slot.cdm.json)|A slot of time on a schedule that may be available for booking appointments.|
|[SlotServiceType](SlotServiceType.cdm.json)|The type of appointments that can be booked into this slot. If provided then this overrides the value provided on the availability resource.|
|[SlotSpecialty](SlotSpecialty.cdm.json)|The specialty of a practitioner that would be required to perform the service requested in this appointment.|
|[Specimen](Specimen.cdm.json)|A sample to be used for analysis.|
|[SpecimenContainer](SpecimenContainer.cdm.json)|The container holding the specimen. The recursive nature of containers; i.e. blood in tube in tray in rack is not addressed here.|
|[SpecimenParent](SpecimenParent.cdm.json)|Reference to the parent (source) specimen which is used when the specimen was either derived from or a component of another specimen.|
|[SpecimenProcessing](SpecimenProcessing.cdm.json)|Details concerning processing and processing steps for the specimen.|
|[SpecimenProcessingAdditive](SpecimenProcessingAdditive.cdm.json)|Material used in the processing step.|
|[SpecimenRequest](SpecimenRequest.cdm.json)|Details concerning a test or procedure request that required a specimen to be collected.|
|[Substance](Substance.cdm.json)|A homogeneous material with a definite composition.|
|[SubstanceCategory](SubstanceCategory.cdm.json)|A code that classifies the general type of substance. This is used for searching, sorting and display purposes.|
|[SubstanceIngredient](SubstanceIngredient.cdm.json)|A substance can be composed of other substances.|
|[SubstanceInstance](SubstanceInstance.cdm.json)|Substance may be used to describe a kind of substance, or a specific package/container of the substance: an instance.|
|[Task](Task.cdm.json)|Generic activity representing work needed to be done.|
|[TaskBasedOn](TaskBasedOn.cdm.json)|BasedOn refers to a higher-level authorization that triggered the creation of the task. It references a "request" entity such as a ProcedureRequest, MedicationRequest, ProcedureRequest, CarePlan, etc|
|[TaskInput](TaskInput.cdm.json)|Additional information that may be needed in the execution of the task.|
|[TaskOutput](TaskOutput.cdm.json)|Outputs produced by the Task.|
|[TaskPartOf](TaskPartOf.cdm.json)|Task that this particular task is part of.|
|[TaskPerformerType](TaskPerformerType.cdm.json)|The type of participant that can execute the task.|
|[TaskRelevantHistory](TaskRelevantHistory.cdm.json)|Links to Provenance records for past versions of this Task that identify key state transitions or updates that are likely to be relevant to a user looking at the current version of the task.|
|[TaskRestrictionRecipient](TaskRestrictionRecipient.cdm.json)|For requests that are targeted to more than on potential recipient/target, for whom is fulfillment sought.|
|[Timing](Timing.cdm.json)|Specifies an event that may occur multiple times. Timing schedules are used to record when things are planned, expected or requested to occur.|
|[TimingDayOfWeek](TimingDayOfWeek.cdm.json)|If one or more days of week is provided, then the action happens only on the specified day(s).|
|[TimingEvent](TimingEvent.cdm.json)|Identifies specific times when the event occurs.|
|[TimingTimeOfDay](TimingTimeOfDay.cdm.json)|Specified time of day for action to take place.|
|[TimingWhen](TimingWhen.cdm.json)|Real world events that the occurrence of the event should be tied to.|
|[VisionPrescription](VisionPrescription.cdm.json)|An authorization for the supply of glasses and/or contact lenses to a patient.|
|[VisionPrescriptionDispense](VisionPrescriptionDispense.cdm.json)|Deals with details of the dispense part of the supply specification.|
