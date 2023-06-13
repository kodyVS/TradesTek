let Counter = require("../models/counterModel");
let buildCounter = async () => {
  let cool = Counter.create({ Count: 54 })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  let q = await cool;
  console.log(q);
};
buildCounter();
console.log("counter built");
