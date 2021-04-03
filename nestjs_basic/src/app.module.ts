import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';

// These @Module simply bundles up the couple of controllers and providers (which controllers or other providers can use). You can have
// multiple modules and link all the modules using 'imports' array. Say if you are building an app for online shop you might have a module
// for a product, may for shopping cart, for user authentication etc.

// Note that class 'AppModule' is an empty class and it's implementation is provided by a decorator @Module. Services are scoped to the module.
// If you have multiple modules and you provide service in one module and then in all other modules this service will not be injected
// automatically.

// In imports we need to add ProductsController because we kind a depend on it. Ofcourse AppController doesn't use anything from the product
// controller but the AppModule needs the ProductsModule because this makes our entire app. We need to link our AppModule to other modules
// that also make our app.
@Module({
	imports: [ProductsModule, MongooseModule.forRoot('mongodb://localhost:27017/nestjs_mongodb')],
	controllers: [AppController],
	providers: [AppService]
})

export class AppModule {}