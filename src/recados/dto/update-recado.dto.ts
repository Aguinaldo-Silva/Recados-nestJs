import { IsBoolean, IsOptional } from "class-validator";
import { CreateRecadoDto } from "./create-recado.dto";

import { PartialType } from "@nestjs/mapped-types";

export class UpdateRecadoDto extends PartialType(CreateRecadoDto) {
  @IsBoolean()
  @IsOptional()
  readonly lido: boolean;
}
