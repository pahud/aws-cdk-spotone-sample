import * as cdk from '@aws-cdk/core';
import * as spotone from 'cdk-spot-one';
import * as ec2 from '@aws-cdk/aws-ec2';


export class Demo extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id)
    const instanceType = this.node.tryGetContext('instance_type') || 't3.large';
    const eipAllocationId = this.node.tryGetContext('eip_allocation_id');
    const volumeSize = this.node.tryGetContext('volume_size') || 60;

    const vpc = spotone.VpcProvider.getOrCreate(this);

    const fleet = new spotone.SpotFleet(this, 'SpotFleet', {
      vpc,
      blockDuration: spotone.BlockDuration.SIX_HOURS,
      eipAllocationId: eipAllocationId,
      defaultInstanceType: new ec2.InstanceType(instanceType),
      blockDeviceMappings: [
        {
          deviceName: '/dev/xvda',
          ebs: {
            volumeSize,
          },
        },
      ],
    });

    const expireAfter = this.node.tryGetContext('expire_after');
    if (expireAfter) {
      fleet.expireAfter(cdk.Duration.hours(expireAfter));
    }
  }
}

export class MyStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    new Demo(this, 'Demo');
  }
}

const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new cdk.App();

const stackName = app.node.tryGetContext('stackName') || 'SpotOneFleet';
new MyStack(app, stackName, { env: devEnv });

app.synth();
