import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CtfService } from "./ctf.service";
import { CtfController } from "./ctf.controller";
import { Ctf } from "./ctf.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Ctf])],
  providers: [CtfService],
  controllers: [CtfController],
})
export class CtfModule {}
