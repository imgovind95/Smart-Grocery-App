import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/profile
export const getUserProfile = async (req, res) => {
    // req.user is set by the 'protect' middleware
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role, // Include role in profile
            // Add address back if needed later
            // address: user.address,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // If you want to update password, add logic here
        // if (req.body.password) {
        //   user.password = req.body.password;
        // }

        // If you add address back later, uncomment this
        // if (req.body.address) {
        //     user.address.street = req.body.address.street || user.address.street;
        //     user.address.city = req.body.address.city || user.address.city;
        //     user.address.postalCode = req.body.address.postalCode || user.address.postalCode;
        //     user.address.state = req.body.address.state || user.address.state;
        // }

        try {
            const updatedUser = await user.save();
            // Send back updated info, maybe excluding password if you update it
             res.json({
                 _id: updatedUser._id,
                 name: updatedUser.name,
                 email: updatedUser.email,
                 role: updatedUser.role,
                 // address: updatedUser.address,
             });
        } catch (error) {
             console.error("Error saving user profile:", error);
             res.status(400).json({ message: 'Error updating profile', details: error.message }); // Send back more specific error if save fails
        }

    } else {
        res.status(404).json({ message: 'User not found' });
    }
};