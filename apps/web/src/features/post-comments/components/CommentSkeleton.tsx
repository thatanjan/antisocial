import { Skeleton } from "@/components/ui/skeleton";

/**
 * Props for the ReplyItemSkeleton component.
 */
interface ReplyItemSkeletonProps {
  /** Width variant for the content line to create visual variety. */
  contentWidth?: "w-3/4" | "w-2/3" | "w-1/2";
}

/**
 * Skeleton placeholder for a single reply item while replies are loading.
 * Mirrors the layout of a rendered reply row in ReplyList.
 */
const ReplyItemSkeleton = ({
  contentWidth = "w-3/4",
}: ReplyItemSkeletonProps) => (
  <div className="flex gap-3 py-2">
    {/* Avatar */}
    <Skeleton className="mt-0.5 h-6 w-6 shrink-0 rounded-full" />
    <div className="flex flex-1 flex-col gap-1.5">
      {/* Author + timestamp row */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="h-2.5 w-12 rounded" />
      </div>
      {/* Content line */}
      <Skeleton className={`h-3 rounded ${contentWidth}`} />
      {/* Like button */}
      <Skeleton className="h-3 w-10 rounded" />
    </div>
  </div>
);

/**
 * Props for the ReplyListSkeleton component.
 */
interface ReplyListSkeletonProps {
  /** Number of reply skeleton rows to render. Defaults to 3. */
  count?: number;
}

/**
 * Skeleton for the entire reply list section, shown while replies are being fetched.
 * Rendered inside `ReplyList` during the initial loading state.
 */
export const ReplyListSkeleton = ({ count = 3 }: ReplyListSkeletonProps) => (
  <div className="mt-2 flex flex-col gap-1 border-border/50 border-l-2 pl-4">
    <ReplyItemSkeleton contentWidth="w-3/4" />
    {count >= 2 && <ReplyItemSkeleton contentWidth="w-2/3" />}
    {count >= 3 && <ReplyItemSkeleton contentWidth="w-1/2" />}
  </div>
);

/**
 * Props for the CommentItemSkeleton component.
 */
interface CommentItemSkeletonProps {
  /** Width variant for the main content block to add visual variety. */
  contentWidth?: "w-full" | "w-4/5" | "w-3/4";
}

/**
 * Skeleton placeholder for a single comment item while comments are loading.
 * Mirrors the layout of a rendered comment row in CommentList.
 */
const CommentItemSkeleton = ({
  contentWidth = "w-full",
}: CommentItemSkeletonProps) => (
  <div className="flex gap-3 py-3">
    {/* Avatar */}
    <Skeleton className="mt-0.5 h-8 w-8 shrink-0 rounded-full" />
    <div className="flex flex-1 flex-col gap-2">
      {/* Author + timestamp row */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-3.5 w-24 rounded" />
        <Skeleton className="h-3 w-14 rounded" />
      </div>
      {/* Content lines */}
      <Skeleton className={`h-3.5 rounded ${contentWidth}`} />
      <Skeleton className="h-3.5 w-2/3 rounded" />
      {/* Like + reply buttons row */}
      <div className="flex items-center gap-4 pt-0.5">
        <Skeleton className="h-3 w-8 rounded" />
        <Skeleton className="h-3 w-10 rounded" />
      </div>
    </div>
  </div>
);

/**
 * Props for the CommentListSkeleton component.
 */
interface CommentListSkeletonProps {
  /** Number of comment skeleton rows to render. Defaults to 3. */
  count?: number;
}

/**
 * Skeleton for the entire comment list section, shown while the initial
 * comments are being fetched server-side or during SSR hydration.
 * Rendered inside `CommentList` when `isLoading` is true.
 */
export const CommentListSkeleton = ({
  count = 3,
}: CommentListSkeletonProps) => (
  <div className="flex flex-col divide-y divide-border/30">
    <CommentItemSkeleton contentWidth="w-full" />
    {count >= 2 && <CommentItemSkeleton contentWidth="w-4/5" />}
    {count >= 3 && <CommentItemSkeleton contentWidth="w-3/4" />}
  </div>
);
