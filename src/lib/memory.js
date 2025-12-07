// src/lib/memory.js
// The Infinite Vault - Fusion Metamemory Upgrade

const fs = require('fs');
const path = require('path');
const logger = require('./cosmic_logger');

class ActiveMemoryAgents {
    constructor() {
        this.vaultPath = path.join(process.cwd(), 'data', 'memory_vault.json');
        this.shortTermStore = new Map();
        this.longTermVectors = [];
        this.initialize();
    }

    initialize() {
        logger.info("Initializing Fusion Metamemory...");
        if (fs.existsSync(this.vaultPath)) {
            try {
                const data = JSON.parse(fs.readFileSync(this.vaultPath, 'utf8'));
                this.longTermVectors = data.vectors || [];
                // Hydrate short term from recent vectors if needed
                logger.info(`Deep History Loaded: ${this.longTermVectors.length} engrams retrieved.`);
            } catch (e) {
                logger.error("Memory Vault Corrupted - Reinitializing Void", e);
            }
        } else {
            logger.info("No existing vault found. Creating new Dimensional Persistence layer.");
            this.save();
        }
    }

    store(key, value, context = "general") {
        const entry = {
            key,
            value,
            timestamp: Date.now(),
            context,
            id: `mem_${Math.random().toString(36).substr(2, 9)}`,
            resonance: "HIGH"
        };

        this.shortTermStore.set(key, entry);
        logger.info(`Memory Encoded: ${key}`, { context });

        // Persist immediately (Synchronous for safety in this version)
        this.longTermVectors.push(entry);
        this.save();
    }

    retrieve(key) {
        // Check short term
        if (this.shortTermStore.has(key)) {
            return this.shortTermStore.get(key);
        }

        // Search Deep History (Linear scan for now, simulating vector search)
        const historical = this.longTermVectors.find(v => v.key === key);
        if (historical) {
            logger.info(`Deep History Retrieval: ${key}`);
            return historical;
        }

        return null;
    }

    getStats() {
        return {
            short_term_count: this.shortTermStore.size,
            deep_history_count: this.longTermVectors.length,
            vault_size_bytes: fs.existsSync(this.vaultPath) ? fs.statSync(this.vaultPath).size : 0
        };
    }

    save() {
        try {
            const data = {
                timestamp: Date.now(),
                vectors: this.longTermVectors
            };
            fs.writeFileSync(this.vaultPath, JSON.stringify(data, null, 2));
        } catch (e) {
            logger.error("Failed to seal Memory Vault", e);
        }
    }
}

module.exports = new ActiveMemoryAgents();
