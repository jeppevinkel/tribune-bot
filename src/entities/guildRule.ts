import {Entity, EntityRepositoryType, PrimaryKey, Property} from '@mikro-orm/core'
import {GuildRulesRepository} from '../repositories/guildRulesRepository'


@Entity({customRepository: () => GuildRulesRepository, tableName: 'guild_rules'})
export class GuildRule {
    [EntityRepositoryType]?: GuildRulesRepository

    @PrimaryKey({autoincrement: true})
    id!: bigint

    @Property()
    guildId!: string

    @Property()
    rule!: string
}