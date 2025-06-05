const DashboardUsers = require("../models/DashboardUsers");

const getDashboardUsers = async (req, res) => {
    try {
        const users = await DashboardUsers.find({ role: { $ne: "Admin" } }).select("-password");
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const approveUser = async (req, res) => {
    try {
        const user_id = req.params.id;

        if (!user_id) {
            return res.status(400).json({ message: "User id is missing in params." });
        }

        const user = await DashboardUsers.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.approved = true;
        await user.save();

        return res.status(200).json({ message: "User approved successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const deleteUser = async (req, res) => {
    const user_id = req.params.id;
    if (!user_id) {
        return res.status(400).json({ message: "User id is missing in params." });
    }

    try {
        const user = await DashboardUsers.findByIdAndDelete(user_id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    getDashboardUsers,
    approveUser,
    deleteUser
};
