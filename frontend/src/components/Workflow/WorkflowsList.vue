<script setup lang="ts">
import { inject, onMounted, ref } from "vue";
import { instance } from "../../shared/api";
import type { DB } from "../../app/db";
import { useRouter } from "vue-router";

// interface Artist {
//   grammy: boolean;
//   id: string;
//   name: string;
// }

interface Workflow {
  id: string;
  name: string;
}

const router = useRouter();

const db = inject<DB>("db")!;

const workflows = ref<Workflow[]>([]);

const getWorkflows = async () => {
  const response = await instance.get("workflow");
  workflows.value = response.data;
};

const handleClickWorkflow = (id: string) => {
  router.push({ name: "workflow", params: { id } });
};

getWorkflows();

onMounted(async () => {
  db.exec(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  db.exec(`CREATE TABLE IF NOT EXISTS "track" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "name" character varying NOT NULL,
    "duration" integer NOT NULL,
    "albumId" uuid, "artistId" uuid,
    CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY ("id")
  );
  CREATE TABLE "artist" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "name" character varying NOT NULL,
    "grammy" boolean NOT NULL,
    CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id")
  );
  `);
  const shape = await db.electric.syncShapesToTables({
    shapes: {
      artist: {
        shape: {
          url: "http://localhost:3000/v1/shape",
          params: { table: "artist" },
        },
        table: "artist",
        primaryKey: ["id"],
      },
      track: {
        shape: {
          url: "http://localhost:3000/v1/shape",
          params: { table: "track" },
        },
        table: "track",
        primaryKey: ["id"],
      },
    },
    key: "my-sync", // or null if the sync state does not need to be persisted
    onInitialSync: () => {
      console.log("Initial sync complete");
    },
  });
  shape.streams.artist.subscribe((messsages) => {
    console.log(messsages, "artist");
    // artists.value = messsages.map((messsage) => messsage?.value) as Artist[];
  });
  // shape.streams.track.subscribe((mess) => {
  //   console.log(mess, "track");
  // });
});
</script>

<template>
  <div class="flex min-w-[240px] flex-col gap-1 p-1.5">
    <div
      v-for="workflow in workflows"
      :key="workflow.id"
      class="mt-1 text-slate-800 border-1 flex w-full items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 cursor-pointer"
      role="button"
      @click="() => handleClickWorkflow(workflow.id)"
    >
      {{ workflow.name }}
    </div>
    <div
      class="relative flex flex-col rounded-lg bg-white shadow-sm border border-slate-200"
    ></div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
