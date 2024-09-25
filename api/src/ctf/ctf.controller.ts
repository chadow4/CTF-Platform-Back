import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CtfService } from "./ctf.service";
import { CreateCtfDto } from "./dtos/create-ctf.dto";

@Controller("ctf")
export class CtfController {
  constructor(private readonly ctfService: CtfService) {}

  @Get()
  async findAll() {
    try {
      return await this.ctfService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async create(@Body() createCtfDto: CreateCtfDto) {
    try {
      return await this.ctfService.create(createCtfDto);
    } catch (error) {
      throw error;
    }
  }

  @Get("launch/:id")
  async launch(@Param("id") id: number) {
    try {
      const url = await this.ctfService.launchCTF(id);
      return { message: "CTF lancé avec succès !", url };
    } catch (error) {
      throw error;
    }
  }
}
