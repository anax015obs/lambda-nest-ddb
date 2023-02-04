import {
	aws_apigateway as apigw,
	aws_ec2 as ec2,
	aws_lambda as lambda,
	aws_dynamodb as ddb,
	aws_iam as iam,
	aws_certificatemanager as cert,
	aws_route53 as route53,
	aws_route53_targets as route53Targets,
	Duration,
	Stack as CdkStack,
	StackProps,
	RemovalPolicy
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import required from '../env/required.json';

export class Stack extends CdkStack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		const vpc = new ec2.Vpc(this, `${this.stackName}-vpc`, {
			vpcName: `${this.stackName}-vpc`
		});

		const envSecrets = required.secrets.reduce((prev: { [k: string]: any }, cur: string) => {
			prev[cur] = process.env[cur];
			return prev;
		}, {});

		const ddbInstance = new ddb.Table(this, `${this.stackName}-table`, {
			tableName: `${this.stackName}-table`,
			partitionKey: {
				name: 'pk',
				type: ddb.AttributeType.STRING
			},
			sortKey: {
				name: 'sk',
				type: ddb.AttributeType.STRING
			},
			billingMode: ddb.BillingMode.PAY_PER_REQUEST,
			removalPolicy: RemovalPolicy.RETAIN
		});

		Array.from({ length: 5 }, (x, i) => {
			ddbInstance.addGlobalSecondaryIndex({
				indexName: `gsi${i + 1}`,
				partitionKey: { name: `pk${i + 1}`, type: ddb.AttributeType.STRING },
				sortKey: { name: `sk${i + 1}`, type: ddb.AttributeType.STRING },
				projectionType: ddb.ProjectionType.ALL
			});
		});

		// Lambda to Interact with RDS Proxy
		const lambdaInstance = new lambda.Function(this, `${this.stackName}-lambda`, {
			functionName: `${this.stackName}-lambda`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromAsset('dist'),
			handler: 'index.handler',
			vpc: vpc,
			timeout: Duration.seconds(10),
			environment: {
				...envSecrets,
				TABLE_NAME: ddbInstance.tableName,
				NODE_ENV: 'production'
			}
		});
		ddbInstance.grantReadWriteData(lambdaInstance);

		const apigwInstance = new apigw.LambdaRestApi(this, `${this.stackName}-apigw`, {
			restApiName: `${this.stackName}-apigw`,
			handler: lambdaInstance,
			deployOptions: {
				stageName: process.env.APIGW_STAGE,
				metricsEnabled: true,
				dataTraceEnabled: true
				// cachingEnabled: true,
				// cacheTtl: Duration.hours(1),
				// cacheClusterEnabled: true,
				// cacheClusterSize: "0.5",
			}
		});
		if (process.env.APIGW_DOMAIN && process.env.APIGW_CERT_ARN) {
			const certificate = cert.Certificate.fromCertificateArn(this, `${this.stackName}-cert`, process.env.APIGW_CERT_ARN);

			apigwInstance.addDomainName(process.env.APIGW_DOMAIN, {
				domainName: process.env.APIGW_DOMAIN,
				certificate
			});

			const hostedZone = route53.HostedZone.fromLookup(this, `${this.stackName}-hostedZone`, {
				domainName: process.env.APIGW_DOMAIN
			});

			new route53.ARecord(this, `${this.stackName}-ARecord`, {
				recordName: process.env.APIGW_DOMAIN,
				target: route53.RecordTarget.fromAlias(new route53Targets.ApiGateway(apigwInstance)),
				zone: hostedZone
			});
		}
	}
}
