# BRIGHT4EVENT Realtime Backend Architecture

## 🏗️ System Overview

This document describes the realtime voting system architecture, designed to support:
- **1,000 votes/second** sustained throughput
- **<200ms latency** from vote to UI update
- **10,000 concurrent connections**
- **Multi-instance horizontal scaling**

---

## 📊 Current Architecture (Supabase)

### Technology Stack
```
Frontend (Next.js)
    ↓ WebSocket
Supabase Realtime
    ↓ Postgres LISTEN/NOTIFY
PostgreSQL Database
```

### Data Flow
```
1. User clicks vote → POST /api/votes/submit
2. API validates + inserts into DB
3. Postgres triggers NOTIFY event
4. Supabase Realtime broadcasts to clients
5. Frontend hook receives update
6. UI updates with animation
```

### Current Implementation

**Database Schema:**
```sql
-- Votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id),
  candidate_id UUID NOT NULL REFERENCES candidates(id),
  voter_id UUID NOT NULL,
  voter_type VARCHAR(20) CHECK (voter_type IN ('user', 'guest')),
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate votes
  UNIQUE(event_id, voter_id)
);

-- Candidates table
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id),
  category_id UUID NOT NULL REFERENCES categories(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id),
  name VARCHAR(255) NOT NULL,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes (Required for Performance):**
```sql
-- Critical for vote counting
CREATE INDEX idx_votes_candidate_id ON votes(candidate_id);
CREATE INDEX idx_votes_event_id ON votes(event_id);
CREATE INDEX idx_votes_created_at ON votes(created_at DESC);

-- For leaderboard queries
CREATE INDEX idx_candidates_event_id ON candidates(event_id);
CREATE INDEX idx_candidates_category_id ON candidates(category_id);

-- Composite index for vote counting by event
CREATE INDEX idx_votes_event_candidate ON votes(event_id, candidate_id);
```

**Realtime Subscription:**
```typescript
// hooks/useRealtimeResults.ts
const channel = supabase
  .channel(`event-${eventId}-results`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'votes',
      filter: `event_id=eq.${eventId}`
    },
    (payload) => {
      handleNewVote(payload.new);
    }
  )
  .subscribe();
```

### Current Performance Issues

**Problems:**
1. ❌ Full table scan on every vote count query
2. ❌ N+1 queries for categories → candidates → vote counts
3. ❌ No caching layer
4. ❌ Client receives ALL vote inserts (too chatty)
5. ❌ No debouncing on rapid updates

**Solutions:**
1. ✅ Add proper indexes (see above)
2. ✅ Use single query with JOINs + aggregation
3. ✅ Implement Redis caching
4. ✅ Batch updates on server side
5. ✅ Debounce on client side

---

## 🚀 Optimized Architecture

### Option 1: Enhanced Supabase (Recommended)

**Architecture:**
```
┌─────────────┐
│   Next.js   │
│   Frontend  │
└──────┬──────┘
       │ WebSocket
       ▼
┌─────────────────┐
│    Supabase     │
│    Realtime     │
└────────┬────────┘
         │
    ┌────┴────────────┐
    ▼                 ▼
┌────────┐      ┌──────────┐
│ Redis  │◄─────┤Postgres  │
│ Cache  │      │ Database │
└────────┘      └──────────┘
```

**Implementation:**

**1. Optimized Vote Query (Single Query):**
```sql
-- Create materialized view for fast leaderboard
CREATE MATERIALIZED VIEW leaderboard_stats AS
SELECT
  e.id as event_id,
  cat.id as category_id,
  cat.name as category_name,
  c.id as candidate_id,
  c.name as candidate_name,
  c.description,
  c.photo_url,
  COUNT(v.id) as vote_count,
  RANK() OVER (
    PARTITION BY cat.id
    ORDER BY COUNT(v.id) DESC
  ) as rank
FROM events e
CROSS JOIN categories cat
LEFT JOIN candidates c ON c.category_id = cat.id
LEFT JOIN votes v ON v.candidate_id = c.id
WHERE cat.event_id = e.id
GROUP BY e.id, cat.id, cat.name, c.id, c.name, c.description, c.photo_url;

-- Create unique index for fast refresh
CREATE UNIQUE INDEX idx_leaderboard_stats ON leaderboard_stats(event_id, category_id, candidate_id);

-- Auto-refresh on vote insert (trigger)
CREATE OR REPLACE FUNCTION refresh_leaderboard_stats()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_stats;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_refresh_leaderboard
AFTER INSERT ON votes
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_leaderboard_stats();
```

**2. Redis Caching Layer:**
```typescript
// lib/cache.ts
import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL
});

export async function getCachedLeaderboard(eventId: string) {
  const cached = await redis.get(`leaderboard:${eventId}`);
  if (cached) {
    return JSON.parse(cached);
  }
  return null;
}

export async function setCachedLeaderboard(eventId: string, data: any) {
  await redis.setex(
    `leaderboard:${eventId}`,
    60, // TTL: 60 seconds
    JSON.stringify(data)
  );
}

export async function incrementVoteCount(candidateId: string) {
  // Atomic increment
  return await redis.incr(`votes:${candidateId}`);
}
```

**3. Vote Submission API with Caching:**
```typescript
// app/api/votes/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { incrementVoteCount, setCachedLeaderboard } from '@/lib/cache';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  // 1. Rate limiting
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const rateLimitResult = await rateLimit(ip);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  // 2. Parse request
  const { candidateId, voterId, voterType } = await req.json();

  // 3. Validate input
  if (!candidateId || !voterId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // 4. Insert vote (database will handle uniqueness)
  const supabase = createClient();
  const { data, error } = await supabase
    .from('votes')
    .insert({
      candidate_id: candidateId,
      voter_id: voterId,
      voter_type: voterType,
      ip_address: ip,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      return NextResponse.json(
        { error: 'Already voted' },
        { status: 409 }
      );
    }
    console.error('Vote submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit vote' },
      { status: 500 }
    );
  }

  // 5. Increment Redis counter (for quick stats)
  const newCount = await incrementVoteCount(candidateId);

  // 6. Invalidate cache
  const { data: candidate } = await supabase
    .from('candidates')
    .select('event_id')
    .eq('id', candidateId)
    .single();

  if (candidate) {
    await setCachedLeaderboard(candidate.event_id, null); // Clear cache
  }

  // 7. Success response
  return NextResponse.json({
    success: true,
    voteCount: newCount,
    voteId: data.id,
  });
}
```

**4. Rate Limiting:**
```typescript
// lib/rate-limit.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function rateLimit(identifier: string) {
  // Sliding window rate limiting
  const key = `rate-limit:${identifier}`;
  const now = Date.now();
  const window = 60 * 1000; // 60 seconds
  const maxRequests = 10;

  // Remove old entries
  await redis.zremrangebyscore(key, 0, now - window);

  // Count requests in current window
  const count = await redis.zcard(key);

  if (count >= maxRequests) {
    return { success: false, remaining: 0 };
  }

  // Add current request
  await redis.zadd(key, { score: now, member: `${now}:${Math.random()}` });
  await redis.expire(key, 60);

  return {
    success: true,
    remaining: maxRequests - count - 1,
  };
}
```

**5. Optimized Realtime Hook:**
```typescript
// hooks/useRealtimeResults.ts
import { useEffect, useState, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase-client';
import debounce from 'lodash/debounce';

export function useRealtimeResults(eventId: string) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState({ /* ... */ });
  const [loading, setLoading] = useState(true);

  // Fetch initial data from cache or DB
  const fetchResults = useCallback(async () => {
    const response = await fetch(`/api/events/${eventId}/results`);
    const data = await response.json();
    setCategories(data.categories);
    setStats(data.stats);
    setLoading(false);
  }, [eventId]);

  // Debounced refetch (prevents UI thrashing)
  const debouncedFetch = useMemo(
    () => debounce(fetchResults, 300, { leading: true, trailing: true }),
    [fetchResults]
  );

  // Subscribe to realtime updates
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`event-${eventId}-results`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'votes',
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          // Trigger debounced refetch
          debouncedFetch();

          // Trigger celebration effect (if callback set)
          if (onNewVoteCallback) {
            onNewVoteCallback();
          }
        }
      )
      .subscribe();

    // Initial fetch
    fetchResults();

    return () => {
      supabase.removeChannel(channel);
      debouncedFetch.cancel();
    };
  }, [eventId, debouncedFetch]);

  return { categories, stats, loading };
}
```

**6. Results API with Caching:**
```typescript
// app/api/events/[eventId]/results/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getCachedLeaderboard, setCachedLeaderboard } from '@/lib/cache';

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const { eventId } = params;

  // Try cache first
  const cached = await getCachedLeaderboard(eventId);
  if (cached) {
    return NextResponse.json(cached, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  }

  // Query from materialized view
  const supabase = createClient();
  const { data, error } = await supabase
    .from('leaderboard_stats')
    .select('*')
    .eq('event_id', eventId)
    .order('category_id')
    .order('rank');

  if (error) {
    console.error('Leaderboard query error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }

  // Transform data into nested structure
  const categories = /* transform logic */;
  const stats = /* calculate stats */;

  const result = { categories, stats };

  // Cache result
  await setCachedLeaderboard(eventId, result);

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
    },
  });
}
```

---

### Option 2: Custom Node.js + Socket.IO + Redis

**Architecture:**
```
┌─────────────┐
│   Next.js   │
│   Frontend  │
└──────┬──────┘
       │ Socket.IO
       ▼
┌─────────────────┐
│   Node.js API   │
│   + Socket.IO   │
│   Server        │
└────┬─────┬──────┘
     │     │
     │     └─────────┐
     ▼               ▼
┌────────┐      ┌──────────┐
│ Redis  │      │Postgres  │
│ PUB/SUB│      │ Database │
└────────┘      └──────────┘
```

**Implementation:**

**Server (server.js):**
```javascript
const express = require('express');
const { Server } = require('socket.io');
const { createClient } = require('redis');
const { Pool } = require('pg');

const app = express();
const server = require('http').createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL },
  transports: ['websocket', 'polling'],
});

// Redis clients
const redis = createClient({ url: process.env.REDIS_URL });
const redisSub = redis.duplicate();
const redisPub = redis.duplicate();

// Postgres pool
const pg = new Pool({ connectionString: process.env.DATABASE_URL });

// Connect Redis
(async () => {
  await redis.connect();
  await redisSub.connect();
  await redisPub.connect();
})();

// Vote submission endpoint
app.post('/api/votes/submit', async (req, res) => {
  const { candidateId, voterId, eventId } = req.body;

  try {
    // 1. Atomic increment in Redis
    const voteCount = await redis.incr(`votes:${candidateId}`);

    // 2. Async insert into Postgres (don't await)
    pg.query(
      'INSERT INTO votes (candidate_id, voter_id, event_id) VALUES ($1, $2, $3)',
      [candidateId, voterId, eventId]
    ).catch(err => console.error('DB insert error:', err));

    // 3. Publish update to Redis channel
    await redisPub.publish(
      `event:${eventId}:votes`,
      JSON.stringify({
        type: 'new_vote',
        candidateId,
        voteCount,
        timestamp: Date.now(),
      })
    );

    res.json({ success: true, voteCount });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Failed to submit vote' });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_event', async (eventId) => {
    socket.join(`event:${eventId}`);

    // Send current leaderboard
    const leaderboard = await getLeaderboard(eventId);
    socket.emit('leaderboard_update', leaderboard);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Subscribe to Redis updates
redisSub.subscribe('event:*:votes', (message, channel) => {
  const eventId = channel.split(':')[1];
  const update = JSON.parse(message);

  // Broadcast to all clients in this event room
  io.to(`event:${eventId}`).emit('vote_update', update);
});

// Helper: Get leaderboard from Redis/DB
async function getLeaderboard(eventId) {
  // Try cache
  const cached = await redis.get(`leaderboard:${eventId}`);
  if (cached) return JSON.parse(cached);

  // Query DB
  const result = await pg.query(`
    SELECT
      c.id, c.name, c.photo_url,
      COUNT(v.id) as vote_count,
      RANK() OVER (ORDER BY COUNT(v.id) DESC) as rank
    FROM candidates c
    LEFT JOIN votes v ON v.candidate_id = c.id
    WHERE c.event_id = $1
    GROUP BY c.id
    ORDER BY rank
  `, [eventId]);

  const leaderboard = result.rows;

  // Cache for 30 seconds
  await redis.setex(`leaderboard:${eventId}`, 30, JSON.stringify(leaderboard));

  return leaderboard;
}

server.listen(3001, () => {
  console.log('Realtime server running on port 3001');
});
```

**Frontend Integration:**
```typescript
// hooks/useSocketResults.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocketResults(eventId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      socketInstance.emit('join_event', eventId);
    });

    socketInstance.on('leaderboard_update', (data) => {
      setCategories(data.categories);
      setStats(data.stats);
    });

    socketInstance.on('vote_update', (update) => {
      // Optimistic update
      setCategories(prev => updateCategoriesWithVote(prev, update));

      // Trigger celebration
      triggerCelebration('newVote');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [eventId]);

  return { categories, stats };
}
```

---

### Option 3: Serverless (Pusher/Ably)

**Architecture:**
```
┌─────────────┐
│   Next.js   │
│   Frontend  │
└──────┬──────┘
       │ WebSocket
       ▼
┌─────────────────┐
│  Pusher/Ably    │
│  (Managed)      │
└─────────────────┘
       ▲
       │ HTTP Trigger
┌──────┴──────┐
│  Vercel     │
│  Serverless │
│  Function   │
└──────┬──────┘
       │
       ▼
┌──────────┐
│Postgres  │
│ Database │
└──────────┘
```

**Pros:**
- Zero infrastructure management
- Auto-scaling
- Global edge network

**Cons:**
- Higher cost at scale
- Vendor lock-in
- Less control

---

## 📈 Performance Benchmarks

### Target Metrics:
| Metric | Target | Measurement |
|--------|--------|-------------|
| Vote latency (DB write) | < 50ms | Time from API call to DB commit |
| Realtime latency (end-to-end) | < 200ms | Vote submission → UI update |
| Concurrent connections | 10,000+ | WebSocket connections |
| Throughput | 1,000 votes/sec | Sustained load |
| Error rate | < 0.1% | Failed requests / total requests |

### Load Testing Script (k6):
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 100 },   // Ramp to 100 users
    { duration: '3m', target: 500 },   // Ramp to 500 users
    { duration: '5m', target: 1000 },  // Sustained 1000 users
    { duration: '1m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% < 500ms
    http_req_failed: ['rate<0.01'],   // <1% errors
  },
};

export default function () {
  const candidateId = `candidate-${Math.floor(Math.random() * 10) + 1}`;
  const voterId = `voter-${__VU}`;

  const payload = JSON.stringify({
    candidateId,
    voterId,
    eventId: 'test-event-123',
  });

  const res = http.post('https://yourapp.com/api/votes/submit', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(Math.random() * 3); // Random wait 0-3s
}
```

**Run test:**
```bash
k6 run --vus 100 --duration 5m load-test.js
```

---

## 🔒 Security Considerations

### 1. Rate Limiting
- **Per IP:** 10 votes/minute
- **Per User:** 1 vote/3 seconds
- **Global:** 1000 votes/second (circuit breaker)

### 2. Authentication
```typescript
// Verify JWT token
const token = req.headers.get('Authorization')?.replace('Bearer ', '');
const { data: user, error } = await supabase.auth.getUser(token);

if (error || !user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### 3. Input Validation
```typescript
import { z } from 'zod';

const VoteSchema = z.object({
  candidateId: z.string().uuid(),
  voterId: z.string().uuid(),
  voterType: z.enum(['user', 'guest']),
});

const validated = VoteSchema.parse(req.body);
```

### 4. SQL Injection Prevention
- Use parameterized queries
- Never concatenate user input

### 5. CORS Policy
```typescript
// Only allow from your domain
const allowedOrigins = [
  'https://bright4event.com',
  'https://www.bright4event.com',
];

if (!allowedOrigins.includes(req.headers.get('origin') || '')) {
  return new Response('Forbidden', { status: 403 });
}
```

---

## 📊 Monitoring & Observability

### Key Metrics to Track:

**1. Application Metrics:**
- Vote submission rate (votes/second)
- Average response time
- Error rate
- Active WebSocket connections

**2. Database Metrics:**
- Query latency
- Connection pool usage
- Cache hit rate
- Index usage

**3. Infrastructure Metrics:**
- CPU usage
- Memory usage
- Network I/O
- Redis operations/second

### Setup with Vercel Analytics:
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Custom Event Tracking:
```typescript
import { track } from '@vercel/analytics';

// Track vote submission
track('vote_submitted', {
  candidateId,
  categoryId,
  eventId,
  duration: Date.now() - startTime,
});

// Track rank change
track('rank_changed', {
  candidateId,
  oldRank,
  newRank,
  celebrationShown: true,
});
```

---

## 🚨 Incident Response

### Runbook for Common Issues:

**Issue: Realtime updates stopped**
```bash
# 1. Check Supabase status
curl https://status.supabase.com/api/v2/status.json

# 2. Check database connections
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"

# 3. Restart Realtime subscriptions (client-side)
# User refreshes page or app auto-reconnects
```

**Issue: Slow vote submissions**
```bash
# 1. Check slow queries
psql $DATABASE_URL -c "SELECT query, mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;"

# 2. Check index usage
psql $DATABASE_URL -c "SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0;"

# 3. Refresh materialized view
psql $DATABASE_URL -c "REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_stats;"
```

**Issue: High error rate**
```bash
# 1. Check logs
vercel logs --follow

# 2. Check Sentry for errors
# Go to sentry.io dashboard

# 3. Enable feature flag to disable problematic feature
# Set flag: enable_realtime_updates = false
```

---

## 📚 Further Reading

- [Supabase Realtime Documentation](https://supabase.com/docs/guides/realtime)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [k6 Load Testing](https://k6.io/docs/)

---

**Document Version:** 1.0.0
**Last Updated:** 2025-01-14
**Owner:** BRIGHT4EVENT Engineering Team
