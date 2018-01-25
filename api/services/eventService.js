const Event = require("../models/eventModel");
const errors = require("../errors/errors").errors;
const EventDTO = require("../dto/eventDTO.js");


module.exports = function(app) {
  const userService = require("./userService")(app);
  return {

    getEvents: async function() {
      try {
        const events = await Event.find({});
        const eventsDto = [];
        for (let i = 0; i < events.length; i++) {
          eventsDto.push(new EventDTO(events[i]));
        }
        return eventsDto;
      } catch (e) {
        throw errors.default.DEFAULT;
      }
    },

    getEvent: async function(eventId) {

    },

    getUserEvents: async function(userId) {

    },

    deleteEvent: async function(eventId) {

    },

    createEvent: async function(event) {
      if (event && event.event_type && event.owner && event.title) {
        try {
          const user = await userService.getUser(event.owner);
          const newEvent = new Event(event);
          const result = await newEvent.save();
          return new EventDTO(result);
        } catch (e) {
          throw e;
        }
      } else {
        throw errors.default.BAD_PARAMS;
      }
    }
  }

}
