
import { integer, pgTable, serial, text, timestamp , boolean} from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
    id: serial('id').primaryKey(),
    firstName: text('first_name'),
    lastname: text('last_name'),
    email: text('email').notNull().unique(),
    image: text('image'),
});

export const todoTable = pgTable('todos', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    completed:boolean('completed').notNull().default(false),
    userId: integer('user_id')
        .notNull()
        .references(() => usersTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
});

export const subtodoTable = pgTable("subtodos", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    completed: boolean("completed").notNull().default(false),
    todoId: integer("todo_id")
        .notNull()
        .references(() => todoTable.id, { onDelete: "cascade" }),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type Inserttodo = typeof todoTable.$inferInsert;
export type Selecttodo = typeof todoTable.$inferSelect;

export type InsertSubtodo = typeof subtodoTable.$inferInsert;
export type SelectSubtodo = typeof subtodoTable.$inferSelect;