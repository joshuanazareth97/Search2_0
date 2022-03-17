import "./pre-start"; // Must be the first import
import logger from "jet-logger";
import server from "./server";

// Constants
const serverStartMsg = "Express server started on port: ",
  port = process.env.NODE_DOCKER_PORT || 3001;
//   port = 3001;

// Start server
server.listen(port, () => {
  logger.info(serverStartMsg + port);
});
