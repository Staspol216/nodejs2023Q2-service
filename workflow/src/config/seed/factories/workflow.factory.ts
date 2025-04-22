import { Workflow } from '../../../entities/workflow.entity';
import { setSeederFactory } from 'typeorm-extension';

export const AlbumFactory = setSeederFactory(Workflow, (faker) => {
  const album = new Workflow({
    id: faker.string.uuid(),
    name: faker.word.adjective(),
    nodes: [],
  });

  return album;
});
