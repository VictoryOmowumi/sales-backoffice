import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock,
  BookOpen,
  Video,
  FileText,
  ExternalLink
} from "lucide-react";

const faqData = [
  {
    id: 1,
    question: "How do I set up targets for my region?",
    answer: "Navigate to Targets > Create Targets, select your period and region, then add SKU columns and enter target values. The system will auto-distribute targets across your customers.",
    category: "Targets",
    tags: ["targets", "setup", "beginner"]
  },
  {
    id: 2,
    question: "How do I filter customers in the target grid?",
    answer: "Use the filter dropdowns in the customer information columns (Customer Name, Code, TDM, TDE, Dealer Type, Channel) to filter groups of customers.",
    category: "Targets",
    tags: ["filtering", "customers", "grid"]
  },
  {
    id: 3,
    question: "What's the difference between Weekly and Daily targets?",
    answer: "Weekly and Daily targets are automatically calculated from your SKU totals. Weekly = SKU total ÷ 4, Daily = SKU total ÷ 30. These are read-only calculated fields.",
    category: "Targets",
    tags: ["calculation", "weekly", "daily"]
  },
  {
    id: 4,
    question: "How do I save my targets as a draft?",
    answer: "Click 'Save Draft' to save your work without submitting for approval. You can continue editing later. Use 'Submit for Approval' when ready to finalize.",
    category: "Targets",
    tags: ["draft", "save", "workflow"]
  },
  {
    id: 5,
    question: "Where can I find training materials?",
    answer: "Visit the Resources page for training guides, SOPs, product catalogs, and other reference materials. Use the search and filters to find specific content.",
    category: "Resources",
    tags: ["training", "resources", "materials"]
  },
  {
    id: 6,
    question: "How do I access customer information?",
    answer: "Go to the Customers page to view customer details, segmentation, and performance metrics. Use filters to find specific customers or groups.",
    category: "Customers",
    tags: ["customers", "information", "data"]
  }
];

const supportContacts = [
  {
    type: "IT Support",
    contact: "it-support@sbc.com",
    phone: "+234 800 123 4567",
    hours: "24/7",
    description: "Technical issues, login problems, system errors"
  },
  {
    type: "Data Team",
    contact: "data-team@sbc.com", 
    phone: "+234 800 123 4568",
    hours: "Mon-Fri 8AM-6PM",
    description: "Data accuracy, reporting issues, data requests"
  },
  {
    type: "Sales Operations",
    contact: "sales-ops@sbc.com",
    phone: "+234 800 123 4569", 
    hours: "Mon-Fri 8AM-6PM",
    description: "Target setting, process questions, approvals"
  }
];

const quickLinks = [
  {
    title: "Sales Playbook",
    description: "Complete guide for sales representatives",
    type: "PDF",
    url: "/resources",
    icon: BookOpen
  },
  {
    title: "Platform Tutorial",
    description: "Video walkthrough of key features",
    type: "Video", 
    url: "/resources",
    icon: Video
  },
  {
    title: "Target Setting SOP",
    description: "Standard operating procedures",
    type: "Document",
    url: "/resources", 
    icon: FileText
  },
  {
    title: "Resources Library",
    description: "All training materials and references",
    type: "Library",
    url: "/resources",
    icon: ExternalLink
  }
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-muted-foreground">
            Get help, find answers, and access support resources
          </p>
        </div>
      </div>

      {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search help articles, FAQs, and documentation..."
              className="pl-10 h-12 text-lg"
            />
          </div>
      

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  if (link.url === "/resources") {
                    // Navigate to resources page
                    window.location.href = "/resources";
                  } else {
                    // Open external links
                    window.open(link.url, '_blank');
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <Badge variant="secondary">{link.type}</Badge>
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {link.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqData.map((faq) => (
            <Card key={faq.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{faq.question}</CardTitle>
                    <Badge variant="outline" className="mb-2">{faq.category}</Badge>
                  </div>
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-3">{faq.answer}</p>
                <div className="flex flex-wrap gap-1">
                  {faq.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Support Contacts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {supportContacts.map((contact, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {contact.type}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{contact.contact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{contact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{contact.hours}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  {contact.description}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    // Create mailto link
                    const subject = encodeURIComponent(`Support Request - ${contact.type}`);
                    const body = encodeURIComponent(`Hello ${contact.type} team,\n\nI need assistance with:\n\n[Please describe your issue here]\n\nThank you!`);
                    window.open(`mailto:${contact.contact}?subject=${subject}&body=${body}`);
                  }}
                >
                  Contact {contact.type}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Additional Help */}
      <Card>
        <CardContent className="p-6 text-center">
          <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Still need help?</h3>
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              onClick={() => {
                alert("Live chat feature coming soon! For now, please use the contact buttons above or send an email.");
              }}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Start Live Chat
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const subject = encodeURIComponent("General Support Request");
                const body = encodeURIComponent("Hello Support Team,\n\nI need assistance with:\n\n[Please describe your issue here]\n\nThank you!");
                window.open(`mailto:support@sbc.com?subject=${subject}&body=${body}`);
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}