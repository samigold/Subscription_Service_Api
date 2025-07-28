import app from './app.js';
import { PORT } from './config/env.js';
import { connectDb } from './Database/pgDb.js';

// Connect to the database
await connectDb();


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});