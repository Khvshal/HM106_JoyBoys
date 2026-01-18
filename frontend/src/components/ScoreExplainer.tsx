import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, BarChart3, Users, Network, ShieldCheck } from "lucide-react";

export function ScoreExplainer() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-xs text-muted-foreground p-0 h-auto hover:text-primary">
          <Info className="h-3 w-3 mr-1" />
          How is this score calculated?
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-serif">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
            Understanding the TruthLens Score
          </DialogTitle>
          <DialogDescription>
            Our Multi-Factor Credibility Engine analyzes articles using four distinct layers of verification to fight misinformation.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex gap-4 items-start p-4 rounded-lg bg-emerald-50/50 border border-emerald-100">
            <div className="p-2 bg-white rounded-md shadow-sm">
              <BarChart3 className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-1">Source Trust (30%)</h3>
              <p className="text-sm text-muted-foreground">
                We evaluate the historical accuracy and transparency of the publisher. 
                Sources with a long track record of high-quality journalism score higher. 
                New or anonymous sources start with a neutral score until they build a reputation.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 rounded-lg bg-blue-50/50 border border-blue-100">
            <div className="p-2 bg-white rounded-md shadow-sm">
              <Network className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-1">AI & NLP Analysis (25%)</h3>
              <p className="text-sm text-muted-foreground">
                Our Machine Learning models analyze the text for indicators of clickbait, 
                sensationalism, and emotional manipulation. We also check for factual density 
                (dates, statistics, citations) versus pure opinion.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 rounded-lg bg-amber-50/50 border border-amber-100">
            <div className="p-2 bg-white rounded-md shadow-sm">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-1">Community Verification (30%)</h3>
              <p className="text-sm text-muted-foreground">
                Crowdsourced ratings from our diverse community. Critically, we weight ratings 
                based on the <strong>user's specific credibility</strong>. Ratings from experts 
                and trusted users count more than new accounts, preventing brigading.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 rounded-lg bg-purple-50/50 border border-purple-100">
            <div className="p-2 bg-white rounded-md shadow-sm">
              <ShieldCheck className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-1">Cross-Source Corroboration (15%)</h3>
              <p className="text-sm text-muted-foreground">
                We check if other independent, trusted sources are reporting the same facts. 
                An isolated claim is risky; a claim reported by AP, Reuters, and BBC is likely true.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-secondary/30 p-4 rounded-lg text-sm text-center">
          <p className="font-medium text-foreground">Why do we do this?</p>
          <p className="text-muted-foreground mt-1">
            Media literacy is about questioning "Who said this, and why?" 
            TruthLens automates these questions to help you spot misinformation before you share.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
