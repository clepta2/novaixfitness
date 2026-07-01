# Novaix Fitness - Social Features V2 Plan

## Executive Summary

The current social system is solid (posts, likes, comments, follows, real-time updates, gamification, referrals) but lacks **viral hooks, photo-centric features, deeper engagement loops, and a cohesive bonus system**. This plan adds 3 layers of improvements phased over 8 weeks.

---

## Current State Assessment

### What Works Well (Keep As-Is)
- Real-time posts/likes/comments with Supabase channels
- XP gamification with 13 event types and 30 achievements
- Referral system with NOVAIX codes and +30 days bonus
- Feed filters, trending, user search
- Social Hub 4-tab layout
- Notification system with push + in-app
- Forum with categories and replies

### What Needs Improvement
| Area | Gap | Impact |
|------|-----|--------|
| Photo UX | Basic image picker only, no filters/progression | Low engagement |
| Reactions | Binary like only, no expressive reactions | Flat engagement |
| Stories | Doesn't exist | Missed daily retention |
| Check-ins | No gym/location awareness | No social proof |
| Bonus System | Scattered (referral +30d, XP events) | Unclear value prop |
| Moderation | No reporting/blocking | Safety risk |
| Groups | No community clusters | Weak retention |
| Viral | Share is basic, no referral leaderboards | Low growth |
| Achievements | No social-specific achievements | Undersocialized |

### What's Missing (New Features)
- Photo progress tracking (before/after)
- Story-style ephemeral content
- Gym check-in with location
- Reaction types beyond like
- Daily login/activity bonuses
- User groups/communities
- Content moderation (report/block)
- Referral leaderboard
- Social achievement tier

---

## Phase 1: Quick Wins (Weeks 1-2)

### 1.1 Photo Enhancements
**Goal:** Make photo posts more engaging without overcomplicating.

**Add:**
- `PhotoFilterPicker.js` - 5 preset filters (Warm/Cool/BW/Contrast/Vibrant) using `expo-image-manipulator`
- `BeforeAfterSlider.js` - Side-by-side slider for progress photos (2 images)
- `ProgressPhotoGrid.js` - Timeline grid showing body transformation
- `PostTypeSelector.js` - Toggle between "Post", "Progress Photo", "Before/After"

**Modify:**
- `CreatePostModal.js` → Add post type selector, filter picker, before/after mode
- `PostCard.js` → Render progress photos with slider, show filter badge
- `posts` table → Add `post_type` (text, progress, before_after), `second_image_url`, `filter_applied`

**New migration:**
```sql
ALTER TABLE posts ADD COLUMN post_type TEXT DEFAULT 'text';
ALTER TABLE posts ADD COLUMN second_image_url TEXT;
ALTER TABLE posts ADD COLUMN filter_applied TEXT;
```

### 1.2 Reactions Beyond Likes
**Goal:** Expressive engagement without overwhelming UI.

**Add:**
- `ReactionPicker.js` - Long-press on heart → 6 reactions: ❤️ 💪 🔥 👏 😍 🤯
- `post_reactions` table with UNIQUE(post_id, user_id, type)
- Reaction count breakdown on PostCard
- RPC: `get_post_reactions(post_id)` → returns counts per type

**Modify:**
- `PostActions.js` → Replace single like button with reaction bar
- `useRealtimeLikes.js` → Extend to `post_reactions`
- `social.js` service → `toggleReaction(postId, userId, type)`

**New migration:**
```sql
CREATE TABLE post_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('heart','muscle','fire','clap','love','mindblown')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE TRIGGER update_post_reactions_count
  AFTER INSERT OR DELETE ON post_reactions
  FOR EACH ROW EXECUTE FUNCTION update_count('posts', 'reactions_count', 'post_id');
```

### 1.3 Daily Check-in Bonus
**Goal:** Habit-forming daily return mechanic.

**Add:**
- `DailyCheckIn.js` - Modal on first daily open, grants streak bonus
- `check_in_rewards` table tracking daily claims
- Reward schedule: Day 1=10XP, Day 2=15XP, Day 3=20XP, Day 4=25XP, Day 5=30XP, Day 6=40XP, Day 7=100XP + badge

**Modify:**
- `gamification.js` service → Add `checkIn(userId)`, `getCheckInStreak(userId)`
- `gamification.js` constants → Add `CHECK_IN_REWARDS` array
- `index.js` (login) or `(tabs)/home.js` → Trigger check-in modal

**New migration:**
```sql
CREATE TABLE daily_check_ins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  check_in_date DATE DEFAULT CURRENT_DATE,
  xp_awarded INTEGER DEFAULT 0,
  streak_day INTEGER DEFAULT 1,
  UNIQUE(user_id, check_in_date)
);
```

### 1.4 Content Moderation
**Goal:** Safety basics — report and block.

**Add:**
- `ReportModal.js` - Bottom sheet with reason picker (spam, inappropriate, harassment, other)
- `BlockUser.js` - Block option in user profile and post menu
- `blocked_users` table + `reports` table
- Filter blocked users from feed automatically

**Modify:**
- `PostCard.js` → Add "..." menu with Report/Block options
- `getFeed()` service → Exclude blocked users' posts
- `social.js` → Add `reportContent()`, `blockUser()`, `unblockUser()`

**New migration:**
```sql
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id),
  reported_user_id UUID REFERENCES profiles(id),
  post_id UUID REFERENCES posts(id),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE blocked_users (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, blocked_id)
);
```

---

## Phase 2: Core Features (Weeks 3-5)

### 2.1 Stories (Ephemeral Content)
**Goal:** Daily engagement through temporary visual content.

**Add:**
- `StoryRing.js` - Horizontal scroll of user story circles at feed top
- `StoryViewer.js` - Full-screen story carousel with tap navigation
- `StoryCreateModal.js` - Camera/gallery → add text/sticker → post story
- `stories` table + `story_views` table
- Stories expire after 24 hours (cron job or query filter)

**Modify:**
- `feed.js` → Add StoryRing above posts
- `SocialHub.js` → Stories tab or integrated into Feed

**New migration:**
```sql
CREATE TABLE stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE story_views (
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (story_id, user_id)
);

CREATE INDEX idx_stories_active ON stories(expires_at) WHERE expires_at > NOW();
```

### 2.2 Gym Check-ins
**Goal:** Social proof + location-based community.

**Add:**
- `GymCheckIn.js` - Check-in button with gym name/location
- `CheckInFeed.js` - "Who's at the gym" activity feed
- `GymMap.js` - Optional map view of nearby gym check-ins
- `gym_check_ins` table
- XP reward for check-ins (5 XP each, bonus for consistency)

**Modify:**
- `QuickSocialActions.js` → Add "Check-in" button
- `home.js` → Show recent check-ins from friends
- `gamification.js` → Add CHECK_IN event type

**New migration:**
```sql
CREATE TABLE gym_check_ins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  gym_name TEXT,
  gym_location GEOGRAPHY(POINT, 4326),
  workout_duration INTEGER,
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  checked_out_at TIMESTAMPTZ
);
```

### 2.3 Enhanced Referral System
**Goal:** Viral growth mechanics.

**Add:**
- `ReferralLeaderboard.js` - Top referrers ranked
- `ReferralMilestones.js` - Milestone rewards (5 referrals = 7 days, 10 = 30 days, 25 = 90 days, 50 = lifetime)
- `ReferralShareCard.js` - Beautiful shareable card with code + QR code
- Referral streak tracking

**Modify:**
- `referral.js` service → Add `getReferralLeaderboard()`, `getReferralMilestones()`, `getReferralStats()`
- `InviteFriends.js` → Add leaderboard, milestones, share card
- `gamification.js` → Add REFERRAL event types for milestones
- `gamification.js` constants → Add referral achievements (1/5/10/25/50 referrals)

**New achievements:**
- "Recrutador" - 1 referral
- "Recrutador Pro" - 5 referrals
- "Recrutador Elite" - 10 referrals
- "Recrutador Lenda" - 25 referrals
- "Embaixador Novaix" - 50 referrals

### 2.4 Social Achievements
**Goal:** Reward social engagement specifically.

**Add to gamification constants:**
- "Social Butterfly" - Comment on 50 posts
- "Popular" - Receive 100 likes on posts
- "Influencer" - Get 50 followers
- "Conversador" - Start 10 forum discussions
- "Mentor" - Help 25 people in forum
- "Storyteller" - Post 30 stories
- "Check-in King" - 30 gym check-ins
- "Trending" - Post reaches trending
- "Viral" - Post gets 50+ reactions
- "Community Builder" - Create group with 10+ members

---

## Phase 3: Advanced Features (Weeks 6-8)

### 3.1 Workout Groups
**Goal:** Community clusters for accountability.

**Add:**
- `WorkoutGroups.js` - Browse/create groups (Beginners, Cardio, Strength, etc.)
- `GroupDetail.js` - Group feed, members, challenges
- `GroupChallenge.js` - Group-specific challenges
- `groups` + `group_members` + `group_posts` tables

**New migration:**
```sql
CREATE TABLE workout_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  category TEXT,
  member_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE group_members (
  group_id UUID REFERENCES workout_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin','moderator','member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);

CREATE TABLE group_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES workout_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2 Workout Duels (Challenge a Friend)
**Goal:** Competitive social engagement.

**Add:**
- `DuelInvite.js` - Send workout challenge to friend
- `DuelView.js` - Side-by-side progress comparison
- `duels` table tracking who completes first

**New migration:**
```sql
CREATE TABLE duels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenger_id UUID REFERENCES profiles(id),
  challenged_id UUID REFERENCES profiles(id),
  workout_id UUID,
  challenger_completed BOOLEAN DEFAULT FALSE,
  challenged_completed BOOLEAN DEFAULT FALSE,
  winner_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','completed','expired')),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '48 hours'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.3 Social Feed Algorithm
**Goal:** Show most relevant content.

**Enhance `getFeed()`:**
- Boost posts from followed users
- Boost posts with high engagement velocity (likes in first hour)
- Boost recent posts
- Demote reported/hidden posts
- Personalized ranking based on user interaction history

**New table:**
```sql
CREATE TABLE user_interactions (
  user_id UUID REFERENCES profiles(id),
  post_id UUID REFERENCES posts(id),
  interaction_type TEXT CHECK (interaction_type IN ('view','like','comment','share','save')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.4 Save/Bookmark Posts
**Goal:** Content curation.

**Add:**
- `saved_posts` table
- Bookmark icon on PostCard
- "Saved" tab in profile

**New migration:**
```sql
CREATE TABLE saved_posts (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);
```

---

## Bonus/Incentive System Design

### Daily Bonuses
| Action | XP | Frequency |
|--------|-----|-----------|
| Daily check-in | 10-100 XP | Daily (escalating) |
| Post a photo | 15 XP | Daily cap: 3 |
| Like 5 posts | 5 XP | Daily |
| Comment on 3 posts | 10 XP | Daily |
| Share a workout | 20 XP | Daily |
| Gym check-in | 5 XP | Daily |

### Weekly Bonuses
| Milestone | Reward |
|-----------|--------|
| Post 5 times | 50 XP + badge |
| Get 25 reactions total | 75 XP |
| Comment 15 times | 40 XP |
| Refer 1 friend | 30 days |
| Complete group challenge | 100 XP + badge |

### Milestone Bonuses
| Achievement | Reward |
|-------------|--------|
| 100 posts | "Veterano" badge + 500 XP |
| 500 likes received | "Celebridade" badge + 1000 XP |
| 100 comments | "Comentarista" badge + 300 XP |
| 50 referrals | Lifetime premium + "Embaixador" badge |
| 30-day check-in streak | "Dedicado" badge + 500 XP |
| Post on trending | "Viral" badge + 200 XP |

### Referral Tier Rewards
| Referrals | Bonus Days | Badge |
|-----------|------------|-------|
| 1 | +30 days | Recrutador |
| 5 | +60 days | Recrutador Pro |
| 10 | +90 days | Recrutador Elite |
| 25 | +180 days | Recrutador Lenda |
| 50 | Lifetime | Embaixador Novaix |

### Viral Mechanics
1. **Referral leaderboard** - Monthly top referrers get bonus XP
2. **Share cards** - Beautiful workout/achievement cards for social sharing
3. **Group challenges** - Groups compete against each other
4. **Duels** - Head-to-head workout challenges
5. **Trending posts** - Viral content gets featured placement
6. **Streak sharing** - "30-day streak!" shareable cards

---

## Files to Create

### Phase 1 (Quick Wins)
```
src/components/social/
  PhotoFilterPicker.js          ← Filter selection UI
  BeforeAfterSlider.js          ← Progress photo slider
  ProgressPhotoGrid.js          ← Transformation timeline
  PostTypeSelector.js           ← Text/Progress/B&A toggle
  ReactionPicker.js             ← Long-press reaction menu
  ReactionBar.js                ← Reaction counts display
  DailyCheckIn.js               ← Daily bonus modal
  ReportModal.js                ← Content reporting
  BlockUser.js                  ← User blocking

src/services/
  reactions.js                  ← Reaction CRUD
  checkIn.js                    ← Daily check-in logic
  moderation.js                 ← Report/block logic

src/constants/
  reactions.js                  ← Reaction types config
  checkInRewards.js             ← Daily reward schedule
```

### Phase 2 (Core)
```
src/components/social/
  StoryRing.js                  ← Story circles at feed top
  StoryViewer.js                ← Full-screen story viewer
  StoryCreateModal.js           ← Story creation flow
  GymCheckIn.js                 ← Check-in button/modal
  CheckInFeed.js                ← Who's at the gym
  ReferralLeaderboard.js        ← Top referrers
  ReferralMilestones.js         ← Milestone tracker
  ReferralShareCard.js          ← Shareable referral card

src/services/
  stories.js                    ← Story CRUD + expiry
  gymCheckIn.js                 ← Check-in CRUD
  referrals.js                  ← Enhanced referral logic
```

### Phase 3 (Advanced)
```
src/components/social/
  WorkoutGroups.js              ← Group list/browse
  GroupDetail.js                ← Group feed/members
  GroupChallenge.js             ← Group challenges
  DuelInvite.js                 ← Challenge friend
  DuelView.js                   ← Side-by-side progress
  SaveButton.js                 ← Bookmark posts

src/services/
  groups.js                     ← Group CRUD
  duels.js                      ← Duel logic
  algorithm.js                  ← Feed ranking
```

### Database Migrations
```
supabase/migrations/
  20260701000000_add_post_types.sql         ← post_type, second_image, filter
  20260701000001_create_post_reactions.sql   ← reactions table + trigger
  20260701000002_create_daily_check_ins.sql  ← check-in tracking
  20260701000003_create_reports_blocks.sql   ← moderation tables
  20260708000000_create_stories.sql          ← stories + views
  20260708000001_create_gym_check_ins.sql    ← location check-ins
  20260708000002_enhance_referrals.sql       ← milestones + leaderboard
  20260715000000_create_groups.sql           ← workout groups
  20260715000001_create_duels.sql            ← workout duels
  20260715000002_create_saved_posts.sql      ← bookmarks
  20260715000003_create_user_interactions.sql ← feed algorithm data
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `app/(tabs)/feed.js` | Add StoryRing, save button, check-in |
| `app/social.js` | Add Groups tab, Stories integration |
| `src/components/social/PostCard.js` | Reactions, save, report menu, progress photos |
| `src/components/social/PostActions.js` | Reaction picker, save button |
| `src/components/social/CreatePostModal.js` | Post type selector, filters, before/after |
| `src/components/social/QuickSocialActions.js` | Add check-in, duels |
| `src/components/social/CommentSection.js` | Reactions on comments |
| `src/services/social.js` | Block filtering, save/unsave, reactions |
| `src/services/gamification.js` | New event types, social achievements |
| `src/constants/gamification.js` | New achievements, check-in rewards |
| `src/services/referral.js` | Leaderboard, milestones, enhanced stats |
| `src/components/social/InviteFriends.js` | Leaderboard, milestones, share card |
| `src/hooks/useFeedData.js` | Algorithm integration, saved posts |
| `app/(tabs)/home.js` | Check-in trigger, stories preview |
| `supabase/migrations/...` | All new tables and triggers |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Story storage costs | Compress to 720p, limit 10/story/day, auto-delete after 24h |
| Location privacy (check-ins) | Optional, approximate only, opt-in |
| Moderation backlog | Auto-flag reports, community voting, admin queue |
| Feed algorithm bias | Transparent ranking factors, allow "chronological" toggle |
| Group spam | Approval for public groups, member limits |

---

## Success Metrics

| Metric | Current | Target (8 weeks) |
|--------|---------|-------------------|
| Daily active posters | ~15% | 30% |
| Avg reactions/post | ~2 | 8 |
| Stories posted/day | 0 | 50+ |
| Check-ins/day | 0 | 100+ |
| Referral conversion | ~5% | 15% |
| Group members | 0 | 200+ |
| Content reports/week | 0 | Tracked |
| Avg session time (social) | ~3min | 8min |

---

## Implementation Notes

1. **All new tables need RLS policies** following the existing pattern (SELECT all, INSERT/UPDATE/DELETE own)
2. **All new features need XP event types** in gamification constants
3. **All new tables need Supabase triggers** for count updates where applicable
4. **All new components follow 200-line max** rule from AGENTS.md
5. **All new components export from barrel** at `src/components/social/barrel.js`
6. **All new data goes to src/data/**, not inline in components
7. **All new constants go to src/constants/**, not inline in components
8. **All new services go to src/services/**, not inline in hooks
