/**
 * Node Updater for Hive-Engine
 *
 * This module fetches Hive-Engine node information from a Hive account's JSON metadata.
 * It provides functions to retrieve and work with the list of Hive-Engine nodes.
 *
 * @module node-updater
 * @author TheCrazyGM
 */

"use strict";

// Import dhive library for Hive blockchain interaction
const dhive = require("@hiveio/dhive");

// Initialize client with a reliable default node
const client = new dhive.Client(["https://api.hive.blog"]);

/**
 * Fetches account JSON metadata and extracts Hive-Engine node information
 *
 * @param {string} accountName - The Hive account to fetch metadata from (default: 'flowerengine')
 * @returns {Promise<Object>} - Object containing nodes and failing_nodes
 * @throws {Error} If account not found or metadata cannot be parsed
 */
async function getNodesFromAccount(accountName = "flowerengine") {
  try {
    console.log(`Fetching account metadata for ${accountName}...`);

    // Get account information from Hive blockchain
    const accounts = await client.database.getAccounts([accountName]);

    if (!accounts || accounts.length === 0) {
      throw new Error(`Account '${accountName}' not found`);
    }

    const account = accounts[0];
    const jsonMetadata = account.json_metadata;

    if (!jsonMetadata) {
      throw new Error(`No JSON metadata found for account '${accountName}'`);
    }

    // Parse JSON metadata
    let metadataObj;
    try {
      metadataObj = JSON.parse(jsonMetadata);
      console.log("Successfully parsed account JSON metadata");
    } catch (parseError) {
      throw new Error(`Failed to parse JSON metadata: ${parseError.message}`);
    }

    // Validate nodes data structure
    if (!metadataObj.nodes || !Array.isArray(metadataObj.nodes)) {
      throw new Error("No nodes array found in account metadata");
    }

    // Create a result object with nodes and failing_nodes
    const result = {
      nodes: metadataObj.nodes,
      failing_nodes: metadataObj.failing_nodes || {},
    };

    // Log summary information
    console.log(`Found ${result.nodes.length} nodes in account metadata`);
    const failingNodesCount = Object.keys(result.failing_nodes).length;
    if (failingNodesCount > 0) {
      console.log(
        `Found ${failingNodesCount} failing nodes in account metadata`,
      );
    }

    return result;
  } catch (error) {
    console.error(`Error fetching nodes: ${error.message}`);
    throw error;
  }
}

/**
 * Main function to retrieve Hive-Engine nodes from account metadata
 *
 * @param {string} accountName - The Hive account to fetch metadata from (default: 'flowerengine')
 * @returns {Promise<Object>} - Object containing nodes and failing_nodes
 * @throws {Error} If nodes cannot be fetched
 */
async function updateNodesFromAccount(accountName = "flowerengine") {
  return getNodesFromAccount(accountName);
}

// Export functions for use in other files
module.exports = {
  getNodesFromAccount,
  updateNodesFromAccount,
};

/**
 * Example usage:
 *
 * updateNodesFromAccount('flowerengine')
 *   .then(({ nodes, failing_nodes }) => {
 *     console.log('Node update complete. Nodes:');
 *     nodes.forEach((node, idx) => console.log(`${idx + 1}. ${node}`));
 *
 *     if (Object.keys(failing_nodes).length > 0) {
 *       console.log('Failing nodes:');
 *       Object.entries(failing_nodes).forEach(([node, reason]) => {
 *         console.log(`- ${node}: ${reason}`);
 *       });
 *     }
 *   })
 *   .catch(error => {
 *     console.error('Error:', error);
 *   });
 */
