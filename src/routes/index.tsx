import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { InvitationExperience } from "@/components/InvitationExperience";
import { CollectionsSection } from "@/components/sections/CollectionsSection";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { AllureSection } from "@/components/sections/AllureSection";
import { FooterSection } from "@/components/sections/FooterSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Impressions Wedding Cards — Bespoke Luxury Invitations" },
      {
        name: "description",
        content:
          "A private atelier crafting heirloom wedding invitations — hand-set type, deckled paper and wax-sealed details for timeless celebrations.",
      },
      {
        property: "og:title",
        content: "Impressions Wedding Cards — Bespoke Luxury Invitations",
      },
      {
        property: "og:description",
        content:
          "Bespoke wedding invitations composed in heirloom paper and wax-sealed in our private studio.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="bg-background text-foreground">
      <InvitationExperience />
      <CollectionsSection
        categories={categories}
        onSelectCategory={handleCategorySelect}
      />
      <PortfolioSection
        initialFilter={selectedCategory}
        onCategoriesLoaded={setCategories}
      />
      <AllureSection />
      <FooterSection />
    </main>
  );
}