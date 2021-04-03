/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product } from "./product.model";

// To make ProductsService class injectable we have used @Injectable() decorator. Service contains the implementation of the Rest methods.
// You can write the implementation of Rest methods itself in the controller only but to keep the controller clean and lean we generally
// write the logic part in the Service.
@Injectable()
export class ProductsService {

    // @InjectModel decorator will tell that you want to inject mongoose module. Mongoose created 'productModel' instance.
    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {

    }

    private alterObject(product: Product): {
        id: String,
        title: String,
        description: String,
        price: Number
    } {
        return {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price
        };
    }

    async insertProduct(title: string, description: string, price: number): Promise<String> {
        const newProduct = new this.productModel({title, description, price});

        const res = await newProduct.save();

        return res.id;
    }   

    async getProducts(): Promise<Product[]> {
        // A tiny improvement is to add .exec() at last so that find() returns a real promise.
        const products = await this.productModel.find().exec();

        // console.log(produ  cts);

        return (products.map(this.alterObject)) as Product[];
    }

    async getSingleProduct(prodId: string) {
        return this.alterObject(await this.findProduct(prodId));
    }

    async updateProduct(id: string, title: string, description: string, price: number): Promise<Product> {
        const updatedProduct = await this.findProduct(id);

        if(title) {
            updatedProduct.title = title;
        }
        
        if(description) {
            updatedProduct.description = description;
        }

        if(price) {
            updatedProduct.price = price;
        }

        updatedProduct.save();

        return (this.alterObject(updatedProduct)) as Product;
    }

    async deleteProduct(prodId: string) {
        try {
            const res = await this.productModel.deleteOne({_id: prodId}).exec();

            if(res.deletedCount === 0) {
                throw new Error('No product could have been found');
            }

        } catch(error) {
            throw new NotFoundException(error.message || 'Could not find the product');
        }
    }

    private async findProduct(prodId: string): Promise<Product> {
        let product: Product;

        try {
            product = await this.productModel.findOne({_id: prodId});
            
            if(!product) {
                throw new Error('No product could have been found');
            }

        } catch(error) {
            throw new NotFoundException(error.message || 'Could not find the product');
        }
        
        return product;
    }
}