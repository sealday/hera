import { Module } from '@nestjs/common';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Loan, LoanSchema } from 'src/schemas/loan.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Loan.name, schema: LoanSchema }])],
  controllers: [LoanController],
  providers: [LoanService]
})
export class LoanModule {}