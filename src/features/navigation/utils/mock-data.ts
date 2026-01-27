import type { MockUser, NavItem, SocialItem } from "../types";

/**
 * Mock data for the current logged-in user.
 */
export const currentUser: MockUser = {
  id: "u1",
  name: "Fariha Tahsin",
  handle: "@farihatahsin",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fariha",
  location: "Torrance, CA, United States",
  stats: {
    posts: 268,
    followers: 122100,
    following: 1140,
  },
};

/**
 * Mock data for the left sidebar navigation links.
 */
export const navItems: NavItem[] = [
  { label: "Feed", href: "/feed", icon: "LayoutGrid" },
  { label: "Explore", href: "/explore", icon: "Compass" },
  { label: "My Favorites", href: "/favorites", icon: "Bookmark" },
  { label: "Direct", href: "/direct", icon: "Send" },
  { label: "Stats", href: "/stats", icon: "BarChart2" },
  { label: "Settings", href: "/settings", icon: "Settings" },
];

/**
 * Mock data for social interaction requests.
 */
export const socialRequests: SocialItem[] = [
  {
    id: "r1",
    name: "Mosila Moxy",
    handle: "@mosila",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mosila",
    status: "pending",
  },
  {
    id: "r2",
    name: "Jorjia Morjia",
    handle: "@jorjia",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jorjia",
    status: "pending",
  },
];

/**
 * Mock data for user suggestions.
 */
export const userSuggestions: SocialItem[] = [
  {
    id: "s1",
    name: "Chausia Meghanot",
    handle: "@chausia",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chausia",
    status: "suggested",
  },
  {
    id: "s2",
    name: "Micheal Smith",
    handle: "@micheal",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=micheals",
    status: "suggested",
  },
  {
    id: "s3",
    name: "Jonthaia Mosula",
    handle: "@jonthaia",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jonthaia",
    status: "suggested",
  },
];
