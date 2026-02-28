import { runSeeders } from "typeorm-extension";
import { AppDataSource } from "../ds";
import { seederOptions } from "./seed-func";



AppDataSource.initialize().then(async () => {
  await runSeeders(AppDataSource, seederOptions);
  console.log('✅ Seed');
  process.exit();
});