import cors from "cors";
import express from "express";
import proxy from "express-http-proxy";
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

app.use(
	"/",
	proxy("www.miracles-of-quran.com/", {
		memoizeHost: true,
		https: true,
	}),
);

export default app;
