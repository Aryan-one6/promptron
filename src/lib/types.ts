export type Platform = {
  id: string;
  name: string;
  slug: string;
};

export type Model = {
  id: string;
  name: string;
  slug: string;
  platform: Platform;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
};

export type Template = {
  id: string;
  title: string;
  description: string;
  promptSchema: Record<string, unknown>;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  category: Category;
  author: { id: string; name: string };
  models: { model: Model }[];
  tags: { tag: Tag }[];
  _count: { savedBy: number };
};
