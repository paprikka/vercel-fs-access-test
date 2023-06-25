import { PrismaClient } from "@prisma/client";
// import { makeLogger } from "../../utils/log";
import type { CommunityEntry, FediAPICommunityEntry } from "../types";
// const log = makeLogger("update-db");

const log = console.log;
const apiResponseToCommunityEntries = (
  apiResponse: FediAPICommunityEntry[]
): CommunityEntry[] => {
  return apiResponse.map((entry) => ({
    id: entry.id,
    instanceDomain: entry.url,
    name: entry.community.name,
    title: entry.community.title,
    description: entry.community.description
      ? entry.community.description.slice(0, 400)
      : "",
    icon: entry.community.icon,
    banner: entry.community.banner,
    nsfw: entry.community.nsfw,
    counts: {
      subscribers: entry.counts.subscribers,
      posts: entry.counts.posts,
      comments: entry.counts.comments,
      usersActiveDay: entry.counts.users_active_day,
    },
  }));
};

const getFediAPIEntries = async (url: string) => {
  const res = await fetch(url);
  const entries = (await res.json()) as FediAPICommunityEntry[];

  return entries;
};

const main = async () => {
  log("Fetching the current list of communities...");
  const getCacheTS = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMidnight = today.getTime();

    return todayMidnight;
  };

  const url = `https://browse.feddit.de/communities.json?nocache=${getCacheTS()}`;

  const fediEntries = await getFediAPIEntries(url);

  const prisma = new PrismaClient();

  log("Removing all communities from the database...");
  await prisma.community.deleteMany({});

  log("Inserting the new community list...");
  await Promise.all(
    fediEntries.map((fediEntry) => {
      return prisma.community.create({
        data: {
          name: fediEntry.community.name,
          title: fediEntry.community.title,
          description: fediEntry.community.description,
          nsfw: fediEntry.community.nsfw,
          icon: fediEntry.community.icon || null,
          banner: fediEntry.community.banner || null,
          countSubscribers: fediEntry.counts.subscribers,
          countPosts: fediEntry.counts.posts,
          countComments: fediEntry.counts.comments,
          countUsersActiveDay: fediEntry.counts.users_active_day,
        },
      });
    })
  );
};

main();

export {};
