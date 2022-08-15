console.log("index255");

fetch("temp/config.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(JSON.stringify(data));
  })
  .catch((e) => {
    console.log("Booo", e);
  });
