import mongoose from 'mongoose';

const ProductSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter product name"],

        },
        quantity: {
            type: Number,
            required: true,
            default: 0
        },
        price: {
            type: Number,
            required: true,
            default: 0
        },
        image: {
            type: String,
            required: false
        },


    },
    {
        timestamps: true,
    }
);
const Equipment = mongoose.model("Equipment",ProductSchema);
export default Equipment;
