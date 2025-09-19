import { execSync } from 'child_process';

const globalTeardown = async (): Promise<void> => {
  execSync('docker stop db-test');
  execSync('docker rm db-test');
};

export default globalTeardown;
