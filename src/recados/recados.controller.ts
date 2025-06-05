import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { SetRoutePolicy } from 'src/auth/decorators/set-route-policy.decorator';
import { RoutePolicies } from 'src/auth/enums/route-policies.enum';
import { RoutePolicyGuard } from 'src/auth/guards/route-policy.guard';

@Controller('recados')
@UseGuards(RoutePolicyGuard)
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  @Get()
  @SetRoutePolicy(RoutePolicies.findAllRecados)
 async findAll(@Query() paginationDto: PaginationDto) {
    const recados = await this.recadosService.findAll(paginationDto);

    return recados;
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.recadosService.findOne(id);
  }

  @UseGuards(AuthTokenGuard)
  @Post()
  create(@Body() createRecadoDto: CreateRecadoDto, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.recadosService.create(createRecadoDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() updateRecadoDto: UpdateRecadoDto, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.recadosService.update(id, updateRecadoDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  delete(@Param('id') id: number, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.recadosService.delete(id, tokenPayload);
  }
}
