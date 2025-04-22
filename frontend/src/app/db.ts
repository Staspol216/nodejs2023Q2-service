import { PGlite } from "@electric-sql/pglite";
import { electricSync } from "@electric-sql/pglite-sync";
import { live } from "@electric-sql/pglite/live";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";

export const initDB = async () => {
  const db = await PGlite.create({
    extensions: {
      live,
      electric: electricSync({
        // debug: true,
      }),
      uuid_ossp,
    },
  });
  return db;
};

export type DB = Awaited<ReturnType<typeof initDB>>;
