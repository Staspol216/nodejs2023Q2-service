import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Workflow } from '../../entities/workflow.entity';

export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ) {
    console.log('seeding Workflow...');
    const workflowFactory = factoryManager.get(Workflow);
    await workflowFactory.saveMany(10);
  }
}
