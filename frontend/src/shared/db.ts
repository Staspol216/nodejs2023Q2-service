import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";

export const pg = await PGlite.create({
  extensions: {
    live,
  },
});
