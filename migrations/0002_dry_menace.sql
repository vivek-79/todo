CREATE TABLE "subtodos" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"todo_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subtodos" ADD CONSTRAINT "subtodos_todo_id_todos_id_fk" FOREIGN KEY ("todo_id") REFERENCES "public"."todos"("id") ON DELETE cascade ON UPDATE no action;