import { eq, sql, inArray } from 'drizzle-orm';
import type { DbClient } from '../../db/index';
import { blocks, templates, templateBlocks } from '../../schemas';

export const getAllTemplates = async (
  db: DbClient,
  filters: { page?: number; limit?: number },
) => {
  const { page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  const totalCountResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(templates);

  const totalResults = totalCountResult[0]?.count ?? 0;

  const paginatedTemplates = await db
    .select()
    .from(templates)
    .orderBy(templates.createdAt)
    .limit(limit)
    .offset(offset);

  if (paginatedTemplates.length === 0) {
    return {
      templates: [],
      pagination: { page, limit, totalPages: 0, totalResults: 0 },
    };
  }

  const templateIds = paginatedTemplates.map((t) => t.id);

  const allStackItems = await db
    .select({
      id: templateBlocks.id,
      templateId: templateBlocks.templateId,
      order: templateBlocks.order,
      inputMapping: templateBlocks.inputMapping,
      blockId: {
        id: blocks.id,
        name: blocks.name,
      },
    })
    .from(templateBlocks)
    .leftJoin(blocks, eq(templateBlocks.blockId, blocks.id))
    .where(inArray(templateBlocks.templateId, templateIds))
    .orderBy(templateBlocks.order);

  const templatesWithStacks = paginatedTemplates.map((template) => {
    return {
      ...template,
      blockStack: allStackItems.filter(
        (item) => item.templateId === template.id,
      ),
    };
  });

  return {
    templates: templatesWithStacks,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(totalResults / limit),
      totalResults,
    },
  };
};
