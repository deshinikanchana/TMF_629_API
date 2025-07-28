// const axios = require('axios');
// const EventHub = require('../Models/EventHub');
//
// const buildEvent = (type, customer) => ({
//     "@type": type,
//     eventId: `${Date.now()}-${Math.random()}`,
//     eventTime: new Date().toISOString(),
//     eventType: type,
//     event: { customer }
// });
//
// exports.publishEvent = async (type, customer) => {
//     const hubs = await EventHub.find();
//     const event = buildEvent(type, customer);
//
//     for (const hub of hubs) {
//         try {
//             await axios.post(hub.callback, event, {
//                 headers: { 'Content-Type': 'application/json' }
//             });
//         } catch (err) {
//             console.error(`Failed to notify ${hub.callback}:`, err.message);
//         }
//     }
// };


// services/notificationService.js
const axios = require('axios');
const EventHub = require('../Models/EventHub');

// Build event in TMF-compatible format
const buildEvent = (type, customer) => ({
    "@type": type,
    eventId: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    eventTime: new Date().toISOString(),
    eventType: type,
    event: {
        customer
    }
});

// Publish event to all registered listeners
exports.publishEvent = async (type, customer) => {
    const hubs = await EventHub.find();
    if (hubs.length === 0) {
        console.log('ℹ️ No listeners to notify.');
        return;
    }

    const eventPayload = buildEvent(type, customer);

    for (const hub of hubs) {
        try {
            await axios.post(hub.callback, eventPayload, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log(`✅ Event sent to ${hub.callback}`);
        } catch (err) {
            console.error(`❌ Failed to notify ${hub.callback}:`, err.message);
        }
    }
};
