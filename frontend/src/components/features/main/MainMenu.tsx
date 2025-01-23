'use client';

import { MenuItem } from '@/components/common/Navigation/MenuItem';

export default function MainMenu() {
  const menuItems = [
    { icon: '🎭', label: '시야 보기', href: '/sight' },
    { icon: '🗺️', label: '나눔 지도', href: '/sharing' },
    { icon: '🎟️', label: '티켓팅 연습', href: '/ticketing' },
    { icon: '📊', label: '혼잡도 보기', href: '/congestion' },
  ];
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[50vh] w-full mobile:h-[65vh] tablet:h-[60vh]">
      <div className="grid h-full grid-cols-2 gap-sm rounded-t-layout bg-white p-sm tablet:gap-md tablet:p-md">
        {menuItems.map((item) => (
          <MenuItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
          />
        ))}
      </div>
    </div>
  );
}
