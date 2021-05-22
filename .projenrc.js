const { AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.80.0',
  name: 'aws-cdk-spotone-sample',
  cdkDependencies: [
    '@aws-cdk/aws-ec2',
  ],
  deps: ['cdk-spot-one'],
  dependabot: false,
  defaultReleaseBranch: 'main',
});

project.setScript('createinstance:diff', 'npx cdk diff -c use_default_vpc=1 -c instance_only=1');
project.setScript('createinstance', 'npx cdk deploy -c use_default_vpc=1 -c instance_only=1');

project.gitignore.exclude('cdk.context.json');

project.synth();
