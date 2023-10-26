import { BadRequestException } from '@nestjs/common';

export const pipeFilterOptions = {
  transform: true,
  stopAtFirstError: true,
  exceptionFactory: (errors) => {
    const errorsForResponse: any = [];
    errors.forEach((e) => {
      const constrainsKeys = Object.keys(e.constraints!);
      constrainsKeys.forEach((ckey) => {
        errorsForResponse.push({
          message: e.constraints![ckey],
          field: e.property,
        });
      });
    });
    throw new BadRequestException(errorsForResponse);
  },
};
