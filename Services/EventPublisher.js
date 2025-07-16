const axios = require('axios');
const EventHub = require('../Models/EventHub');

const buildEvent = (type, customer) => ({
    "@type": type,
    eventId: `${Date.now()}-${Math.random()}`,
    eventTime: new Date().toISOString(),
    eventType: type,
    event: { customer }
});

exports.publishEvent = async (type, customer) => {
    const hubs = await EventHub.find();
    const event = buildEvent(type, customer);

    for (const hub of hubs) {
        try {
            await axios.post(hub.callback, event, {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (err) {
            console.error(`Failed to notify ${hub.callback}:`, err.message);
        }
    }
};
