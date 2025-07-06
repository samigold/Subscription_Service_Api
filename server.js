import app from './app.js';
import connectDB from './Database/pgDb.js';
import { PORT } from './config/env.js';

await connectDB;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});