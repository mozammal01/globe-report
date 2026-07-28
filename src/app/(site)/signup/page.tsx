import type { Metadata } from "next";
import Link from "next/link";

import { SignupForm } from "@/components/auth/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Sign Up",
  alternates: { canonical: "/signup" },
  robots: { index: false },
};

export default function SignupPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-16">
      <h1 className="sr-only">Create your {siteConfig.name} account</h1>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-heading text-xl">
            {siteConfig.name}
          </CardTitle>
          <CardDescription>
            Create an account to bookmark articles and track your reading.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <SignupForm redirectTo="/account" />
          <p className="text-muted-foreground text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
