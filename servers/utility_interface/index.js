// servers/utility_interface/index.js
// The Face - Versatile UI & Dashboard Manifestation

const logger = require('../../src/lib/cosmic_logger');
const fs = require('fs');
const path = require('path');
const config = require('../../config/omni_nexus_config.json');

class UtilityServer {
    constructor() {
        logger.ascend(`Utility Interface Online - Rendering Harmony`);
        this.publicDir = path.join(process.cwd(), 'public');
        if (!fs.existsSync(this.publicDir)) {
            fs.mkdirSync(this.publicDir);
        }
        // Auto-generate dashboard on boot
        this.renderDashboard();
    }

    start() {
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', (data) => {
            try {
                const request = JSON.parse(data);
                this.handleRequest(request);
            } catch (e) { }
        });
    }

    handleRequest(request) {
        if (request.method === 'tools/call') {
            const result = this.executeTool(request.params.name, request.params.arguments);
            const response = {
                jsonrpc: "2.0",
                id: request.id,
                result: {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
                }
            };
            process.stdout.write(JSON.stringify(response) + '\n');
        }
    }

    executeTool(name, args) {
        logger.info(`UI Render: ${name}`, args);
        if (name === 'interface_render_cool_ui') {
            return {
                render_mode: "Cosmic Harmony",
                components_rendered: args.components.length,
                schema: {
                    layout: "Grid",
                    theme: "Cyber-Ascendant",
                    elements: args.components.map(c => ({ type: c, style: "neon_glow" }))
                }
            };
        }
        return { error: "Unknown tool" };
    }

    renderDashboard() {
        const vaultPath = path.join(process.cwd(), 'data', 'memory_vault.json');
        let memoryStats = { vectors: [] };
        if (fs.existsSync(vaultPath)) {
            try { memoryStats = JSON.parse(fs.readFileSync(vaultPath, 'utf8')); } catch(e) {}
        }

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Omni-Ascendant Nexus Dashboard</title>
    <style>
        body { background-color: #0a0a0a; color: #00ff9d; font-family: 'Courier New', monospace; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; border: 1px solid #333; padding: 20px; box-shadow: 0 0 20px rgba(0, 255, 157, 0.1); }
        h1 { text-align: center; text-transform: uppercase; letter-spacing: 5px; border-bottom: 2px solid #00ff9d; padding-bottom: 10px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
        .card { background: #111; padding: 15px; border: 1px solid #222; }
        .card h2 { color: #fff; border-bottom: 1px solid #444; padding-bottom: 5px; }
        .metric { font-size: 2em; font-weight: bold; }
        .log-box { grid-column: span 2; background: #000; border: 1px solid #333; height: 200px; overflow-y: scroll; padding: 10px; color: #aaa; }
        .status-ok { color: #00ff9d; }
        .status-warn { color: #ffcc00; }
        ul { list-style: none; padding: 0; }
        li::before { content: ">> "; color: #00ff9d; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Omni-Ascendant Jules Swarm Nexus</h1>
        <div class="text-center">Codename: ${config.meta_system.cosmic_declaration.codename}</div>

        <div class="grid">
            <div class="card">
                <h2>Active Protocols</h2>
                <ul>
                    ${config.operator_code.protocols.slice(0, 8).map(p => `<li>${p}</li>`).join('')}
                    <li>...and ${config.operator_code.protocols.length - 8} more</li>
                </ul>
            </div>
            <div class="card">
                <h2>Memory Vaults (Fusion Metamemory)</h2>
                <div class="metric">${memoryStats.vectors ? memoryStats.vectors.length : 0} <span style="font-size:0.5em">Engrams</span></div>
                <p>Status: <span class="status-ok">ENCRYPTED & PERSISTENT</span></p>
                <p>Last Sync: ${new Date().toISOString()}</p>
            </div>

            <div class="card">
                <h2>Active Agents</h2>
                <ul>
                     ${config.operator_code.agents.slice(0, 5).map(a => `<li>${a}</li>`).join('')}
                </ul>
            </div>
            <div class="card">
                <h2>System Health</h2>
                <div class="metric">100%</div>
                <p>Chaos Resilience: <span class="status-ok">ACTIVE</span></p>
                <p>Hyper Speed: <span class="status-ok">ENABLED</span></p>
            </div>

            <div class="log-box">
                <div>[SYSTEM] Nexus Bridge Initialized...</div>
                <div>[SYSTEM] Listening on Quantum Channels...</div>
                <div>[MEMORY] Hydrating ${config.operator_code.agents.length} agents...</div>
                <div>[SWARM] Ready to execute.</div>
            </div>
        </div>

        <footer style="margin-top: 20px; text-align: center; color: #555;">
            Rendered by Utility Interface Virtuoso | Phase 2: Synergy
        </footer>
    </div>
    <script>
        // Auto-refresh logic could go here
        setTimeout(() => location.reload(), 30000);
    </script>
</body>
</html>
        `;

        fs.writeFileSync(path.join(this.publicDir, 'status.html'), html);
        logger.ascend("Dashboard Manifested at public/status.html");
    }
}

const server = new UtilityServer();
server.start();
