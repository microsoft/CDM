
# eventManagement


## Entities

|Name|Description|
|---|---|
|[Account](Account.md)|Business that represents a customer or potential customer. The company that is billed in business transactions.  |
|[Building](Building.md)|A single venue can be comprised of zero or more buildings where event activities are held. Each building in turn is comprised of zero or more rooms where event activities are held.  |
|[Event](Event.md)|Container to manage and plan marketing activities that take place at a specific venue or location.  |
|[Hotel](Hotel.md)|This represents a single hotel property (for e.g, Marriott in Bellevue). Each individual property belongs to a Hotel Group (e.g., Marriott) which is represented by an Account  |
|[HotelRoomAllocation](HotelRoomAllocation.md)|This entity records the number of rooms that are allocated from a single hotel for guests of a single event.  |
|[HotelRoomReservation](HotelRoomReservation.md)|Each record of this type tracks a single request made by an event attendee (through the registration portal) to reserve a hotel room from the available hotel allocations  |
|[Invitation](Invitation.md)|Send invitations to existing contacts or email addresses and assign them to web roles upon redemption.  |
|[Layout](Layout.md)|The layout entity is to provide users a quick way to specify the various different layouts that a single room can be arranged in and the maximum capacity of the room as a result of the change.  |
|[Pass](Pass.md)|Information about passes.  |
|[Room](Room.md)|A room is where a session may be held. A single room can be used in multiple different layouts which has a direct impact on the max. occupancy of the room.  |
|[Speaker](Speaker.md)|Speaker bios of individuals speaking at an event  |
|[SponsorableArticle](SponsorableArticle.md)|An item or a group of items that can be sponsored  |
|[Venue](Venue.md)|The Venue describes the location at which all event sessions and activities take place. A single event venue can be comprised of zero or more buildings, each of which can have zero or more rooms where sessions take place.  |
