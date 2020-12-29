const { AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.77.0',
  name: 'aws-cdk-spotone-sample',
  cdkDependencies: [
    '@aws-cdk/aws-ec2',
  ],
  deps: ['cdk-spot-one'],
  dependabot: false,
});

project.gitignore.exclude('cdk.context.json');

project.synth();
