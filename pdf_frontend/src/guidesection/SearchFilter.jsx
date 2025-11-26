import React from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const SearchFilter = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="max-w-4xl mx-auto mb-12 animate-fade-in">
      <Card className="p-6 shadow-sm border border-border/40 hover:shadow-lg transition-all duration-300 bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by subject or topic..."
              className="pl-10 rounded-lg border-border/40 focus:ring-2 focus:ring-primary/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="secure"
            className="md:w-auto bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg hover:brightness-110"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SearchFilter;
