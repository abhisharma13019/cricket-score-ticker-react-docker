
import React, { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();

  const fetchMatchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://api.cricapi.com/v1/currentMatches?apikey=bebbb42b-3078-4930-bd3c-279db4c45c2b&offset=0');
      const data = await response.json();
      
      if (data.data) {
        setMatches(data.data);
      }
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch match data. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMatchData();
  }, []);

  // Auto refresh every 30 seconds
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
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => (
            <Card key={match.id} className="p-6">
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
      </div>
    </div>
  );
};

export default CricketMatch;

