import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1771992001293 implements MigrationInterface {
    name = 'Initial1771992001293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "app_file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" text NOT NULL, "type" text NOT NULL, "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_e432bb99db5406c0b94289e3809" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "email" character varying, "phone" character varying, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "password" character varying, "imageId" uuid, CONSTRAINT "REL_5e028298e103e1694147ada69e" UNIQUE ("imageId"), CONSTRAINT "CHK_6f3d7094385ad1824840fafb10" CHECK (NOT ("email" IS NOT NULL AND "phone" IS NOT NULL)), CONSTRAINT "CHK_a9ca2cd5a803aea06372dbe8fb" CHECK (("email" IS NULL OR "password" IS NOT NULL)), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a82019efd2a1acb60bd3cce7ae" ON "user" ("phone") WHERE "phone" IS NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f1b59d026e9f59a72d16fd68dd" ON "user" ("email") WHERE "email" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "city" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "property" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "refNumber" BIGSERIAL NOT NULL, "price" integer NOT NULL, "neighborhood" character varying NOT NULL, "size" integer NOT NULL, "room" integer NOT NULL, "bathrooms" integer NOT NULL, "propertyAge" integer, "propertyType" "public"."property_propertytype_enum" NOT NULL, "category" "public"."property_category_enum" NOT NULL, "propertyDeedType" "public"."property_propertydeedtype_enum" NOT NULL, "status" "public"."property_status_enum" NOT NULL DEFAULT 'unCompleted', "isFeature" boolean NOT NULL DEFAULT false, "floor" integer NOT NULL, "rejectReason" text, "notes" text, "address" text, "stocks" integer NOT NULL DEFAULT '1', "coordinates" geography(Point,4326), "cityId" uuid NOT NULL, "videoId" uuid, "coverId" uuid, "ownerId" uuid NOT NULL, CONSTRAINT "UQ_08756168b1a93d96e6012f50d29" UNIQUE ("refNumber"), CONSTRAINT "REL_b81f882612e4551029b4371c4d" UNIQUE ("videoId"), CONSTRAINT "REL_c35e30cae559239e582f8f8182" UNIQUE ("coverId"), CONSTRAINT "PK_d80743e6191258a5003d5843b4f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5fddfab6f81f3063e757b5457f" ON "property" USING GiST ("coordinates") `);
        await queryRunner.query(`CREATE TABLE "otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(6) NOT NULL, "reason" "public"."otp_reason_enum" NOT NULL, "channel" "public"."otp_channel_enum" NOT NULL, "attempts" integer NOT NULL DEFAULT '1', "date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "attempts" CHECK (attempts >= 1 AND attempts <= 5), CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6588d2236c03d3da8001510179" ON "otp" ("userId", "reason", "channel") `);
        await queryRunner.query(`CREATE TABLE "property_files" ("propertyId" uuid NOT NULL, "appFileId" uuid NOT NULL, CONSTRAINT "PK_7e217ec2293105c9f56d01bb6dc" PRIMARY KEY ("propertyId", "appFileId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_981a6eb4f5eba1906f3c3aa609" ON "property_files" ("propertyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8d09b3b41e6a38601f51cfa6e2" ON "property_files" ("appFileId") `);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_5e028298e103e1694147ada69e5" FOREIGN KEY ("imageId") REFERENCES "app_file"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property" ADD CONSTRAINT "FK_2c9571019f7b873765cf1ad4dcd" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property" ADD CONSTRAINT "FK_b81f882612e4551029b4371c4d0" FOREIGN KEY ("videoId") REFERENCES "app_file"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property" ADD CONSTRAINT "FK_c35e30cae559239e582f8f8182b" FOREIGN KEY ("coverId") REFERENCES "app_file"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property" ADD CONSTRAINT "FK_917755242ab5b0a0b08a63016d9" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "otp" ADD CONSTRAINT "FK_db724db1bc3d94ad5ba38518433" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_files" ADD CONSTRAINT "FK_981a6eb4f5eba1906f3c3aa6092" FOREIGN KEY ("propertyId") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "property_files" ADD CONSTRAINT "FK_8d09b3b41e6a38601f51cfa6e2c" FOREIGN KEY ("appFileId") REFERENCES "app_file"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_files" DROP CONSTRAINT "FK_8d09b3b41e6a38601f51cfa6e2c"`);
        await queryRunner.query(`ALTER TABLE "property_files" DROP CONSTRAINT "FK_981a6eb4f5eba1906f3c3aa6092"`);
        await queryRunner.query(`ALTER TABLE "otp" DROP CONSTRAINT "FK_db724db1bc3d94ad5ba38518433"`);
        await queryRunner.query(`ALTER TABLE "property" DROP CONSTRAINT "FK_917755242ab5b0a0b08a63016d9"`);
        await queryRunner.query(`ALTER TABLE "property" DROP CONSTRAINT "FK_c35e30cae559239e582f8f8182b"`);
        await queryRunner.query(`ALTER TABLE "property" DROP CONSTRAINT "FK_b81f882612e4551029b4371c4d0"`);
        await queryRunner.query(`ALTER TABLE "property" DROP CONSTRAINT "FK_2c9571019f7b873765cf1ad4dcd"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_5e028298e103e1694147ada69e5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8d09b3b41e6a38601f51cfa6e2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_981a6eb4f5eba1906f3c3aa609"`);
        await queryRunner.query(`DROP TABLE "property_files"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6588d2236c03d3da8001510179"`);
        await queryRunner.query(`DROP TABLE "otp"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5fddfab6f81f3063e757b5457f"`);
        await queryRunner.query(`DROP TABLE "property"`);
        await queryRunner.query(`DROP TABLE "city"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f1b59d026e9f59a72d16fd68dd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a82019efd2a1acb60bd3cce7ae"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "app_file"`);
    }

}
