const app = require("./src/app");
require("dotenv").config();
const PORT = process.env.PORT || 3056;
app.listen(PORT, () => {
  console.log(`WSV eCommerce start with port ${PORT}`);
});
