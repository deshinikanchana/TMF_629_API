const EventHub = require('../Models/EventHub');

exports.registerListener = async (req, res) => {
    try {
        const { callback } = req.body;
        const existing = await EventHub.findOne({ callback });
        if (existing) return res.status(409).json({ message: "Already registered" });

        const hub = await EventHub.create({ callback });
        res.status(201).location(`/hub/${hub._id}`).json({ id: hub._id, callback: hub.callback });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.unregisterListener = async (req, res) => {
    try {
        const { id } = req.params;
        await EventHub.findByIdAndDelete(id);
        res.status(204).end();
    } catch (err) {
        res.status(404).json({ error: "Hub not found" });
    }
};
