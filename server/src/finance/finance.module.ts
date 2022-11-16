import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppModule } from 'src/app/app.module';
import { ContractSchema } from 'src/schemas/contract.schema';
import { PriceSchema } from 'src/schemas/price.schema';
import { RecordSchema } from 'src/schemas/record.schema';
import { CompanySchema } from 'src/schemas/company.schema';
import { StoreModule } from 'src/store/store.module';
import { StoreService } from 'src/store/store.service';
import { ContractController } from './contract/contract.controller';
import { ContractService } from './contract/contract.service';
import { CompanyService } from './company/company.service';
import { CompanyController } from './company/company.controller';
import { SubjectModule } from './subject/subject.module';
import { InvoiceModule } from './invoice/invoice.module';
import { LoanModule } from './loan/loan.module';
import { RuleModule } from './rule/rule.module';

@Module({
  imports: [
    StoreModule,
    MongooseModule.forFeature([
      { name: 'Contract', schema: ContractSchema },
      { name: 'Price', schema: PriceSchema },
      { name: 'Record', schema: RecordSchema },
      { name: 'Company', schema: CompanySchema },
    ]),
    forwardRef(() => AppModule),
    SubjectModule,
    InvoiceModule,
    LoanModule,
    RuleModule,
  ],
  controllers: [ContractController, CompanyController],
  providers: [ContractService, CompanyService,StoreService]
})
export class FinanceModule {}
