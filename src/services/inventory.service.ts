import { db } from '~/database';
import { eq } from 'drizzle-orm';
import { inventoryUnits } from '~/database/schemas';
import { AppError } from '~/errors';

const checkLabelExists = async (labelId: string) => {
  const label = await db.query.inventoryUnits.findFirst({
    where: eq(inventoryUnits.labelId, labelId),
  });

  if (label) {
    throw AppError.conflict('Label already exists');
  }

  return true;
};

export const inventoryService = {
  checkLabelExists,
};
