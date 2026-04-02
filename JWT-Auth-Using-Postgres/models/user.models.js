import { pgTable, varchar, text, uuid } from "drizzle-orm/pg-core";

const usersTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 256 }).notNull(),
    email: varchar({ length: 256 }).notNull().unique(),
    password: text().notNull(),
    refreshToken: text().default(""),
});

export default usersTable;