// src/nexus_main.js
// The Omni-Ascendant Jules Swarm Nexus - Core Brain & Router

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
        // Ensure core agents are always present in memory
        config.operator_code.agents.forEach(agent => {
            if (!memory.retrieve(agent)) {
                memory.store(agent, { status: "Active", resonance: "High" }, "system_boot");
            }
        });
    }

    async spawnServers() {
        const servers = this.config.mcpServers;
        for (const [name, serverConfig] of Object.entries(servers)) {
            logger.info(`Spawning MCP Server: ${name}`);

            const args = serverConfig.args.map(arg => {
                if (arg.startsWith('./')) return path.resolve(process.cwd(), arg);
                return arg;
            });

            const env = { ...process.env, ...serverConfig.env };
            // Simple var expansion
            for (const key in env) {
                if (env[key] && env[key].startsWith('${') && env[key].endsWith('}')) {
                    const varName = env[key].slice(2, -1);
                    env[key] = process.env[varName] || '';
                }
            }

            const child = spawn(serverConfig.command, args, {
                env,
                stdio: ['pipe', 'pipe', 'pipe'] // We will pipe I/O
            });

            this.servers.set(name, child);

            // Stdout handling
            child.stdout.on('data', (data) => {
                const msgs = data.toString().split('\n');
                msgs.forEach(msg => {
                    if (!msg.trim()) return;
                    try {
                        // Check if it's a JSON-RPC response or Interlink Request
                        const json = JSON.parse(msg);
                        if (json.method === 'nexus/interlink') {
                            this.handleInterlink(name, json.params);
                        } else if (!json.jsonrpc) {
                             // logger.info(`[${name}] ${msg}`);
                        }
                    } catch (e) {
                         // logger.info(`[${name} RAW] ${msg}`);
                    }
                });
            });

            child.stderr.on('data', (data) => {
                logger.error(`[${name}] ${data.toString().trim()}`);
            });

            // Wake up call
            child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "ping", id: 1 }) + '\n');
        }
    }

    handleInterlink(source, params) {
        // params: { target: 'gremlin', method: 'tool/call', params: {...} }
        logger.info(`INTERLINK: ${source} -> ${params.target}`, params);

        const targetServer = this.servers.get(params.target);
        if (!targetServer) {
            logger.warn(`Interlink Failed: Target ${params.target} not found.`);
            return;
        }

        // Construct a tool call request for the target
        const request = {
            jsonrpc: "2.0",
            method: "tools/call",
            params: {
                name: params.tool,
                arguments: params.arguments
            },
            id: `interlink_${Date.now()}`
        };

        targetServer.stdin.write(JSON.stringify(request) + '\n');
    }
}

const nexus = new NexusCore();
nexus.boot().catch(err => {
    logger.error("System Failure", err);
    process.exit(1);
});
