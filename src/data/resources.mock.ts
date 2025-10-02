import { faker } from "@faker-js/faker";
import type { ResourceCategory, Resource, ResourceWithDetails } from "@/domain/resources";

faker.seed(42);

function id() {
  return faker.string.uuid();
}

export function seedResources() {
  // Categories
  const categories: ResourceCategory[] = [
    { id: id(), name: "Training", description: "Guides and onboarding materials" },
    { id: id(), name: "Product Info", description: "Catalogues, SKUs, and price lists" },
    { id: id(), name: "Policies", description: "Compliance and SOP documents" },
    { id: id(), name: "Marketing", description: "Sales decks, POSM guidelines" },
    { id: id(), name: "IT Support", description: "Helpdesk, troubleshooting, FAQs" },
  ];

  const resourceTypes: ("pdf"|"doc"|"excel"|"video"|"link"|"faq")[] = ["pdf","doc","excel","video","link","faq"];
  const roles = ["executive","gtm","sales"];

  // Generate ~20 resources
  const resources: Resource[] = Array.from({ length: 20 }).map(() => {
    const cat = faker.helpers.arrayElement(categories);
    const type = faker.helpers.arrayElement(resourceTypes);

    const title = faker.helpers.arrayElement([
      "Sales Playbook",
      "Product Catalogue",
      "Pepsi PET 50cl Price List",
      "Supa Komando Energy Deck",
      "Quarterly Training Guide",
      "Incentive Policy 2025",
      "POSM Display Manual",
      "Compliance Checklist",
      "Aquafina Marketing Campaign",
      "IT Troubleshooting FAQ"
    ]) + " " + faker.date.past({ years: 1 }).getFullYear();

    return {
      id: id(),
      title,
      description: faker.lorem.sentence(),
      type,
      category_id: cat.id,
      tags: faker.helpers.arrayElements(
        ["training","sales","policy","pepsi","aquafina","energy","pricing","promo","onboarding"],
        { min: 1, max: 3 }
      ),
      url: faker.internet.url(),
      uploaded_by: faker.internet.username(),
      uploaded_at: faker.date.recent({ days: 90 }).toISOString(),
      updated_at: faker.date.recent({ days: 30 }).toISOString(),
      version: "v" + faker.number.int({ min: 1, max: 3 }) + "." + faker.number.int({ min: 0, max: 9 }),
      status: faker.helpers.arrayElement<"active"|"archived">(["active","archived"]),
      visibility_roles: faker.helpers.arrayElements(roles, { min: 1, max: 3 }),
    };
  });

  return { categories, resources };
}

// Generate the data
const { categories: resourceCategories, resources } = seedResources();

// Export the generated data
export { resources, resourceCategories };


// Build resources with details
export function buildResourceWithDetails(resource: Resource): ResourceWithDetails {
  const category = resourceCategories.find(c => c.id === resource.category_id)!;
  
  // Create a mock user for the uploaded_by field (since it's now a username from faker)
  const uploadedBy = {
    id: resource.uploaded_by,
    name: resource.uploaded_by,
    role: faker.helpers.arrayElement(["executive", "gtm", "sales"])
  };
  
  return {
    ...resource,
    category,
    uploadedBy,
    isFavorited: faker.datatype.boolean({ probability: 0.3 }),
    downloadCount: faker.number.int({ min: 0, max: 150 }),
    lastViewed: faker.datatype.boolean({ probability: 0.4 }) 
      ? faker.date.recent({ days: 30 }).toISOString() 
      : undefined
  };
}

export const resourcesWithDetails: ResourceWithDetails[] = resources.map(buildResourceWithDetails);


// Get all unique tags
export const allTags = Array.from(new Set(resources.flatMap(r => r.tags))).sort();

// Get resources by category
export function getResourcesByCategory(categoryId: string): ResourceWithDetails[] {
  return resourcesWithDetails.filter(r => r.category_id === categoryId);
}

// Get resources by role
export function getResourcesByRole(role: string): ResourceWithDetails[] {
  return resourcesWithDetails.filter(r => r.visibility_roles.includes(role));
}

// Search resources
export function searchResources(query: string, filters?: {
  category?: string;
  type?: string;
  tags?: string[];
  role?: string;
}): ResourceWithDetails[] {
  let results = resourcesWithDetails;

  // Apply role filter first
  if (filters?.role) {
    results = results.filter(r => r.visibility_roles.includes(filters.role!));
  }

  // Apply category filter
  if (filters?.category) {
    results = results.filter(r => r.category_id === filters.category);
  }

  // Apply type filter
  if (filters?.type) {
    results = results.filter(r => r.type === filters.type);
  }

  // Apply tags filter
  if (filters?.tags && filters.tags.length > 0) {
    results = results.filter(r => 
      filters.tags!.some(tag => r.tags.includes(tag))
    );
  }

  // Apply search query
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    results = results.filter(r => 
      r.title.toLowerCase().includes(searchTerm) ||
      r.description?.toLowerCase().includes(searchTerm) ||
      r.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  return results;
}
