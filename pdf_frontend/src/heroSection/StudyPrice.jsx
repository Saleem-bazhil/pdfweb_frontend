import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import React from "react";
import { Button } from "@/components/ui/button";
import PriceCard from "@/shared/PriceCard";

const StudyPrice = () => {
  return (
    <section className="min-h-screen px-4 py-20 mt-10">
      <div className="container mx-auto ">
        <div className="text-center mb-4">
          <h2 className="text-4xl font-bold mb-4">Premium Study Guides</h2>
          <p className="text-xl text-muted-foreground">
            One-time payment for lifetime secure access. No subscriptions, no
            hidden fees.
          </p>
        </div>
        <PriceCard />
      </div>
    </section>
  );
};

export default StudyPrice;
