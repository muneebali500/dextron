// mockApi.js
import jsonServer from "json-server";
import db from "./db.json"; // Your mock data

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.router(db));

const PORT = import.meta.env.MOCK_API_PORT || 3000; // Default to port 3000

if (
  import.meta.env.NODE_ENV !== "production" ||
  import.meta.env.RUN_MOCK_API === "true"
) {
  server.listen(PORT, () => {
    console.log(`Mock API server is running on port ${PORT}`);
  });
}
