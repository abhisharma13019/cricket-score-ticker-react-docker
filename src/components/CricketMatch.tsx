
import React, { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MatchData {
  id: string;
  name: string;
  status: string;
  teams: string[];
  score: {
    r: number;
    w: number;
    o: number;
  }[];
}

const CricketMatch = () => {
  const [matches, setMatches] = React.useState<MatchData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [selectedMatch, setSelectedMatch] = React.useState<MatchData | null>(null);
  const { toast } = useToast();

  const fetchMatchData = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch('https://api.cricapi.com/v1/currentMatches?apikey=&offset=0');
      const data = await response.json();
      
      if (data.data) {
        setMatches(data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch match data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMatchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMatchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading && matches.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin">
          <RefreshCw className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Live Cricket Scores</h2>
          <Button
            onClick={fetchMatchData}
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => (
            <Card 
              key={match.id} 
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedMatch(match)}
            >
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-gray-500">{match.name}</h3>
                <div className="space-y-2">
                  {match.teams.map((team, index) => (
                    <div key={team} className="flex justify-between items-center">
                      <h4 className="text-base font-semibold">{team}</h4>
                      <span className="text-sm">
                        {match.score[index] 
                          ? `${match.score[index].r}/${match.score[index].w} (${match.score[index].o})`
                          : 'Yet to bat'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600 pt-2 border-t">
                  {match.status}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={!!selectedMatch} onOpenChange={() => setSelectedMatch(null)}>
          <DialogContent className="max-w-3xl">
            {selectedMatch && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedMatch.name}</DialogTitle>
                </DialogHeader>
                <div className="mt-6 space-y-6">
                  <div className="grid gap-8">
                    {selectedMatch.teams.map((team, index) => (
                      <div key={team} className="space-y-2">
                        <h3 className="text-xl font-bold">{team}</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          {selectedMatch.score[index] ? (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Score:</span>
                                <span className="text-2xl font-bold">
                                  {selectedMatch.score[index].r}/{selectedMatch.score[index].w}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Overs:</span>
                                <span className="text-lg">{selectedMatch.score[index].o}</span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-500">Yet to bat</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="text-lg font-semibold mb-2">Match Status</h4>
                    <p className="text-gray-700">{selectedMatch.status}</p>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CricketMatch;
