# Plan: Finalize LinkedIn-style jobs schema design doc

## Context

Turn `modified schema.md` (a rough idea list) into the reviewed, decision-complete schema design for the app's LinkedIn-style pivot: people post as today, plus companies, company memberships granted through a request-and-approve flow, job postings, job search, company follows, and saved jobs. Deliverable is the design document only — no Prisma schema edit, no migration, no app code in this change; those follow as a separate feature once the design is approved. The rewrite must specify every table and column of the final schema (existing tables unchanged, new tables added) plus the rules that govern roles, membership requests, publishing, search, filters, and counters.

## Approach

### 1. Replace the contents of `modified schema.md` with the final design document

Rewrite the whole file (it currently holds only the rough bullet sketch). The file must contain exactly these sections, in this order:

- A title line naming the document as the target schema for the LinkedIn-style pivot, and one sentence stating it is a design spec that supersedes the earlier sketch and is not yet applied to the schema definition file.
- `## Tables` — one `### <model>` subsection per model, in this order: `user`, `session`, `account`, `verification`, `post`, `post_likes`, `post_image`, `post_comment`, `comment_reply`, `comment_like`, `reply_like`, `follow`, `notification`, `company`, `company_member`, `company_member_request`, `company_follow`, `job`, `saved_job`.
- `## Enums` — one block per enum, listing member values.
- `## Rules` — behavior rules tied to the schema.

Each model subsection contains:
- A markdown table with header `| Column | Type | Null | Notes |` and one row per column, in the order listed in step 2.
- A `Keys and indexes:` bullet list for that model (primary key, unique constraints, indexes, relation targets) exactly as specified in step 3.

Existing models (`user` through `notification`): reproduce their columns, types, nullability, defaults, and keys verbatim from `packages/prisma/prisma/schema.prisma` (read that file during implementation; do not reword). `user` additionally gets the four new columns listed in step 2. `post`, `post_comment`, and `follow` gain nothing. `notification` additionally gets one column, listed in step 2. The document must state that `notification.type` stays a free-form string, that job activity produces no notifications, and that company membership requests produce exactly two notification types.

### 2. Column lists (exact)

`user` — all current columns unchanged (`id`, `name`, `email`, `emailVerified`, `image`, `isAnonymous`, `createdAt`, `updatedAt`, `followerCount`, `followingCount`), plus these four new columns, appended in this order:

| Column | Type | Null | Notes |
|---|---|---|---|
| role | UserRole | no | Default `user`. Self-declared recruiter badge; carries no permissions. |
| headline | String | yes | Short job title / tagline shown on profile. |
| bio | String | yes | Profile about text. |
| country | String | yes | Free-text country name, e.g. `United States`. Not an ISO code. |

`company` — new table:

| Column | Type | Null | Notes |
|---|---|---|---|
| id | String | no | Primary key. |
| name | String | no | Display name. Not unique. |
| slug | String | no | Unique. Lowercased name, non-alphanumerics to `-`, runs collapsed, random suffix appended on collision. Set once at creation. |
| description | String | yes | Company about text. |
| image | String | yes | Logo URL. |
| coverImage | String | yes | Cover/banner URL for company page header. |
| industry | String | yes | Free-text industry. |
| website | String | yes | Company website URL. |
| size | CompanySize | yes | Employee tier. Range per `## Enums`. |
| country | String | yes | Free-text country name. |
| followerCount | Int | no | Default 0. Denormalized count of `company_follow` rows. |
| memberCount | Int | no | Default 0. Denormalized count of `company_member` rows. |
| jobCount | Int | no | Default 0. Denormalized count of `job` rows. |
| createdAt | DateTime | no | Default now. |
| updatedAt | DateTime | no | Auto-updated. |

`company_member` — new table, one row per approved member of a company:

| Column | Type | Null | Notes |
|---|---|---|---|
| id | String | no | Primary key. |
| companyId | String | no | FK to `company`. |
| userId | String | no | FK to `user`. |
| role | CompanyRole | no | `owner`, `recruiter`, or `member`. |
| roleName | String | no | The member's own title at this company, e.g. `Technical Recruiter`. Required, never empty. The member sets it; the owner may correct it. |
| createdAt | DateTime | no | Default now. |

`company_member_request` — new table, one row per request to join a company:

| Column | Type | Null | Notes |
|---|---|---|---|
| id | String | no | Primary key. |
| companyId | String | no | FK to `company`. |
| userId | String | no | FK to `user`. The requester. |
| requestedRole | CompanyRole | no | Role the requester asks for: `recruiter` or `member`. `owner` is never requested. |
| roleName | String | no | Title the requester wants at this company, e.g. `Technical Recruiter`. Required, never empty. |
| status | RequestStatus | no | Default `pending`. |
| decidedById | String | yes | FK to `user`. The company owner who decided the request. Null while `pending`. |
| decidedAt | DateTime | yes | Set when the request leaves `pending`. Null while `pending`. |
| createdAt | DateTime | no | Default now. |

`company_follow` — new table:

| Column | Type | Null | Notes |
|---|---|---|---|
| id | String | no | Primary key. |
| userId | String | no | FK to `user`. |
| companyId | String | no | FK to `company`. |
| createdAt | DateTime | no | Default now. |

`job` — new table:

| Column | Type | Null | Notes |
|---|---|---|---|
| id | String | no | Primary key. |
| title | String | no | Job title. |
| slug | String | no | Unique. Lowercased title, non-alphanumerics to `-`, runs collapsed, random suffix appended on collision. Set once at creation, never regenerated when title changes. |
| description | String | yes | Job description text. |
| companyId | String | no | FK to `company`. |
| postedById | String | no | FK to `user`. The recruiter who published the job. |
| status | JobStatus | no | Default `draft`. |
| jobType | JobType | no | Employment type. |
| remoteType | RemoteType | yes | Workplace mode. |
| experienceLevel | ExperienceLevel | yes | Required experience tier. |
| country | String | yes | Free-text country name. |
| salaryMin | Int | yes | Lower bound of the range. |
| salaryMax | Int | yes | Upper bound of the range. |
| salaryCurrency | String | no | Default `USD`. ISO 4217 code. |
| salaryPeriod | SalaryPeriod | yes | `hourly`, `monthly`, or `yearly`. |
| tags | String[] | no | Default empty array. Free-text skill/keyword labels. |
| applyUrl | String | yes | External application URL (company ATS or form). |
| applyCount | Int | no | Default 0. Increments on each Apply click. |
| savedCount | Int | no | Default 0. Denormalized count of `saved_job` rows. |
| deadline | DateTime | yes | Application deadline. |
| publishedAt | DateTime | yes | Set when status first becomes `open`. |
| closedAt | DateTime | yes | Set when status becomes `closed`. |
| createdAt | DateTime | no | Default now. |
| updatedAt | DateTime | no | Auto-updated. |

`notification` — all current columns unchanged (`id`, `recipientId`, `postId`, `actorId`, `type`, `read`, `createdAt`), plus this one new column, appended last:

| Column | Type | Null | Notes |
|---|---|---|---|
| companyId | String | yes | FK to `company`. Set only for company membership notifications; null for social notifications. |

`saved_job` — new table:

| Column | Type | Null | Notes |
|---|---|---|---|
| id | String | no | Primary key. |
| userId | String | no | FK to `user`. |
| jobId | String | no | FK to `job`. |
| createdAt | DateTime | no | Default now. |

### 3. Keys, indexes, and relations (exact)

- `user`: primary key `id`; unique `email`. Indexes on `followerCount`/`followingCount` only if present in `packages/prisma/prisma/schema.prisma` today — copy the existing file's keys verbatim.
- `session`, `account`, `verification`, `post_likes`, `post_image`, `post_comment`, `comment_reply`, `comment_like`, `reply_like`, `follow`, `notification`: copy keys and indexes verbatim from `packages/prisma/prisma/schema.prisma`.
- `company`: primary key `id`; unique `slug`. Index on `country`.
- `company_member`: primary key `id`; unique `[companyId, userId]`. Index on `userId`.
- `company_member_request`: primary key `id`. Indexes on `companyId`, `userId`, and `status`. At most one `pending` request per user per company is enforced in application code, not by a database constraint, because a partial unique index is not expressible in the schema file.
- `company_follow`: primary key `id`; unique `[userId, companyId]`. Index on `companyId`.
- `job`: primary key `id`; unique `slug`. Indexes on `companyId`, `postedById`, `status`, and `country`.
- `saved_job`: primary key `id`; unique `[userId, jobId]`. Index on `jobId`.
- `notification`: keeps its existing keys and indexes; gains an index on `companyId`.
- Every new model uses `id String` primary keys with a generated cuid value, matching the existing `post`, `post_likes`, and `follow` models.
- Every new table uses snake_case table names matching its model name: `company`, `company_member`, `company_member_request`, `company_follow`, `job`, `saved_job`.
- Column names use camelCase everywhere, matching the existing schema: `roleName`, `requestedRole`, `decidedById`, `decidedAt`, `companyId`, `userId`, `jobId`, `postedById`.
- Relation delete behavior for all new relations is cascade, matching the existing schema's convention (every existing relation in `packages/prisma/prisma/schema.prisma` uses `onDelete: Cascade`). The document states that company deletion and user deletion are not exposed in the product yet, so cascade is a placeholder rather than a product rule.

### 4. `## Enums` block (exact)

Each enum listed with its values, one per line, in this order:

- `UserRole`: `user`, `recruiter`
- `CompanyRole`: `owner`, `recruiter`, `member`
- `RequestStatus`: `pending`, `approved`, `denied`
- `JobStatus`: `draft`, `open`, `closed`
- `JobType`: `full_time`, `part_time`, `contract`, `internship`, `temporary`
- `RemoteType`: `onsite`, `hybrid`, `remote`
- `ExperienceLevel`: `intern`, `entry`, `mid`, `senior`, `lead`
- `CompanySize`: `tiny`, `small`, `medium`, `large`, `xlarge`
- `SalaryPeriod`: `hourly`, `monthly`, `yearly`

The `CompanySize` bullet must also state the employee range each tier represents: `tiny` = 1–10, `small` = 11–50, `medium` = 51–200, `large` = 201–500, `xlarge` = 500+. Enum member values are lowercase snake_case; enum type names are PascalCase. Enum values are stored as Postgres enum types, not strings.

### 5. `## Rules` block (exact content)

Write these rules as bullets, one idea per bullet:

- Any user may create a `company`. The creator gets a `company_member` row with role `owner`, and types their own `roleName` at creation. A company has exactly one owner and ownership is never transferred.
- Membership is request-and-approve only. The owner never adds a user directly; there is no invite token, no approval-free add, and no self-join by code.
- Any user may request to join a company, whether or not their `user.role` is `recruiter`. The request names a `requestedRole` of `recruiter` or `member` and a `roleName`. `owner` is never requested.
- A user may have at most one `pending` request per company. A second request while one is pending is rejected. After a denial the user may request again, which creates a new request row.
- Only the company owner sees pending requests and decides them, from a company dashboard. The requester sees their own request and its status. Other users see nothing about requests.
- On approval, a `company_member` row is created with role and `roleName` copied from the request, unless the owner overrides either value at approval time. `decidedById` is the deciding owner, `decidedAt` is set, and the request status becomes `approved`.
- On denial, no `company_member` row is created. `decidedById` and `decidedAt` are set and the request status becomes `denied`. The request row is kept.
- A new request notifies the company owner with notification type `company_member_request`. A decision notifies the requester with notification type `company_member_decision`. Both notifications set `notification.companyId`.
- `user.role` is self-declared and independent of company membership. It is a profile badge only and grants no publishing rights.
- Only a `company_member` may publish a job for that company. Role `recruiter` may create, edit, and delete only jobs whose `postedById` equals their own `user` id. Role `owner` may create, edit, and delete any job of that company. Role `member` may view the company page and its jobs but may not create, edit, delete, or publish any job.
- A member may edit their own `roleName`. The owner may edit any member's `roleName`. Neither may change a member's `role` after approval.
- A member may leave the company and the owner may remove any member except themselves. Both delete the `company_member` row and decrement `company.memberCount`.
- A job starts as `draft`. Moving it to `open` sets `publishedAt`. Moving it to `closed` sets `closedAt`. A closed job can be reopened, which clears `closedAt`.
- A job whose `deadline` has passed is hidden from job list queries by a `deadline IS NULL OR deadline > now()` predicate. Its `status` stays unchanged; there is no scheduled auto-close job.
- Job list filters: `status`, `country`, `jobType`, `remoteType`, `experienceLevel`, `companyId`, tag, and salary range. A tag filter matches an exact tag value in the `tags` array. A salary filter selects jobs whose range overlaps the requested range, treating a missing bound as unbounded: `salaryMax >= requestedMin` and `salaryMin IS NULL OR salaryMin <= requestedMax`; a missing requested bound is unbounded.
- Job text search matches title, description, and tags by substring, case-insensitive. Title and description use a case-insensitive contains match; tags need a substring match across the array elements because the ORM has no array-substring operator, so that one predicate runs as raw SQL over the array. Company name is not part of job search.
- Every click on a job's Apply button increments `job.applyCount`. No per-user record is kept, so repeat clicks by the same user count again.
- Saving or unsaving a job updates `job.savedCount`; following or unfollowing a company updates `company.followerCount`; approving or removing a company member updates `company.memberCount`; publishing or deleting a job updates `company.jobCount`.
- Job activity produces no notifications. `notification.type` stays a free-form string, and company membership requests are the only new type values it carries.
- `post`, `post_comment`, and `follow` are unchanged: people only, no post visibility column, no company-authored posts. Company follows live in `company_follow`.

### 6. What the document must not contain

No SQL, no Prisma model blocks, no migration steps, no feature or implementation plan, no app-screen descriptions, no non-goals or alternatives sections. The file is a schema design spec plus its rules.

## Critical files & anchors

- `modified schema.md` — the file being rewritten; currently a rough bullet sketch that this plan replaces entirely.
- `packages/prisma/prisma/schema.prisma` — source of truth for existing table columns, types, defaults, keys, indexes, cascade convention, and the `@@map` naming style; read before writing.
- `packages/prisma/prisma/migrations/20260825211725_notification_cascade_delete/migration.sql` — confirms the migration file naming and hand-written-SQL convention for later implementation.
- `apps/web/src/app/(authenticated)/profile/[userId]/page.tsx` — current profile mapping hardcodes `bio: null`; the new `user.bio`, `user.headline`, and `user.country` columns will feed this later, which is why they appear in the design now.
- `apps/web/src/features/notifications/types/index.ts` — holds the app-side `NotificationType` constant; the two new membership notification type strings are named here so the document and the later app code agree.

## Verification

Document-only change; the repo has no test framework (per `AGENTS.md`) and no code path consumes this file, so verification is a content audit of `modified schema.md`.

Run from the repository root:

1. Column presence and spelling — every required identifier appears exactly in the doc:
   `grep -oE '\b(role|roleName|requestedRole|decidedById|decidedAt|companyId|headline|bio|country|followerCount|memberCount|jobCount|savedCount|applyCount|salaryMin|salaryMax|salaryCurrency|salaryPeriod|postedById|publishedAt|closedAt|applyUrl|deadline|tags|remoteType|experienceLevel|jobType|status|slug|size|coverImage|image|website|industry|description|title)\b' "modified schema.md" | sort -u`
   Expected output includes every name listed above; any missing name means a column was dropped.
2. Enum completeness — confirm all nine enums and every member value from step 4 are present:
   `grep -cE '^- \`(UserRole|CompanyRole|RequestStatus|JobStatus|JobType|RemoteType|ExperienceLevel|CompanySize|SalaryPeriod)\`:' "modified schema.md"` returns 9, and `grep -oE '\b(full_time|part_time|contract|internship|temporary|onsite|hybrid|remote|intern|entry|mid|senior|lead|tiny|small|medium|large|xlarge|hourly|monthly|yearly|draft|open|closed|pending|approved|denied|owner|recruiter|member|user)\b' "modified schema.md" | sort -u` lists all expected values.
3. Table coverage — confirm all nineteen models have a subsection:
   `grep -c '^### ' "modified schema.md"` returns 19, and `grep -oE '^### [a-z_]+' "modified schema.md"` lists exactly the model names in step 1, including `company_member_request`.
4. Markdown table shape — every row in every column table has four cells. Verify by eye across all nineteen tables: each row reads `| name | Type | null? | note |` with no empty cell and no stray pipe in a note. A note containing a `|` must be reworded rather than escaped.
5. Rules audit — read the `## Rules` block against step 5 and confirm all nineteen bullets are present with the stated semantics, especially: request-and-approve is the only path to membership, one pending request per user per company, `member` is read-only for jobs, owner alone decides requests, member may leave and owner may remove, recruiter edits only own `postedById` jobs, deadline hides without changing status, salary overlap bounds, tags substring via raw SQL, company name excluded from search, apply click count has no per-user dedupe.
6. Consistency with the current schema — diff the reproduced existing-model tables against `packages/prisma/prisma/schema.prisma` and confirm no existing column, type, default, key, or index was altered. `user` must show its original ten columns unchanged plus exactly four new ones; `notification` its original seven columns unchanged plus exactly one new one.
7. Scope check — the file must contain no fenced code blocks, no `prisma` keyword, and no migration instructions:
   `grep -nE '```|prisma|migration' "modified schema.md"` returns no matches.

Report each check's actual output in the completion summary.

## Assumptions & contingencies

- The user asked for a design document only, so Prisma schema edits, migrations, and app code are deliberately excluded here and happen in a later feature. If implementation is requested in the same session, do that as a separate change after this document is approved, and follow `AGENTS.md`: run `npm -w @antisocial/prisma run migrate:create` and present the SQL for review without applying it.
- `user.role` semantics assume the app exposes no role-management screen yet; self-declaration happens by direct data write or a later profile control. If a UI control is added later, it writes the same `user.role` column.
- Country values stay free-text because the user chose that over ISO codes; the doc records it as free-text so a later normalization is a known change, not an accident. If country filtering proves broken by spelling drift, normalize to ISO 3166-1 alpha-2 in a later migration.
- If `company_member` later needs multiple owners per company, the unique constraint `[companyId, userId]` already allows it and no schema change is required; the "owner" role simply becomes repeatable.
- One pending request per user per company is enforced in application code rather than by a partial unique index, because the schema file cannot express partial indexes. If duplicate pending requests become a problem, add a raw partial unique index in a later migration.
- The owner dashboard for reviewing requests and the notification payloads are app work in a later feature; this document fixes only the columns, statuses, and notification type strings they read.
- `company_member.role_name` is required and never empty. If the product later wants a title-less member, relax it to a nullable column with a display fallback in the app layer.
- If tag browsing (a page listing all tags with job counts) becomes a product feature, `tags String[]` must be replaced by a `tag` + `job_tag` pair. That is out of scope for this document, which states the array choice and its limits.
- Company deletion and user deletion remain unexposed, so cascade delete behavior on new relations is a placeholder. If deletion is later exposed, revisit `postedById` and `company.owner` handling before enabling it.
