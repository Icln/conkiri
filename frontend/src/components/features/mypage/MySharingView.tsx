'use client';

import { ViewTabItem } from '@/types/sharing';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MyViewTab } from './MyViewTap';
import { SharingList } from '@/components/features/sharing/SharingList';
import { SharingPost } from '@/types/sharing';
import { formatDateTime } from '@/lib/utils/dateFormat';
import { sharingAPI } from '@/lib/api/sharing';
import { useMswInit } from '@/hooks/useMswInit';
import { useSharingScrapStore } from '@/store/useSharingScrapStore';

const ITEMS_PER_PAGE = 10;

export const MySharingView = () => {
  // 상태 관리
  const [allPosts, setAllPosts] = useState<SharingPost[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<SharingPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentTab, setCurrentTab] = useState<ViewTabItem>('scrap');
  const { mswInitialized } = useMswInit();
  const { initScrappedSharings } = useSharingScrapStore();

  // refs
  const containerRef = useRef<HTMLDivElement>(null);

  // 모든 데이터 가져오기
  const fetchData = useCallback(async () => {
    if (!mswInitialized) return;

    // 현재 탭이 null인 경우 데이터를 초기화하고 함수를 종료
    if (currentTab === null) {
      setAllPosts([]);
      setDisplayedPosts([]);
      setHasMore(false);
      return;
    }

    setIsLoading(true);

    try {
      let allData: SharingPost[] = [];
      let lastId: number | undefined = undefined;
      let hasMoreData = true;

      while (hasMoreData) {
        let response;

        switch (currentTab) {
          case 'scrap':
            response = await sharingAPI.getMyScrappedSharings(lastId);
            // 스크랩 스토어 초기화
            if (response && response.sharings) {
              initScrappedSharings(response.sharings);
            }
            break;
          case 'my':
            response = await sharingAPI.getMySharings(lastId);
            break;
          default:
            console.warn(`Unsupported tab: ${currentTab}`);
            hasMoreData = false; // Exit the loop for unsupported tabs
            continue; // Skip the rest of this iteration
        }

        if (
          !response ||
          !response.sharings ||
          !Array.isArray(response.sharings)
        ) {
          console.error('Invalid data format:', response);
          break;
        }

        if (response.sharings.length === 0) {
          hasMoreData = false;
          break;
        }

        allData = [...allData, ...response.sharings];

        if (response.lastPage) {
          hasMoreData = false;
        } else {
          lastId = response.sharings[response.sharings.length - 1].sharingId;
        }
      }

      const formattedPosts = allData.map((post) => ({
        ...post,
        startTime: formatDateTime(post.startTime),
      }));

      setAllPosts(formattedPosts);
      setDisplayedPosts(formattedPosts.slice(0, ITEMS_PER_PAGE));
      setHasMore(formattedPosts.length > ITEMS_PER_PAGE);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [mswInitialized, currentTab]);

  // 초기 데이터 로드
  useEffect(() => {
    if (!mswInitialized) return;

    setCurrentPage(0);
    fetchData();
  }, [mswInitialized, currentTab, fetchData]);

  // 더 보기 핸들러 (리스트 뷰)
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;

    const nextPage = currentPage + 1;
    const start = nextPage * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const nextPosts = allPosts.slice(start, end);

    if (nextPosts.length > 0) {
      setDisplayedPosts((prev) => [...prev, ...nextPosts]);
      setCurrentPage(nextPage);
      setHasMore(end < allPosts.length);
    } else {
      setHasMore(false);
    }
  }, [allPosts, currentPage, hasMore, isLoading]);

  return (
    <div className="relative mx-auto flex h-[calc(100vh-64px)] max-w-[430px] flex-col">
      <div className="fixed left-1/2 top-[56px] z-20 w-full max-w-[430px] -translate-x-1/2 bg-white">
        <MyViewTab currentTab={currentTab} onTabChange={setCurrentTab} />
      </div>
      <div ref={containerRef} className={'flex-1 overflow-auto pt-[44px]'}>
          <SharingList
            posts={displayedPosts}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            currentTab={currentTab}
          />
      </div>
    </div>
  );
};
