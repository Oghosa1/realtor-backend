import { z } from "zod";

export const getPostsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((v) => Math.max(1, parseInt(v, 10) || 1)),
  limit: z
    .string()
    .optional()
    .default("5")
    .transform((v) => Math.min(50, Math.max(1, parseInt(v, 10) || 5))),
  category: z
    .enum(["all", "request", "general", "property", "requests", "properties"])
    .optional()
    .transform((v) => {
      if (!v || v === "all") return undefined;
      if (v === "requests") return "request";
      if (v === "properties") return "property";
      return v;
    }),
  tag: z.string().optional(),
});

export const createPostSchema = z.object({
  content: z.string().min(3, "Content must be at least 3 characters").max(2000),
  category: z.enum(["request", "general", "property"]).default("request"),
  tag: z.string().nullable().optional(),
  location: z.string().max(200).optional().default("Lekki Phase 1, Lagos"),
  mediaUrl: z.string().url("Must be a valid URL").nullable().optional(),
  isVideo: z.boolean().optional().default(false),
  videoDuration: z.string().nullable().optional(),
});

export const postIdParamSchema = z.object({
  id: z.string().uuid("Invalid post UUID format"),
});
