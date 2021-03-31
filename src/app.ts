import S3 from "aws-sdk/clients/s3";
import express, { Request, Response } from "express";
const app = express();
const PORT = 8000;

// I create configs here for demo, in real project you should get those information from environment variable
const configs = {
  bucketName: "tony-signed-url-demo",
  accessKey: "your accessKey here",
  secretKey: "your secretKey here",
};

app.get("/signed-url-upload", async (req: Request, res: Response) => {
  const {
    fileName = "demo-image",
    extension = "png",
    mediaType = "image",
  } = req.query;
  
  const s3 = new S3({
    credentials: {
      accessKeyId: configs.accessKey,
      secretAccessKey: configs.secretKey,
    },
  });

  const params = {
    Bucket: configs.bucketName,
    Key: `${fileName}.${extension}`,
    Expires: 300, //s - 5mins
    ContentType: `${mediaType}/${extension}`,
  };

  const url = await s3.getSignedUrlPromise("putObject", params);
  res.json({ uploadUrl: url });
});

app.get("/signed-url-access", async (req: Request, res: Response) => {
  const {
    key
  } = req.query;
  
  const s3 = new S3({
    credentials: {
      accessKeyId: configs.accessKey,
      secretAccessKey: configs.secretKey,
    },
  });

  const params = {
    Bucket: configs.bucketName,
    Key: key,
    Expires: 3600, //s - 1 hour
  };

  const url = await s3.getSignedUrlPromise("getObject", params);
  res.json({ uploadUrl: url });
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`);
});
