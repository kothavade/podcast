"use server"

import { parseString } from "xml2js";
import { PodcastData } from "@/types";

export async function fetchPodcast(formData: FormData): Promise<PodcastData | { error: string }> {
  const url = formData.get("url") as string;

  if (!url) {
    return { error: "RSS URL is required" };
  }

  try {
    const response = await fetch(url);
    const xmlData = await response.text();

    return new Promise((resolve) => {
      parseString(xmlData, (err, result) => {
        if (err) {
          resolve({ error: "Failed to parse RSS feed" });
        }

        const channel = result.rss.channel[0];
        const podcastData: PodcastData = {
          title: channel.title[0],
          description: channel.description[0],
          image: channel.image[0].url[0],
          items: channel.item.map((item: any) => ({
            title: item.title[0],
            description: item.description ? item.description[0] : null,
            pubDate: new Date(item.pubDate[0]),
            enclosure: item.enclosure[0].$
          }))
        };

        resolve(podcastData);
      });
    });
  } catch (error) {
    return { error: "Failed to fetch RSS feed" };
  }
}
