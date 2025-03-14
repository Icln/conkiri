import { useEffect } from 'react';
import { Section as SectionComponent } from '../../../ui/Section';
import { useParams, useRouter } from 'next/navigation';
import { useSectionPositions } from '@/hooks/useSectionPositions';
import { useSectionStore } from '@/store/useSectionStore';
import { SectionComponentProps } from '@/types/sections';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface SectionListProps {
  isScrapMode: boolean;
}

export const SectionList = ({ isScrapMode }: SectionListProps) => {
  const { arenaId, stageType } = useParams();
  const router = useRouter();

  const sections = useSectionStore((state) => state.sections);
  const isLoading = useSectionStore((state) => state.isLoading);
  const error = useSectionStore((state) => state.error);
  const fetchSectionsByArena = useSectionStore(
    (state) => state.fetchSectionsByArena
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!arenaId || !stageType) return;
      await fetchSectionsByArena(Number(arenaId), Number(stageType));
    };

    fetchData();
  }, [arenaId, stageType, fetchSectionsByArena]);

  const { calculatePosition } = useSectionPositions(sections.length);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        Loading sections...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="relative h-96 w-full">
      <div className="absolute inset-0">
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={3}
          centerOnInit
          panning={{ velocityDisabled: true }}
          smooth={true}
        >
          <TransformComponent
            wrapperClass="!w-full !h-full" // !important 추가
            contentClass="!w-full !h-full flex items-center justify-center" // 중앙 정렬 추가
          >
            <svg
              viewBox="-270 -330 700 700"
              preserveAspectRatio="xMidYMid meet"
              className="h-full w-full"
            >
              <g transform="translate(-600, -400) scale(1.7)">
                {sections.map((section, index) => {
                  const position = calculatePosition(index);
                  const sectionProps: SectionComponentProps = {
                    sectionId: section.sectionId,
                    sectionNumber: parseInt(section.sectionName),
                    available: section.available,
                    scrapped: section.isScraped,
                    arenaId: section.arenaId,
                    ...position,
                    onClick: () =>
                      router.push(
                        `/sight/${arenaId}/${stageType}/${section.sectionId}`
                      ),
                    isScrapMode,
                  };

                  return (
                    <SectionComponent
                      key={section.sectionId}
                      {...sectionProps}
                    />
                  );
                })}
              </g>
            </svg>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
};

export default SectionList;
