// eslint-disable-next-line import/no-extraneous-dependencies
// @ts-ignore
import intformat from 'biguint-format';
import FlakeId from 'flake-idgen';

const flakeIdGen = new FlakeId();

export function generateSnowflakeId() {
  return intformat(flakeIdGen.next(), 'dec');
}
