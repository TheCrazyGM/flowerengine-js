// To run this example, you'd typically have an example.js file like:
const { updateNodesFromAccount } = require("./node-updater"); // if in same directory

updateNodesFromAccount("flowerengine")
  .then(({ nodes, failing_nodes }) => {
    console.log("\nNode update complete. Available nodes:");
    nodes.forEach((node, idx) => console.log(`${idx + 1}. ${node}`));

    if (Object.keys(failing_nodes).length > 0) {
      console.log("\nFailing nodes:");
      Object.entries(failing_nodes).forEach(([node, reason]) => {
        console.log(`- ${node}: ${reason}`);
      });
    }
  })
  .catch((error) => {
    console.error("Error in example usage:", error);
  });
