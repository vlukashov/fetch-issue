const fetch = require("node-fetch").default;

const main = async (
  url = "https://stepzen.stepzen.net/directives.graphql",
  times = 50
) => {
  let total = 0;
  for (let i = 0; i < times; i += 1) {
    try {
      const startedAt = new Date().getTime();
      const response = await fetch(url, { cache: "reload" });
      const text = await response.text();

      const doneAt = new Date().getTime();
      total += doneAt - startedAt;
      console.log(`fetched ${text.length} bytes in ${doneAt - startedAt} ms`);
    } catch (e) {
      console.log(e);
    }
  }
  console.log(`all done, average ${total / times} ms`);
};

main()
  .then(() => {
    console.log("done");
  })
  .catch((e) => {
    console.log("error", e);
  });
