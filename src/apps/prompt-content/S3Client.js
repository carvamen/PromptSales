const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const s3 = new S3Client({ region: process.env.AWS_REGION });

async function putAsset({ key, body, contentType }) {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_ASSETS_BUCKET,
    Key: key, Body: body, ContentType: contentType, ServerSideEncryption: "AES256"
  }));
  return { url: `s3://${process.env.S3_ASSETS_BUCKET}/${key}` };
}

async function getAsset({ key }) {
  return s3.send(new GetObjectCommand({ Bucket: process.env.S3_ASSETS_BUCKET, Key: key }));
}

module.exports = { putAsset, getAsset };