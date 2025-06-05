const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const DashboardUsers = require("../models/DashboardUsers");
const { registerSchema, loginSchema } = require("../validations/auth.validation");

const register = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, password } = req.body;

    try {
        const existingDashboardUsers = await DashboardUsers.findOne({ email });
        if (existingDashboardUsers) return res.status(403).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newDashboardUsers = new DashboardUsers({
            name,
            email,
            password: hashedPassword,
            role: "Manager",
            approved: false // Wait for Admin approval
        });

        await newDashboardUsers.save();

        res.status(201).json({ message: "DashboardUsers registered successfully. Awaiting admin approval." });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const login = async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    try {
        const user = await DashboardUsers.findOne({ email });
        if (!user) return res.status(403).json({ message: "Invalid email!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(403).json({ message: "Invalid password!" });

        if (!user.approved)
            return res.status(403).json({ message: "Your account is not approved by Admin yet." });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || "secret123",
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    login,
    register
};
