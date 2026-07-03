import HeroBanner from '../components/home/HeroBanner'
import AIStyleFinderSection from '../components/home/AIStyleFinderSection'
import TrendMoodSection from '../components/home/TrendMoodSection'
import FeaturedBrandsSection from '../components/home/FeaturedBrandsSection'
import CuratedCollectionSection from '../components/home/CuratedCollectionSection'

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <AIStyleFinderSection />
      <TrendMoodSection />
      <FeaturedBrandsSection />
      <CuratedCollectionSection />
    </>
  )
}
