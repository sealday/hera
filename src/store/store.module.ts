import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppModule } from 'src/app/app.module';
import { PlanSchema } from 'src/schemas/plan.schema';
import { PriceSchema } from 'src/schemas/price.schema';
import { ProductSchema } from 'src/schemas/product.schema';
import { ProjectSchema } from 'src/schemas/project.schema';
import { RecordSchema } from 'src/schemas/record.schema';
import { Rule, RuleSchema } from 'src/schemas/rule.schema';

import { PlanController } from './plan/plan.controller';
import { PlanService } from './plan/plan.service';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';
import { RecordController } from './record/record.controller';
import { RecordService } from './record/record.service';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Record', schema: RecordSchema },
      { name: 'Project', schema: ProjectSchema },
      { name: 'Price', schema: PriceSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Plan', schema: PlanSchema },
    ]),
    forwardRef(() => AppModule),
  ],
  controllers: [RecordController, ProjectController, StoreController, ProductController, PlanController],
  providers: [RecordService, ProjectService, StoreService, ProductService, PlanService]
})
export class StoreModule {}
