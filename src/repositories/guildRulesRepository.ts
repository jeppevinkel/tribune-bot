import {EntityRepository} from '@mikro-orm/mysql'
import {GuildRule} from '../entities/guildRule'

export class GuildRulesRepository extends EntityRepository<GuildRule> {
    public async findByGuild(guildId: string) {
        return await this.find({guildId: guildId})
    }

    public async insertByGuild(guildId: string, rule: string) {
        const guildRule = new GuildRule()
        guildRule.guildId = guildId
        guildRule.rule = rule
        await this.persistAndFlush(guildRule)
    }

}