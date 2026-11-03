import userModel from "../models/user.model.js";
 
export const getCurrentuser = async (req, res) => {
    try{
const userId = req.userId;
const user = await userModel.findById(userId);
if(!user){
    return res.status(404).json({ message: "User not found" });
}
res.status(200).json({ user });

    }catch(error){
        res.status(500).json({ error: error.message });
    }
}