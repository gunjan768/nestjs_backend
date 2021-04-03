/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ProductsService } from "./products.service";

// Controller contains the Rest methods.
@Controller('products')
export class ProductsController {
    
    constructor(private readonly productsService: ProductsService) {

    }

    @Post()
    async addProducts(
        @Body('title') prodTitle: string,
        @Body('description') prodDescription: string,
        @Body('price') prodPrice: number
    ) {

        const id =  await this.productsService.insertProduct(prodTitle, prodDescription, prodPrice);
        
        return {id};
    }

    @Get()
    async getAllProducts() {
        return await this.productsService.getProducts();
    }

    @Get(':id')
    getProduct(@Param('id') prodId: string) {
        return this.productsService.getSingleProduct(prodId);
    }

    // @Patch() : used to update the fields that have changed and @Put() : used to replace the entire document with the new one 
    @Patch(':id')
    async updateProduct(
        @Param('id') prodId: string,
        @Body('title') prodTitle: string,
        @Body('description') prodDescription: string,
        @Body('price') prodPrice: number
    ) {
        await this.productsService.updateProduct(prodId, prodTitle, prodDescription, prodPrice);

        return {message: 'Updated'};
    }

    @Delete(':id')
    async deleteProduct( @Param('id') prodId: string) {
        await this.productsService.deleteProduct(prodId);

        return {message: 'Deleted'};
    }
}