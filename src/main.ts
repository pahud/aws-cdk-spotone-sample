import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as spotone from 'cdk-spot-one';

export class Demo extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);
    const instanceType = this.node.tryGetContext('instance_type') || 't3.large';
    const eipAllocationId = this.node.tryGetContext('eip_allocation_id');
    const volumeSize = this.node.tryGetContext('volume_size') || 60;
    const duratin = this.node.tryGetContext('spot_block_duration');
    const keyName = this.node.tryGetContext('ssh_key_name');
    const instanceInterruptionBehavior = this.node.tryGetContext('instance_interruption_behavior') || spotone.InstanceInterruptionBehavior.TERMINATE;
    let spot_block_duration: spotone.BlockDuration;
    let instance_interrupton_behavior: spotone.InstanceInterruptionBehavior;


    switch (instanceInterruptionBehavior) {
      case 'stop': {
        instance_interrupton_behavior = spotone.InstanceInterruptionBehavior.STOP;
        break;
      }
      case 'hibernate': {
        instance_interrupton_behavior = spotone.InstanceInterruptionBehavior.HIBERNATE;
        break;
      }
      default: {
        instance_interrupton_behavior = spotone.InstanceInterruptionBehavior.TERMINATE;
        break;
      }
    }

    switch (duratin) {
      case '0': {
        spot_block_duration = spotone.BlockDuration.NONE;
        break;
      }
      case '1': {
        spot_block_duration = spotone.BlockDuration.ONE_HOUR;
        break;
      }
      case '2': {
        spot_block_duration = spotone.BlockDuration.TWO_HOURS;
        break;
      }
      case '3': {
        spot_block_duration = spotone.BlockDuration.THREE_HOURS;
        break;
      }
      case '4': {
        spot_block_duration = spotone.BlockDuration.FOUR_HOURS;
        break;
      }
      case '5': {
        spot_block_duration = spotone.BlockDuration.FIVE_HOURS;
        break;
      }
      case '6': {
        spot_block_duration = spotone.BlockDuration.SIX_HOURS;
        break;
      }
      default: {
        spot_block_duration = spotone.BlockDuration.SIX_HOURS;
        break;
      }
    }

    const vpc = spotone.VpcProvider.getOrCreate(this);

    const fleet = new spotone.SpotFleet(this, 'SpotFleet', {
      vpc,
      blockDuration: spot_block_duration,
      eipAllocationId: eipAllocationId,
      defaultInstanceType: new ec2.InstanceType(instanceType),
      instanceInterruptionBehavior: instance_interrupton_behavior,
      keyName,
      terminateInstancesWithExpiration: false,
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
