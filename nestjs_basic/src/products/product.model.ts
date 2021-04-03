import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    }
});

// mongoose.Document : SO that our interface Product will have all the methods of mongoDB document like .save()
export interface Product extends mongoose.Document {
    
    id: String;
    title: String;
    description: String;
    price: number;
}