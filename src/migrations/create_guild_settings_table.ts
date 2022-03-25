import {Migration} from '@mikro-orm/migrations'

export class CreateGuildSettingsTable extends Migration {
    async up(): Promise<void> {
        this.addSql('CREATE TABLE guild_settings (guild_id VARCHAR(255) NOT NULL, moderator_role VARCHAR(255) NOT NULL, PRIMARY KEY(guild_id))')
    }

    async down(): Promise<void> {
        this.addSql('DROP TABLE guild_settings')
    }
}