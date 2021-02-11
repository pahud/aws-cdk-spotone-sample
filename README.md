[![awscdk-run](https://img.shields.io/badge/Deploy%20with-AWSCDK.RUN-blue)](https://awscdk.run)
# aws-cdk-spotone-sample

A sample CDK application to create one durable spot instance with [cdk-spot-one](https://github.com/pahud/cdk-spot-one)

# sample

Create one instance with spot fleet and block duration:

```sh
npx cdk deploy \
-c use_default_vpc=1 \
-c volume_size=100 \
-c instance_type=m5.large \
-c spot_block_duration=6 \
-c ssh_key_name=aws-pahud \
-c eip_allocation_id=eipalloc-0133b41b7fdff3018
```

Create single spot instance only(no fleet):

```sh
npx cdk deploy \
-c use_default_vpc=1 \
-c instance_only=1
```
