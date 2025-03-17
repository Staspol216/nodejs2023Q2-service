<script setup lang="ts">
import { onMounted, ref } from "vue";
import { instance } from "../shared/api";
import { pg } from "../shared/db";

interface TodoItem {
  id: string;
  done: boolean;
  task: string;
}

const tasks = ref<TodoItem[]>([]);

instance.get("artist");

onMounted(async () => {
  await pg.exec(`
  CREATE TABLE IF NOT EXISTS todo (
    id SERIAL PRIMARY KEY,
    task TEXT,
    done BOOLEAN DEFAULT false
  );
  INSERT INTO todo (task, done) VALUES ('Install PGlite from NPM', true);
  INSERT INTO todo (task, done) VALUES ('Load PGlite', true);
`);
  const ret1 = await pg.query(`
  SELECT * from todo;
`);
  console.log(ret1);
  const ret2 = await pg.live.query<TodoItem>(
    "SELECT * FROM todo;",
    [],
    (res) => {
      // res is the same as a standard query result object
      console.log({ res: res.rows });
      tasks.value = res.rows;
    }
  );
  await pg.exec(`
  INSERT INTO todo (task, done) VALUES ('Create a table', true);
  INSERT INTO todo (task, done) VALUES ('Insert some data', true);
  INSERT INTO todo (task) VALUES ('Update a task');
`);
  console.log(ret2);
});
</script>

<template>
  <div class="card">
    <div v-for="task in tasks" :key="task.id">
      {{ task.task }}
    </div>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
