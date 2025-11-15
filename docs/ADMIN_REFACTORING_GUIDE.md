# Admin Pages Refactoring Guide

**Version:** 1.0
**Last Updated:** 2025-01-15
**Purpose:** Hướng dẫn refactor và cải thiện performance cho admin pages

---

## 📚 Table of Contents

1. [Tổng quan](#tổng-quan)
2. [Components đã tạo](#components-đã-tạo)
3. [Cache System](#cache-system)
4. [Pattern & Best Practices](#pattern--best-practices)
5. [Refactoring Checklist](#refactoring-checklist)
6. [Examples](#examples)

---

## 🎯 Tổng quan

Refactoring này tập trung vào:

✅ **Tách component** - Chia nhỏ pages thành components độc lập, dễ maintain
✅ **Cache data** - Implement stale-while-revalidate pattern cho UX tốt hơn
✅ **Loading states** - Consistent loading UI across admin pages
✅ **Client/Server separation** - Tối ưu performance bằng cách tách logic
✅ **Reusability** - Tạo components và utilities có thể tái sử dụng

---

## 🧩 Components đã tạo

### 1. AdminLoading Component

**Location:** `/components/admin/AdminLoading.tsx`

**Variants:**
- `full` - Full page loading (default for top-level pages)
- `card` - Loading inside card container
- `inline` - Small inline spinner

**Usage:**
```tsx
import { AdminLoading } from "@/components/admin"

// Full page loading
if (isLoading) {
  return <AdminLoading message="Đang tải dữ liệu..." />
}

// Card loading
<AdminLoading variant="card" size="lg" message="Loading stats..." />

// Inline loading
<AdminLoading variant="inline" size="sm" message="Refreshing..." />
```

### 2. AdminEmptyState Component

**Location:** `/components/admin/AdminLoading.tsx` (exported từ cùng file)

**Usage:**
```tsx
import { AdminEmptyState } from "@/components/admin"

<AdminEmptyState
  icon={Calendar}
  title="Không có dữ liệu"
  description="Bắt đầu bằng cách tạo item đầu tiên"
  action={{
    label: "Tạo mới",
    onClick: () => handleCreate()
  }}
/>
```

### 3. Settings Page Components

**Location:** `/app/admin/(authenticated)/settings/components/`

**Components:**
- `ToggleOption` - Reusable toggle switch
- `TimeSettings` - Time configuration section
- `AccessControl` - Access control settings
- `EventTheme` - Theme customization
- `SystemInfo` - System information display
- `DangerZone` - Dangerous actions section

**Usage:**
```tsx
import {
  TimeSettings,
  AccessControl,
  SystemInfo
} from "./components"

<TimeSettings
  startTime={startTime}
  endTime={endTime}
  onStartTimeChange={setStartTime}
  onEndTimeChange={setEndTime}
/>
```

---

## 💾 Cache System

### Admin Cache Utility

**Location:** `/lib/admin-cache.ts`

**Features:**
- In-memory cache (fast access)
- LocalStorage fallback (persistence)
- TTL (Time to Live) support
- Stale-while-revalidate pattern

**Basic API:**
```tsx
import { adminCache } from "@/lib/admin-cache"

// Set cache
adminCache.set('key', data, 5 * 60 * 1000) // 5 minutes TTL

// Get cache
const data = adminCache.get('key')

// Get stale data (for SWR)
const result = adminCache.getStale('key')
// { data: {...}, isStale: true/false }

// Delete cache
adminCache.delete('key')

// Clear all cache
adminCache.clear()
```

### useAdminCache Hook

**Location:** `/hooks/useAdminCache.ts`

**Features:**
- Automatic cache management
- Stale-while-revalidate
- Loading & revalidating states
- Manual refetch capability

**Usage:**
```tsx
import { useAdminCache } from "@/hooks/useAdminCache"

const {
  data,           // Cached data
  isLoading,      // Initial loading state
  isRevalidating, // Background revalidation
  error,          // Error if fetch failed
  refetch,        // Manual refetch function
  clearCache      // Clear this cache entry
} = useAdminCache({
  key: 'unique-cache-key',
  fetcher: async () => {
    const res = await fetch('/api/endpoint')
    if (!res.ok) throw new Error('Failed')
    return res.json()
  },
  ttl: 5 * 60 * 1000, // Optional: default 5 minutes
  enableSWR: true,     // Optional: default true
  refetchOnMount: true // Optional: default true
})
```

---

## 📋 Pattern & Best Practices

### 1. Data Fetching Pattern

**❌ Before (Old Pattern):**
```tsx
export default function Page() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>
  // ...
}
```

**✅ After (New Pattern):**
```tsx
export default function Page() {
  const { data, isLoading, isRevalidating } = useAdminCache({
    key: 'page-data',
    fetcher: async () => {
      const res = await fetch('/api/data')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    }
  })

  if (isLoading) return <AdminLoading message="Loading..." />
  // ...
}
```

**Benefits:**
- ✅ Show cached data immediately on revisit
- ✅ Fetch fresh data in background
- ✅ Better perceived performance
- ✅ Automatic error handling
- ✅ Consistent loading states

### 2. Component Separation Pattern

**❌ Before:**
```tsx
export default function SettingsPage() {
  // 500+ lines of code in one file
  return (
    <div>
      {/* Inline JSX for all sections */}
    </div>
  )
}
```

**✅ After:**
```tsx
// page.tsx (Main file - only orchestration logic)
export default function SettingsPage() {
  const { data, isLoading } = useAdminCache({...})
  const [state, setState] = useState()

  if (isLoading) return <AdminLoading />

  return (
    <div>
      <TimeSettings {...props} />
      <AccessControl {...props} />
      <SystemInfo {...props} />
    </div>
  )
}

// components/TimeSettings.tsx (Separate component)
export function TimeSettings({ startTime, onStartTimeChange }) {
  return <AdminCard>...</AdminCard>
}
```

**Benefits:**
- ✅ Easier to read and maintain
- ✅ Components can be reused
- ✅ Faster development (work on isolated components)
- ✅ Better testing
- ✅ Clearer responsibilities

### 3. Folder Structure

**Recommended structure for admin pages:**

```
app/admin/(authenticated)/
└── [page-name]/
    ├── page.tsx              # Main page (orchestration only)
    ├── components/
    │   ├── index.ts          # Barrel export
    │   ├── SectionA.tsx      # Feature sections
    │   ├── SectionB.tsx
    │   └── SharedWidget.tsx  # Shared components
    ├── utils/
    │   ├── validation.ts     # Business logic
    │   ├── formatting.ts
    │   └── helpers.ts
    └── constants/
        └── config.ts         # Static configurations
```

### 4. Loading States Hierarchy

**Use appropriate loading states:**

```tsx
// 1. Initial page load (full page)
if (isLoading && !data) {
  return <AdminLoading message="Loading page..." />
}

// 2. Empty state (no data)
if (!isLoading && (!data || data.length === 0)) {
  return <AdminEmptyState {...} />
}

// 3. Background revalidation (show indicator)
return (
  <div>
    {isRevalidating && <div>Updating...</div>}
    {/* Page content */}
  </div>
)
```

---

## ✅ Refactoring Checklist

Khi refactor một admin page mới, follow checklist này:

### Phase 1: Analysis
- [ ] Đọc code hiện tại, hiểu flow
- [ ] Identify các sections lớn (có thể tách component)
- [ ] Identify shared logic (có thể tách utils)
- [ ] Identify constants/config

### Phase 2: Setup Cache
- [ ] Replace manual fetch bằng `useAdminCache`
- [ ] Set appropriate cache key
- [ ] Set TTL nếu cần custom
- [ ] Replace loading state bằng `AdminLoading`

### Phase 3: Component Extraction
- [ ] Tạo folder `components/`
- [ ] Tách từng section thành component riêng
- [ ] Props interface rõ ràng
- [ ] Export qua `index.ts`

### Phase 4: Utils & Constants
- [ ] Tạo folder `utils/` nếu cần
- [ ] Move business logic vào utils
- [ ] Tạo folder `constants/` nếu có config
- [ ] Move static data vào constants

### Phase 5: Testing & Polish
- [ ] Test loading states
- [ ] Test error states
- [ ] Test cache behavior (refresh page)
- [ ] Test revalidation (wait for TTL)
- [ ] Check TypeScript errors
- [ ] Code review

---

## 💡 Examples

### Example 1: Settings Page Refactor

**Before:** 398 lines in `page.tsx`

**After:**
- `page.tsx`: 216 lines (orchestration)
- `components/TimeSettings.tsx`: 45 lines
- `components/AccessControl.tsx`: 50 lines
- `components/EventTheme.tsx`: 55 lines
- `components/SystemInfo.tsx`: 75 lines
- `components/DangerZone.tsx`: 40 lines
- `components/ToggleOption.tsx`: 35 lines
- `utils/date-utils.ts`: 25 lines

**Result:** 541 lines total (giảm complexity, tăng maintainability)

### Example 2: Analytics Page Cache

**Before:**
```tsx
const [stats, setStats] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetch('/api/stats').then(...)
}, [])
```

**After:**
```tsx
const { data: stats, isLoading, isRevalidating } = useAdminCache({
  key: 'admin-stats',
  fetcher: async () => {
    const res = await fetch('/api/admin/stats')
    if (!res.ok) throw new Error('Failed')
    return res.json()
  }
})
```

**Benefits:**
- First visit: Load data normally
- Second visit: Show cached data instantly, fetch fresh in background
- Better UX, faster perceived performance

---

## 🚀 Next Steps

### Pages cần refactor tiếp theo:

1. **Dashboard** (`/admin/dashboard`)
   - Chia sections: Stats, Charts, Recent Activity
   - Apply cache cho multiple data sources
   - Tách chart components

2. **Candidates** (`/admin/candidates`)
   - Tách CandidateList, CandidateCard
   - Form components riêng
   - Upload utilities

3. **Voting** (`/admin/voting`)
   - Real-time data với cache
   - Chart components
   - Export utilities

4. **Check-in** (`/admin/checkin`)
   - Similar pattern với events page
   - Table components
   - Search & filter utilities

### Improvements cần thêm:

- [ ] Error boundary components
- [ ] Skeleton loaders (thay vì spinner)
- [ ] Optimistic UI updates
- [ ] Cache invalidation strategies
- [ ] Offline support
- [ ] Unit tests cho components
- [ ] Storybook for component library

---

## 📖 References

- [THEME_ADMIN.md](/app/admin/(authenticated)/THEME_ADMIN.md) - Design system
- [useAdminCache Hook](/hooks/useAdminCache.ts) - Cache hook implementation
- [Admin Cache](/lib/admin-cache.ts) - Cache utility
- [Admin Components](/components/admin/) - Shared components

---

**Happy Refactoring! 🎉**

Questions? Check existing refactored pages (settings, analytics, events) as references.
