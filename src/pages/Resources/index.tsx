import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Download, 
  Eye, 
  Heart, 
  FileText, 
  FileSpreadsheet, 
  Video, 
  Link, 
  HelpCircle,
  Star,
  Clock,
  User,
  Calendar,
  Tag,
  MoreHorizontal
} from "lucide-react";
import { 
  resourceCategories, 
  resourcesWithDetails, 
  allTags, 
  searchResources
} from "@/data/resources.mock";
import type { ResourceWithDetails } from "@/domain/resources";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const typeIcons = {
  pdf: FileText,
  doc: FileText,
  excel: FileSpreadsheet,
  video: Video,
  link: Link,
  faq: HelpCircle,
};

const typeColors = {
  pdf: "bg-red-100 text-red-700",
  doc: "bg-blue-100 text-blue-700",
  excel: "bg-green-100 text-green-700",
  video: "bg-purple-100 text-purple-700",
  link: "bg-orange-100 text-orange-700",
  faq: "bg-gray-100 text-gray-700",
};

export default function ResourcesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "alphabetical">("recent");

  // Filter and search resources
  const filteredResources = useMemo(() => {
    console.log("User role:", user?.role);
    console.log("Total resources before filtering:", resourcesWithDetails.length);
    
    let results = searchResources(searchQuery, {
      category: selectedCategory === "all" ? undefined : selectedCategory,
      type: selectedType === "all" ? undefined : selectedType as "pdf" | "doc" | "excel" | "video" | "link" | "faq",
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      role: user?.role
    });
    
    console.log("Resources after role filtering:", results.length);

    // Filter favorites
    if (showFavoritesOnly) {
      results = results.filter(r => r.isFavorited);
    }

    // Sort results
    switch (sortBy) {
      case "popular":
        results.sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
        break;
      case "alphabetical":
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "recent":
      default:
        results.sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime());
        break;
    }

    return results;
  }, [searchQuery, selectedCategory, selectedType, selectedTags, showFavoritesOnly, sortBy, user?.role]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedType("all");
    setSelectedTags([]);
    setShowFavoritesOnly(false);
  };

  const getResourceStats = () => {
    const total = resourcesWithDetails.length;
    const favorites = resourcesWithDetails.filter(r => r.isFavorited).length;
    const recent = resourcesWithDetails.filter(r => 
      new Date(r.uploaded_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;
    
    return { total, favorites, recent };
  };

  const stats = getResourceStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
          <p className="text-muted-foreground">
            Knowledge hub for training materials, policies, and reference documents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const selectedResources = filteredResources.filter(r => r.isFavorited);
              if (selectedResources.length === 0) {
                toast({
                  title: "No Favorites Selected",
                  description: "Please mark some resources as favorites first.",
                  variant: "destructive",
                });
                return;
              }
              toast({
                title: "Bulk Download Started",
                description: `Downloading ${selectedResources.length} favorite resources...`,
                variant: "default",
              });
              // In a real app, this would trigger a bulk download
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Bulk Download
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Resources</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Favorites</p>
                <p className="text-2xl font-bold">{stats.favorites}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recent (30 days)</p>
                <p className="text-2xl font-bold">{stats.recent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search and Main Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {resourceCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="doc">Document</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                    <SelectItem value="faq">FAQ</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: "recent" | "popular" | "alphabetical") => setSortBy(value)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags and Additional Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              >
                <Heart className="h-4 w-4 mr-2" />
                Favorites Only
              </Button>
              
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Tags:</span>
                {allTags.slice(0, 8).map((tag: string) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
                {allTags.length > 8 && (
                  <Badge variant="outline" className="cursor-pointer">
                    +{allTags.length - 8} more
                  </Badge>
                )}
              </div>

              {(searchQuery || selectedCategory !== "all" || selectedType !== "all" || selectedTags.length > 0 || showFavoritesOnly) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>

      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No resources found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ResourceCard({ resource }: { resource: ResourceWithDetails }) {
  const { toast } = useToast();
  const TypeIcon = typeIcons[resource.type as keyof typeof typeIcons];
  const typeColor = typeColors[resource.type as keyof typeof typeColors];

  const handleDownload = () => {
    console.log(`Downloading ${resource.title}`);
    
    if (resource.url) {
      window.open(resource.url, '_blank');
    }
  };

  const handleView = () => {
    console.log(`Viewing ${resource.title}`);
    
    if (resource.type === 'link') {
      window.open(resource.url, '_blank');
    } else if (resource.type === 'video') {
      window.open(resource.url, '_blank');
    } else {
      window.open(resource.url, '_blank');
    }
  };

  const handleFavorite = () => {
    console.log(`Toggling favorite for ${resource.title}`);
    
    toast({
      title: "Favorite Updated",
      description: `"${resource.title}" has been ${resource.isFavorited ? 'removed from' : 'added to'} your favorites.`,
      variant: "default",
    });
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", typeColor)}>
              <TypeIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {resource.title}
              </CardTitle>
              <Badge variant="secondary" className="mt-1">
                {resource.category.name}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {resource.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
            {resource.description}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {resource.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {resource.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{resource.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3" />
            <span>Uploaded by {resource.uploadedBy.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>{new Date(resource.uploaded_at).toLocaleDateString()}</span>
          </div>
          {resource.downloadCount && resource.downloadCount > 0 && (
            <div className="flex items-center gap-2">
              <Download className="h-3 w-3" />
              <span>{resource.downloadCount} downloads</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleView} className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleFavorite}
            className={cn(resource.isFavorited && "text-red-500")}
          >
            <Heart className={cn("h-4 w-4", resource.isFavorited && "fill-current")} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
