const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({
region: process.env.AWS_REGION,
credentials: {
accessKeyId: process.env.AWS_ACCESS_KEY_ID,
secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}
});

async function getPresignedUrlForDownload(key, expiresInSeconds = 60) {
const command = new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key });
return await getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
}

const AWS = require("aws-sdk");

exports.getPresignedUrlForDownload = async (key, expiresIn = 120) => {
  try {
    console.log("🔍 Generating URL for key:", key);
    console.log("Using bucket:", process.env.S3_BUCKET);

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Expires: expiresIn,
    };

    const url = await s3.getSignedUrlPromise("getObject", params);
    console.log("✅ Generated URL:", url);
    return url;
  } catch (error) {
    console.error("❌ Error generating presigned URL:", error);
    throw error;
  }
};



module.exports = { getPresignedUrlForDownload };