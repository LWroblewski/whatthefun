const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        required: 'User author the comment'
    },
    receiver: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
    ],
    metadata: {
        action: {
            type: String,
            enum: ['comment', 'likeComment', 'likeEvent', 'event'],
            required: 'Action type'
        },
        eventId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Events',
            required: 'Event id'
        }
    },
    read_by: [{
        readerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
        read_at: { type: Date, default: Date.now }
    }],
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notifications', NotificationSchema);
