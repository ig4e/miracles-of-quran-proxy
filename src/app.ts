import cors from "cors";
import express from "express";
import proxy from "express-http-proxy";
import path from "path";

require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/ampproject", express.static(path.join(__dirname, "scripts")));

app.use(
	"/",
	proxy("www.miracles-of-quran.com", {
		memoizeHost: true,
		userResHeaderDecorator: function (headers, req, res) {
			if (!headers["content-type"]?.includes("text/html")) return headers;

			headers["content-encoding"] = "";

			return headers;
		},

		userResDecorator: async function (proxyRes, proxyResData, userReq, userRes) {
			const response = await fetch("https://www.miracles-of-quran.com" + userReq.path);
			if (!response.headers.get("content-type")?.includes("text")) return proxyResData;

			const body = await response.text();
			const filterdBody = body.replaceAll("https://cdn.ampproject.org", "/ampproject");
      
			return filterdBody;
		},
	}),
);

export default app;
