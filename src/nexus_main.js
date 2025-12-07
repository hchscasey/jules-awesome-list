// src/nexus_main.js
// The Omni-Ascendant Jules Swarm Nexus - Core Brain

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const logger = require('./lib/cosmic_logger');
const protocols = require('./lib/protocols');
const memory = require('./lib/memory');
const config = require('../config/omni_nexus_config.json');

class NexusCore {
    constructor() {
        this.servers = new Map();
        this.config = config;
    }

    async boot() {
        console.clear();
        logger.ascend(`Initializing Omni-Ascendant Jules Swarm Nexus v${config.meta_system.cosmic_declaration.major_version}`);
        logger.mission(config.meta_system.cosmic_declaration.prime_directive);

        // 1. Protocol Verification
        this.verifyCoreProtocols();

        // 2. Memory Initialization
        this.initializeMemory();

        // 3. Spawn MCP Servers
        await this.spawnServers();

        logger.ascend("System Ready. The Swarm Awaits.");
    }

    verifyCoreProtocols() {
        logger.info("Verifying Core Protocols...");
        try {
            protocols.enforceHyperSpeed();
            protocols.enforceMemoryVaults();
            logger.info("All Systems Nominal. Resonance Established.");
        } catch (error) {
            logger.error(`Protocol Breach: ${error.message}`);
            process.exit(1);
        }
    }

    initializeMemory() {
        logger.info("Hydrating Memory Banks...");
        config.operator_code.agents.forEach(agent => {
            memory.store(agent, { status: "Active", resonance: "High" }, "system_boot");
        });
    }

    async spawnServers() {
        const servers = this.config.mcpServers;
        for (const [name, serverConfig] of Object.entries(servers)) {
            logger.info(`Spawning MCP Server: ${name}`);

            // Resolve relative paths in args
            const args = serverConfig.args.map(arg => {
                if (arg.startsWith('./')) return path.resolve(process.cwd(), arg);
                return arg;
            });

            // Expand Env Vars
            const env = { ...process.env, ...serverConfig.env };
            for (const key in env) {
                if (env[key] && env[key].startsWith('${') && env[key].endsWith('}')) {
                    const varName = env[key].slice(2, -1);
                    env[key] = process.env[varName] || '';
                }
            }

            const child = spawn(serverConfig.command, args, {
                env,
                stdio: ['pipe', 'pipe', 'pipe']
            });

            this.servers.set(name, child);

            child.stdout.on('data', (data) => {
                // Log only non-JSON-RPC noise or specific ready signals
                const msg = data.toString().trim();
                if (!msg.startsWith('{')) {
                    // logger.info(`[${name}] ${msg}`);
                }
            });

            child.stderr.on('data', (data) => {
                logger.error(`[${name}] ${data.toString().trim()}`);
            });

            // Brief ping to verify life (send invalid JSON to trigger error/response)
            child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "ping", id: 1 }) + '\n');
        }
    }
}

const nexus = new NexusCore();
nexus.boot().catch(err => {
    logger.error("System Failure", err);
    process.exit(1);
});
