import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { getCredibilityLevel } from './CredibilityBadge';

interface RatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (rating: { score: number; reason: string }) => void;
  articleTitle: string;
}

const RATING_REASONS = [
  { value: 'well_sourced', label: 'Well Sourced' },
  { value: 'poor_sourcing', label: 'Poor Sourcing' },
  { value: 'emotional_language', label: 'Emotional Language' },
  { value: 'factual_accuracy', label: 'Factual Accuracy' },
  { value: 'misleading_headline', label: 'Misleading Headline' },
  { value: 'balanced_reporting', label: 'Balanced Reporting' },
  { value: 'missing_context', label: 'Missing Context' },
];

export function RatingModal({ open, onOpenChange, onSubmit, articleTitle }: RatingModalProps) {
  const [score, setScore] = useState([50]);
  const [reason, setReason] = useState('');

  const level = getCredibilityLevel(score[0]);

  const handleSubmit = () => {
    if (!reason) return;
    onSubmit({ score: score[0], reason });
    onOpenChange(false);
    setScore([50]);
    setReason('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Credibility</DialogTitle>
          <DialogDescription className="line-clamp-2">
            {articleTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Score Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Credibility Score</Label>
              <span className={cn(
                'text-2xl font-bold',
                level === 'high' && 'text-credibility-high',
                level === 'medium' && 'text-credibility-medium',
                level === 'low' && 'text-credibility-low'
              )}>
                {score[0]}%
              </span>
            </div>
            <div className="space-y-2">
              <Slider
                value={score}
                onValueChange={setScore}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low Credibility</span>
                <span>High Credibility</span>
              </div>
            </div>
          </div>

          {/* Reason Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Rating</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {RATING_REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!reason}
            className="bg-trust hover:bg-trust/90"
          >
            Submit Rating
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
