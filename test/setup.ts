import { getConnection } from 'typeorm';

global.afterAll(async () => {
  await getConnection().close();
});
