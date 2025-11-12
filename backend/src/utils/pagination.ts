import { Request } from 'express';
import { PaginationMeta } from './response';

export interface PaginationParams {
  page: number;
  per_page: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export class PaginationHelper {
  static readonly DEFAULT_PAGE = 1;
  static readonly DEFAULT_PER_PAGE = 20;
  static readonly MAX_PER_PAGE = 100;

  static parsePaginationParams(req: Request): PaginationParams {
    const page = Math.max(1, parseInt(req.query.page as string) || this.DEFAULT_PAGE);
    const perPage = Math.min(
      this.MAX_PER_PAGE,
      Math.max(1, parseInt(req.query.per_page as string) || this.DEFAULT_PER_PAGE)
    );
    const sort = (req.query.sort as string) || 'createdAt';
    const order = (req.query.order as 'asc' | 'desc') || 'desc';

    return { page, per_page: perPage, sort, order };
  }

  static calculatePaginationMeta(total: number, page: number, perPage: number): PaginationMeta {
    return {
      page,
      per_page: perPage,
      total,
      total_pages: Math.ceil(total / perPage),
    };
  }

  static addLinkHeaders(req: Request, page: number, perPage: number, totalPages: number): string[] {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;
    const queryParams = new URLSearchParams(req.query as any);
    const links: string[] = [];

    if (page < totalPages) {
      queryParams.set('page', String(page + 1));
      links.push(`<${baseUrl}?${queryParams}>; rel="next"`);
    }

    if (page > 1) {
      queryParams.set('page', String(page - 1));
      links.push(`<${baseUrl}?${queryParams}>; rel="prev"`);
    }

    queryParams.set('page', '1');
    links.push(`<${baseUrl}?${queryParams}>; rel="first"`);

    queryParams.set('page', String(totalPages));
    links.push(`<${baseUrl}?${queryParams}>; rel="last"`);

    return links;
  }
}
