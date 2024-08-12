import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  paginate(page: number, size: number): any {
    if (!page || page <= 0) {
      page = 1;
    }
    if (!size || size <= 0) {
      size = 5;
    }

    const skip = (page - 1) * size;
    return { limit: size, skip };
  }
}
