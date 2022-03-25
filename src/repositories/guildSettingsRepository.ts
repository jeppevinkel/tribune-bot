import {EntityRepository} from '@mikro-orm/mysql'
import {GuildSettings} from '../entities/guildSettings'

export class GuildSettingsRepository extends EntityRepository<GuildSettings> {
    public async findOrCreate(guildId: string) {
        let settings = await this.findOne({guildId: guildId})
        if (!settings) {
            settings = new GuildSettings()
            settings.guildId = guildId
            await this.persistAndFlush(settings)
        }
        return settings
    }
}