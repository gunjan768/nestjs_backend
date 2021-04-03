/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common"; 
import { MongooseModule } from "@nestjs/mongoose";
import { ProductSchema } from "./product.model";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

// AppModules need the Product. We need to let NestJs to know about this module to make it work as NestJs doesn't automatically scan all the 
// files instead we should be very clear about the app structure.
@Module({
    // name is the model name
    imports: [MongooseModule.forFeature([{ 
        name: 'Product',
        schema: ProductSchema
    }])],
    controllers: [ProductsController],

    // For DI to work
    // eslint-disable-next-line prettier/prettier
    providers: [ProductsService],
})

export class ProductsModule {

}