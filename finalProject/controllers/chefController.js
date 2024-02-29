const Chef= require("../models/chefSchema");
const menuItem= require("../models/menuItemSchema");

exports.addItem=async(req,res) => {
    try{
        const chef=await Chef.findById(req.params["chefId"]);
        if(!chef) {
            return res.status(401).json({message:"You are not authorized to add items."});
        }
        const Item= await menuItem.findById(req.body["itemName"]);
        if(!Item) {
            return res.status(401).json({message:"Item already exists"});
        }
        const newItem= await menuItem.create({
            itemName:req.body["itemName"],
            price:req.body["price"],
            description:req.body["description"],
            ingredients:req.body["ingredients"],
        });
        return res.status(201).json({data:newItem,message:"Item added successfully"});
    } catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
};

exports.deleteItem=async(req,res) => {
    try{
        const chef=await Chef.findById(req.params["chefId"]);
        if(!chef) {
            return res.status(404).json({message:"You are not authorized to delete items."});
        }
        const item=await menuItem.findById(req.params["menuItemID"]);
        if(!item) {
            return res.status(404).json({message:"Item not found"});
        }
        await item.deleteOne();
        return res.status(200).json({message:"Item deleted successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
};

exports.updateItem = async (req, res) => {
    try {
        const chef = await Chef.findById(req.params["chefId"]);
        if (!chef) {
            return res.status(401).json({ message: "You are not authorized to modify items." });
        }

        let item = await MenuItem.findById(req.params["menuItemId"]);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        item.itemName = req.body.itemName || item.itemName;
        item.price = req.body.price || item.price;
        item.description = req.body.description || item.description;
        item.ingredients = req.body.ingredients || item.ingredients;

        item = await item.save();

        return res.status(200).json({ data: item, message: "Item updated successfully" });
    } catch (err) {
        console.log(err);
    }
};

exports.updateAvailability = async (req, res) => {
    try {
        const chef = await Chef.findById(req.params.chefId);
        if (!chef) {
            return res.status(401).json({ message: "Chef not found" });
        }

        chef.daysAvailable = req.body.daysAvailable || chef.daysAvailable;

        await chef.save();

        return res.status(200).json({ data: chef, message: "Availability updated successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



