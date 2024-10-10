'use client';
import { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PodcastData, PodcastEpisode } from '@/types';
import { fetchPodcast } from '@/app/actions';
import { useRouter, useSearchParams } from 'next/navigation';

const ITEMS_PER_PAGE = 5;

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Loading...' : 'Fetch Podcast'}
    </Button>
  );
};

const PodcastPlayer: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [podcastData, setPodcastData] = useState<PodcastData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1);


  async function onSubmit(formData: FormData) {
    const res = await fetchPodcast(formData);
    if ('error' in res) {
      setError(error);
      setPodcastData(null);
      return;
    }

    setPodcastData(res);
    setError(null);
    router.push(`?url=${formData.get('url')}`);
  }

  function setPageAndPush(newPage: number) {
    setPage(newPage);
    router.replace(`?url=${searchParams.get('url')}&page=${newPage}`);
  }

  useEffect(() => {
    if (searchParams.get('url')) {
      document.querySelector('form')?.requestSubmit();
    }
  }, []);

  const PodcastEpisodeCard: React.FC<{ episode: PodcastEpisode }> = ({ episode }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between">
            {episode.title}
            <p className="font-normal">{episode.pubDate.toLocaleDateString()}</p>
          </div>
        </CardTitle>
        <CardDescription dangerouslySetInnerHTML={{ __html: episode.description && episode.description }} />
      </CardHeader>
      <CardContent>
        <audio controls className="w-full">
          <source src={episode.enclosure.url} type={episode.enclosure.type} />
          Your browser does not support the audio element.
        </audio>
      </CardContent>
    </Card>
  );

  const totalPages = podcastData ? Math.ceil(podcastData.items.length / ITEMS_PER_PAGE) : 0;
  const paginatedEpisodes = podcastData ? podcastData.items.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  ) : [];

  return (
    <div>
      <form action={onSubmit} className="mb-4">
        <div className="flex">
          <Input
            type="text"
            name="url"
            placeholder="Enter podcast RSS URL"
            className="flex-grow mr-2"
            defaultValue={searchParams.get('url') || ""}
          />
          <SubmitButton />
        </div>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {
        podcastData && (
          <div>
            <div className="flex flex-row mb-4">
              <img src={podcastData.image} alt="Podcast" className="w-16 h-16 rounded-full mr-4" />
              <div>
                <h2 className="text-xl font-semibold mb-2">{podcastData.title}</h2>
                <p className="mb-4">{podcastData.description}</p>
              </div>
            </div>
            {paginatedEpisodes.map((episode, index) => (
              <PodcastEpisodeCard key={index} episode={episode} />
            ))}
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => setPageAndPush(Math.max(page - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span>Page {page} of {totalPages}</span>
              <Button
                onClick={() => setPageAndPush(Math.min(page + 1, totalPages))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default PodcastPlayer;
