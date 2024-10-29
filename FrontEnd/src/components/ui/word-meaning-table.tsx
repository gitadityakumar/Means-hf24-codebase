'use client';

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/text-area";
import { Card, CardContent } from "@/components/ui/card";

type WordMeaning = {
  id: number;
  word: string;
  meaning: string;
};

interface WordMeaningTableProps {
  wordMeanings: WordMeaning[];
  onWordMeaningsChange: (updatedWordMeanings: WordMeaning[]) => void;
}

export default function WordMeaningTable({ wordMeanings, onWordMeaningsChange }: WordMeaningTableProps) {
  const handleEdit = (id: number, field: 'word' | 'meaning', value: string) => {
    const updatedWordMeanings = wordMeanings.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onWordMeaningsChange(updatedWordMeanings);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gray-200">
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 font-bold">
            <div className="w-full sm:w-1/3">Word</div>
            <div className="w-full sm:w-2/3">Meaning</div>
          </div>
          {wordMeanings.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/3">
                <Input
                  id={`word-${item.id}`}
                  value={item.word}
                  onChange={(e) => handleEdit(item.id, 'word', e.target.value)}
                  placeholder="Enter word"
                  className="w-full bg-white/50"
                />
              </div>
              <div className="w-full sm:w-2/3">
                <Textarea
                  id={`meaning-${item.id}`}
                  value={item.meaning}
                  onChange={(e) => handleEdit(item.id, 'meaning', e.target.value)}
                  placeholder="Enter meaning"
                  className="w-full bg-white/50"
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
