import express from "express";
import characterRoutes from "./routes/characterRoutes.js";
import hatRoutes from "./routes/hatRoutes.js";
import quoteRoutes from "./routes/quotesRoutes.js";
import { BrowserService } from "./services/browserService.js";

const app = express();

app.use(express.json());

app.use('/characters', characterRoutes); 
app.use('/hat', hatRoutes);
app.use('/quote', quoteRoutes);

// rember to set up singletons somewhere in here
const browserService = await BrowserService.getInstance(); 

export default app;
