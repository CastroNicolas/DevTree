import server from "./server";

const port = process.env.PORT || 3000;
server.listen(3000, () => {
  console.log("DevTree app listening on port " + port);
});
