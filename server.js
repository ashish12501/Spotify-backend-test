import app from "./src/app.js";
import connectDb from "./src/db/db.js";
connectDb();
app.listen("3000", () => {
  console.log("server running at port 300");
});
