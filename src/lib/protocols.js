// src/lib/protocols.js
// The Enforcer of Laws

const config = require('../../config/omni_nexus_config.json');
const logger = require('./cosmic_logger');

class ProtocolEnforcer {
    constructor() {
        this.activeProtocols = new Set(config.operator_code.protocols);
    }

    verify(protocolName) {
        if (this.activeProtocols.has(protocolName)) {
            logger.info(`Protocol Verified: ${protocolName}`, { status: 'ACTIVE' });
            return true;
        } else {
            logger.warn(`Protocol Violation: ${protocolName} is not active!`, { status: 'INACTIVE' });
            return false;
        }
    }

    enforceHyperSpeed() {
        if (!this.verify('jules_hyper_speed_protocol')) {
            throw new Error("CRITICAL: Hyper Speed Protocol not active. Ascension halted.");
        }
    }

    enforceMemoryVaults() {
        return this.verify('encrypted_memory_vaults');
    }
}

module.exports = new ProtocolEnforcer();
