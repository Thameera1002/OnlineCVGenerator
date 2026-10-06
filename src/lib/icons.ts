/**
 * Material Symbols used by the UI. Only these glyphs are downloaded (see layout.tsx),
 * so add a name here before using it in <Icon />.
 */
export const ICON_NAMES = [
  "add",
  "arrow_back",
  "arrow_downward",
  "arrow_forward",
  "arrow_upward",
  "auto_awesome",
  "badge",
  "check",
  "check_circle",
  "close",
  "coffee",
  "delete",
  "delete_sweep",
  "description",
  "download",
  "draw",
  "edit",
  "error",
  "fact_check",
  "groups",
  "history_edu",
  "info",
  "interests",
  "language",
  "lightbulb",
  "lock",
  "more_vert",
  "no_photography",
  "notes",
  "person",
  "photo_camera",
  "psychology",
  "public",
  "rocket_launch",
  "save",
  "school",
  "upload_file",
  "visibility",
  "warning",
  "work",
  "workspace_premium",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

export const ICON_FONT_URL =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0..1,0" +
  `&icon_names=${[...ICON_NAMES].sort().join(",")}&display=block`;
