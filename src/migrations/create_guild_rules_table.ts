import {Migration} from '@mikro-orm/migrations'

export class CreateGuildRulesTable extends Migration {
    async up(): Promise<void> {
        this.addSql('CREATE TABLE guild_rules (id BIGINT AUTO_INCREMENT, guild_id VARCHAR(255) NOT NULL, rule VARCHAR(255) NOT NULL, PRIMARY KEY(id))')
    }

    async down(): Promise<void> {
        this.addSql('DROP TABLE guild_rules')
    }
}