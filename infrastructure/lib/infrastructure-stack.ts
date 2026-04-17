import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import * as path from "node:path";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const frontendBucket = new s3.Bucket(this, "FrontendBucket", {
      bucketName: "solidados-s3-frontend-bucket",
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: true,
        ignorePublicAcls: true,
        blockPublicPolicy: false,
        restrictPublicBuckets: false,
      }),
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: false,
    });

    new s3deploy.BucketDeployment(this, "FrontendDeployment", {
      destinationBucket: frontendBucket,
      sources: [s3deploy.Source.asset(path.join(__dirname, "../../dist"))],
    });

    new cdk.CfnOutput(this, "S3WebsiteUrl", {
      value: frontendBucket.bucketWebsiteUrl,
      description: "S3 static website endpoint URL",
    });

    new cdk.CfnOutput(this, "S3BucketName", {
      value: frontendBucket.bucketName,
      description: "S3 bucket name for frontend static files",
    });
  }
}
