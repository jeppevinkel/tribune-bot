import {
    ApplicationCommand,
    ApplicationCommandPermissionData,
    Client,
    ClientOptions,
    Guild,
    GuildApplicationCommandPermissionData
} from 'discord.js'
import {REST} from '@discordjs/rest'
import path from 'path'
import * as fs from 'fs/promises'
import {fileURLToPath} from 'url'
import {IButton, ICommand} from '../interfaces'
import {Routes} from 'discord-api-types/v9'
import {MikroORM} from '@mikro-orm/core'
import {MySqlDriver} from '@mikro-orm/mysql'

export default class BotClient extends Client {
    private _orm!: MikroORM
    public readonly commands: Map<string, ICommand> = new Map()
    public readonly buttons: Map<string, IButton> = new Map()

    constructor(options: ClientOptions) {
        super(options)

        this.loadEvents()
        this.loadCommands()
        this.loadButtons()
    }

    public async login(token: string): Promise<string> {
        this._orm = await MikroORM.init<MySqlDriver>({
            entities: ['./dist/entities'],
            entitiesTs: ['./src/entities'],
            dbName: process.env.MYSQL_DATABASE,
            host: process.env.MYSQL_HOST,
            port: Number(process.env.MYSQL_PORT),
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASS,
            type: 'mysql',
            allowGlobalContext: true,
            migrations: {
                path: './dist/migrations',
                pathTs: './src/migrations',
                transactional: true,
                allOrNothing: true,
            }
        })
        await this._orm.getMigrator().up()

        return await super.login(token)
    }

    public async loadEvents(): Promise<void> {
        let eventsDir = path.join(__dirname, '../events')
        let files = (await fs.readdir(eventsDir)).filter(file => file.endsWith('.js'))
        for (let file of files) {
            let event = require(path.join(eventsDir, file))

            const once = event.once || false

            if (once) {
                this.once(file.split('.')[0], event.default.bind(null, this))
            } else {
                this.on(file.split('.')[0], event.default.bind(null, this))
            }

            console.log(`Loaded event: ${file.split('.')[0]}`)
        }
    }

    public async loadCommands(): Promise<void> {
        let commandsDir = path.join(__dirname, '../commands')
        let files = (await fs.readdir(commandsDir)).filter(file => file.endsWith('.js'))
        for (let file of files) {
            let command = require(path.join(commandsDir, file))

            this.commands.set(command.data.name, command)

            console.log(`Loaded command: ${command.data.name}`)
        }
    }

    public async loadButtons(): Promise<void> {
        let buttonsDir = path.join(__dirname, '../buttons')
        let files = (await fs.readdir(buttonsDir)).filter(file => file.endsWith('.js'))
        for (let file of files) {
            let button = require(path.join(buttonsDir, file))

            this.buttons.set(button.customId, button)

            console.log(`Loaded button: ${button.customId}`)
        }
    }

    public async registerCommandsForAllGuilds() {
        for (let guild of this.guilds.cache.values()) {
            await this.registerCommandsForGuild(guild)
        }
    }

    public async registerCommandsForGuild(guild: Guild) {
        console.log(`Registering Commands for ${guild.name}`)
        const res = await this.registerRawCommandsForGuild(guild)

        // Apply permissions
        const fullPermissions = await this.calculatePermissionsForGuild(guild, res)

        await guild.commands.permissions.set({
            fullPermissions
        })
    }

    public async updatePermissionsForGuild(guild: Guild) {
        await guild.commands.fetch()
        const commands =  [...guild.commands.cache.values()]
        const fullPermissions = await this.calculatePermissionsForGuild(guild, commands)

        await guild.commands.permissions.set({
            fullPermissions
        })
    }

    private async calculatePermissionsForGuild(guild: Guild, commands: ApplicationCommand[]) {
        const perms: GuildApplicationCommandPermissionData[] = []

        const roles = await guild.roles.fetch()

        for (const command of commands.values()) {
            const commandData = this.commands.get(command.name)
            if (!commandData || !commandData.permissions) continue

            const perm = {
                id: command.id,
                permissions: Array<ApplicationCommandPermissionData>(),
            }

            for (const role of roles.values()) {
                perm.permissions.push({
                    id: role.id,
                    permission: role.permissions.any(commandData.permissions),
                    type: 'ROLE',
                })
            }

            perms.push(perm)
        }

        return perms
    }

    private async registerRawCommandsForGuild(guild: Guild): Promise<ApplicationCommand[]> {
        const rest = new REST({version: '9'}).setToken(process.env.DISCORD_TOKEN as string)
        const cmds = [...this.commands.values()].map(cmd => {

            if (cmd.permissions) cmd.data.setDefaultPermission(false)

            return cmd.data.toJSON()
        })

        return await rest.put(
            Routes.applicationGuildCommands(process.env.DISCORD_APP_ID as string, guild.id),
            {body: cmds}
        ).catch(err => console.error('Error registering commands', err)) as ApplicationCommand[]
    }

    public getEntityManager() {
        return this._orm.em
    }
}