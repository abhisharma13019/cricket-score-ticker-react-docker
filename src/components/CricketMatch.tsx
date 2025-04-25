
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
  const [matchData, setMatchData] = React.useState<MatchData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchMatchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://api.cricapi.com/v1/currentMatches?apikey=bebbb42b-3078-4930-bd3c-279db4c45c2b&offset=0');
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        setMatchData(data.data[0]); // Taking the first match from the list
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

  if (isLoading && !matchData) {
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
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">Live Cricket Score</h2>
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

        {matchData && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                {matchData.teams.map((team, index) => (
                  <div key={team} className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">{team}</h3>
                    <span className="text-lg">
                      {matchData.score[index] 
                        ? `${matchData.score[index].r}/${matchData.score[index].w} (${matchData.score[index].o})`
                        : 'Yet to bat'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-600 pt-2 border-t">
              {matchData.status}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CricketMatch;

