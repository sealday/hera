import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import mongoose from "mongoose";

function loadedAtPlugin(schema: mongoose.Schema, options) {
  schema.virtual('loadedAt').
    get(function() { return this._loadedAt; }).
    set(function(v) { this._loadedAt = v; });

  schema.post(['find', 'findOne'], function(docs) {
    if (!Array.isArray(docs)) {
      docs = [docs];
    }
    console.log('here')
    const now = new Date();
    for (const doc of docs) {
      doc.loadedAt = now;
    }
  });

};

/**
 * TODO 分离测试数据库
 */
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectionFactory: (connection: any) => {
          console.log('init mongo connection.')
          return connection
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MongoConfigModule {}