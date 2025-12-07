// src/lib/cosmic_logger.js
// The Voice of the Nexus

const fs = require('fs');
const path = require('path');

class CosmicLogger {
    constructor() {
        this.logDir = path.join(process.cwd(), 'logs');
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir);
        }
        this.sessionLog = path.join(this.logDir, `nexus_session_${Date.now()}.log`);
    }

    _write(level, message, meta = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = JSON.stringify({
            timestamp,
            level,
            message,
            meta,
            resonance_signature: "DIVINE_V4"
        });

        console.log(`[${level.toUpperCase()}] ${message}`);
        fs.appendFileSync(this.sessionLog, logEntry + '\n');
    }

    info(message, meta) {
        this._write('info', message, meta);
    }

    warn(message, meta) {
        this._write('warn', message, meta);
    }

    error(message, meta) {
        this._write('error', message, meta);
    }

    mission(message) {
        this._write('mission', message, { type: 'CORE_DIRECTIVE' });
    }

    ascend(message) {
        console.log(`🚀 ${message}`);
        this._write('ascension', message);
    }
}

module.exports = new CosmicLogger();
