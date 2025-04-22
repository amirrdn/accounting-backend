import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddNpwpToCustomers1744895682352 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("customer", new TableColumn({
            name: "npwp",
            type: "varchar",
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("customers", "npwp");
    }

}
