-- CreateTable
CREATE TABLE "users" (
    "user_id" CHAR(8) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);
