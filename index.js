const { PORT } = require('./utils/constants.js');
const app = require('./app.js');

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));