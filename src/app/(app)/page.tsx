"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, MessageSquare, Shield, UserRound } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen hero-pattern">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text">
            Share Your Thoughts, Keep Your Privacy
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Create your anonymous inbox and receive honest messages from anyone, while staying completely anonymous.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/sign-up">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="glass-card p-6 rounded-xl space-y-4">
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold">100% Anonymous</h3>
            <p className="text-muted-foreground">
              Your identity remains completely private. No tracking, no traces.
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl space-y-4">
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold">Instant Messages</h3>
            <p className="text-muted-foreground">
              Receive messages instantly in your personal dashboard.
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl space-y-4">
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <UserRound className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold">Easy Sharing</h3>
            <p className="text-muted-foreground">
              Share your unique link and start receiving anonymous messages.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}