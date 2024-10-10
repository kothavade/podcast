import PodcastPlayer from "@/components/PodcastPlayer";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense>
      <PodcastPlayer />
    </Suspense>
  )
}
