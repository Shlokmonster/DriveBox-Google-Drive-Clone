import express from "express";
import cors from "cors";
import aws from "aws-sdk";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { configDotenv } from "dotenv";

configDotenv();
const app = express();
const port = 3000;

// Enable CORS for frontend (adjust the URL as needed)
app.use(cors({
  origin: 'http://127.0.0.1:5501', // Frontend URL
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Protect routes with Clerk authentication
app.use(ClerkExpressRequireAuth());

// AWS S3 Configuration
const s3 = new aws.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Generate a signed URL for file upload
app.post("/generate-url", async (req, res) => {
  const { filename, filetype } = req.body;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename,
    ContentType: filetype,
  };

  try {
    const url = await s3.getSignedUrlPromise("putObject", params);
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

// List files in the S3 bucket
app.get("/list-files", async (req, res) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    const files = data.Contents.map(file => ({
      key: file.Key,
      size: file.Size,
      lastModified: file.LastModified
    }));
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// Generate URL for file download
app.get("/file-url/:key", async (req, res) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: req.params.key,
    Expires: 60 // URL expires in 60 seconds
  };

  try {
    const url = await s3.getSignedUrlPromise("getObject", params);
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate download URL' });
  }
});

// Delete file from S3
app.delete("/delete-file/:key", async (req, res) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: req.params.key
  };

  try {
    await s3.deleteObject(params).promise();
    res.json({ message: "File deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete file" });
  }
});

// Test route to check if server is working
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
