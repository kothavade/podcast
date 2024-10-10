export type PodcastEpisode = {
  title: string,
  description: string,
  pubDate: Date,
  enclosure: {
    url: string,
    type: string,
  }
}

export type PodcastData = {
  title: string,
  description: string | null,
  image: string,
  items: PodcastEpisode[],
}

export type PodcastResponse = Promise<{
  data: PodcastData | null,
  error: string | null
}>;

