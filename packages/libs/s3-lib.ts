import { S3 } from 'aws-sdk'; // eslint-disable-line

const s3: S3 = new S3({
  region: process.env.REGION,
});

export default class S3Storage {
  static async getUrl(bucket: string, key: string) {
    //Expires: 60s
    try {
      const bucketName = bucket;
      const keyName = key;
      const params = {
        Bucket: bucketName,
        Key: keyName,
        Expires: 60,
      };

      const urlResult = await s3.getSignedUrl('putObject', params);

      return urlResult;
    } catch (error) {
      throw new Error(`S3 GET SIGNED URL/${error}`);
    }
  }
  static async getUrlGet(bucket: string, key: string) {
    //Expires: 15m
    try {
      const bucketName = bucket;
      const keyName = key;
      const params = {
        Bucket: bucketName,
        Key: keyName,
      };

      const urlResult = await s3.getSignedUrl('getObject', params);
      return urlResult;
    } catch (error) {
      throw new Error(`S3 GET SIGNED URL/${error}`);
    }
  }

  static async upload(fileData: string, contentType: string, bucket: string, key: string) {
    try {
      const bucketName = bucket;
      const keyName = key;
      const params = {
        Bucket: bucketName,
        Key: keyName,
        Body: fileData,
        ContentType: contentType,
      };

      const uploadResult = await s3.upload(params).promise();

      return uploadResult;
    } catch (error) {
      throw new Error(`S3 UPLOAD FAILED/${error}`);
    }
  }
  static async base64Upload(fileData: Buffer, contentType: string, bucket: string, key: string) {
    try {
      const bucketName = bucket;
      const keyName = key;
      const params = {
        Bucket: bucketName,
        Key: keyName,
        Body: fileData,
        ContentType: contentType,
        ContentEncoding: 'base64',
      };

      const uploadResult = await s3.upload(params).promise();

      return uploadResult;
    } catch (error) {
      throw new Error(`S3 UPLOAD FAILED/${error}`);
    }
  }
  static delete(bucket: string, key: string) {
    const bucketName = bucket;
    const keyName = key;
    const params = {
      Bucket: bucketName,
      Key: keyName,
    };
    s3.deleteObject(params, (err, data) => {
      if (err) {
        throw err;
      }
      console.log('s3 delete Object', key);
    });
  }
}
