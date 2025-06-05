import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class parseIntIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param' || metadata.data !== 'id') {
      return value;
    }

    const parsedValue = Number(value);
    if (isNaN(parsedValue)) {
      throw new BadRequestException('perseIntIdPipe espera uma string numerica');
    }

    if (parsedValue < 0) {
      throw new BadRequestException('O ID não pode ser negativo');
    }

    return parsedValue;
  }
}

