import { NextFunction, Request, Response } from 'express'
import { ZodObject } from 'zod'

export const validateSchema =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
      req.body = parsed.data
      next()
    } else {
      res.status(400).json({
        errors: parsed.error.issues.map((issue) => issue.message)
      })
    }
  }

export const partialValidate =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.partial().safeParse(req.body)
    if (parsed.success) {
      req.body = parsed.data
      next()
    } else {
      res.status(400).json({
        errors: parsed.error.issues.map((issue) => issue.message)
      })
    }
  }
