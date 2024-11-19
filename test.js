const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('MONGO_URI:', process.env.MONGO_URI);
}
