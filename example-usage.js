/**
 * Example Usage of Node Updater
 *
 * This script demonstrates how to use the node-updater.js module to:
 * 1. Fetch Hive-Engine nodes from account metadata
 * 2. Query token information from a Hive-Engine node
 *
 * @module example-usage
 * @author TheCrazyGM
 */

"use strict";

// Import the node updater module
const nodeUpdater = require("./node-updater");

// Account to fetch nodes from
const accountName = "flowerengine";

// Token to query information for
const tokenSymbol = "SWAP.HIVE";

/**
 * Demonstrates fetching Hive-Engine nodes and querying token information
 *
 * @async
 * @returns {Promise<void>}
 */
async function demonstrateNodeUpdater() {
  try {
    // Step 1: Fetch the list of Hive-Engine nodes
    console.log(`Fetching nodes from '${accountName}' account metadata...`);
    const { nodes, failing_nodes } =
      await nodeUpdater.updateNodesFromAccount(accountName);

    // Display available nodes
    console.log("Available nodes:");
    nodes.forEach((node, idx) => console.log(`${idx + 1}. ${node}`));

    // Display failing nodes if any
    const failingNodesCount = Object.keys(failing_nodes).length;
    if (failingNodesCount > 0) {
      console.log("Failing nodes:");
      Object.entries(failing_nodes).forEach(([node, reason]) => {
        console.log(`- ${node}: ${reason}`);
      });
    }

    // Ensure we have at least one node to query
    if (nodes.length === 0) {
      throw new Error("No available nodes to query");
    }

    // Step 2: Query token information from the second node (index 1)
    // Note: You might want to implement node selection logic or fallback mechanism in production
    const nodeUrl = nodes[1];
    const apiUrl = `${nodeUrl.endsWith("/") ? nodeUrl : nodeUrl + "/"}contracts`;

    // Prepare the JSON-RPC request payload
    const postData = {
      jsonrpc: "2.0",
      id: 1,
      method: "find",
      params: {
        contract: "tokens",
        table: "tokens",
        query: { symbol: tokenSymbol },
        limit: 1,
        offset: 0,
      },
    };

    console.log(`Querying token info for ${tokenSymbol} from: ${apiUrl}`);

    // Make the API request using native fetch
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
      timeout: 10000, // 10 second timeout
    });

    // Check for HTTP errors
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Display the token information
    if (data && data.result) {
      console.log(
        `${tokenSymbol} token info:`,
        JSON.stringify(data.result, null, 2),
      );
    } else {
      console.error("Unexpected response:", data);
    }

    console.log("Demonstration completed successfully!");
  } catch (error) {
    console.error(`Error during demonstration: ${error.message}`);
    // In a real application, you might want to implement retry logic or fallback to other nodes
  }
}

// Execute the demonstration
demonstrateNodeUpdater();
