// To run this example, you'd typically have an example.js file like:
const { updateNodesFromAccount } = require("./node-updater"); // if in same directory
// To get Hive mainnet nodes instead:
updateNodesFromAccount("nectarflower") // Just change the account name here!
  .then(({ nodes, failing_nodes }) => {
    console.log("\nHive mainnet nodes:");
    nodes.forEach((node, idx) => console.log(`${idx + 1}. ${node}`));

    // ... (rest of the example code for handling failing_nodes)
  })
  .catch((error) => {
    console.error("Error fetching Hive mainnet nodes:", error);
  });
