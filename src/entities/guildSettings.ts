import {Entity, EntityRepositoryType, PrimaryKey, Property} from '@mikro-orm/core'
import {GuildSettingsRepository} from '../repositories/guildSettingsRepository'


@Entity({customRepository: () => GuildSettingsRepository})
@Entity()
export class GuildSettings {
    [EntityRepositoryType]?: GuildSettingsRepository

    @PrimaryKey()
    guildId!: string

    @Property()
    moderatorRole: string = 'moderator'
}