export type ResourceType = "pdf" | "doc" | "excel" | "video" | "link" | "faq";
export type ResourceStatus = "active" | "archived";

export type ResourceCategory = {
  id: string;
  name: string;
  description?: string;
};

export type Resource = {
  id: string;
  title: string;
  description?: string;
  type: ResourceType;
  category_id: string;
  tags: string[];
  url: string;
  uploaded_by: string;   // user id
  uploaded_at: string;   // ISO date
  updated_at?: string;
  version?: string;
  status: ResourceStatus;
  visibility_roles: string[];
};

export type ResourceInteraction = {
  id: string;
  resource_id: string;
  user_id: string;
  action: "viewed" | "downloaded" | "favorited";
  timestamp: string;
};

// Extended types for UI
export type ResourceWithDetails = Resource & {
  category: ResourceCategory;
  uploadedBy: {
    id: string;
    name: string;
    role: string;
  };
  isFavorited?: boolean;
  downloadCount?: number;
  lastViewed?: string;
};

export type ResourceFilter = {
  search?: string;
  category?: string;
  type?: ResourceType;
  status?: ResourceStatus;
  tags?: string[];
  role?: string;
};
