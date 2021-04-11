import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppModule } from 'src/app/app.module';
import { ContractSchema } from 'src/schemas/contract.schema';
import { PriceSchema } from 'src/schemas/price.schema';
import { RecordSchema } from 'src/schemas/record.schema';
import { StoreModule } from 'src/store/store.module';
import { StoreService } from 'src/store/store.service';
import { ContractController } from './contract/contract.controller';
import { ContractService } from './contract/contract.service';

@Module({
  imports: [
    StoreModule,
    MongooseModule.forFeature([
      { name: 'Contract', schema: ContractSchema },
      { name: 'Price', schema: PriceSchema },
      { name: 'Record', schema: RecordSchema },
    ]),
    forwardRef(() => AppModule),
  ],
  controllers: [ContractController],
  providers: [ContractService, StoreService]
})
export class FinanceModule {}
