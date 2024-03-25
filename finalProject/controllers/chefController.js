const Chef= require("../models/chefSchema");

exports.updateAvailability = async (req, res) => {
    try {
        const { chefID } = req.params;
        const { day, available } = req.body;

        const chef = await Chef.findById(chefID);
        if (!chef) {
            return res.status(404).json({ message: 'Chef not found' });
        }

        // Update the availability status of the specified day
        chef[day] = available;

        // Save the changes to the chef document
        await chef.save();

        return res.status(200).json({ message: 'Chef availability updated successfully', chef });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



