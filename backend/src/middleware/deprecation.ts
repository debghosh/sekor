import { Request, Response, NextFunction } from 'express';

interface RedirectMapping {
  [oldPath: string]: {
    newPath: string;
    deprecationDate: string;
    sunsetDate: string;
  };
}

const redirectMappings: RedirectMapping = {
  '/api/auth': {
    newPath: '/api/v1/auth',
    deprecationDate: '2025-01-01',
    sunsetDate: '2025-06-01',
  },
};

export const deprecationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const mapping = redirectMappings[req.path];

  if (mapping) {
    console.log(`[DEPRECATED] ${req.method} ${req.path} -> ${mapping.newPath}`);
    
    res.setHeader('Deprecation', `date="${mapping.deprecationDate}"`);
    res.setHeader('Sunset', mapping.sunsetDate);
    res.setHeader('Link', `<${mapping.newPath}>; rel="alternate"`);

    const newUrl = `${mapping.newPath}${req.url.substring(req.path.length)}`;
    return res.redirect(307, newUrl);
  }

  next();
};
