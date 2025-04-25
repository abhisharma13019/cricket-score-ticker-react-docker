
import React, { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface MatchData {
  teams: {
    team1: string;
    team2: string;
  };
  score: {
    team1: string;
    team2: string;
  };
  status: string;
}

const CricketMatch = () => {
  const [matchData, setMatchData] = React.useState<MatchData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchMatchData = async () => {
    try {
      setIsLoading(true);
      // Using a mock API for demonstration
      const response = await fetch('https://demo.api-cricket.net/live-score');
      const data = await response.json();
      setMatchData({
        teams: {
          team1: 'India',
          team2: 'Australia'
        },
        score: {
          team1: '287/4 (45.2)',
          team2: 'Yet to bat'
        },
        status: 'Live - India won the toss and elected to bat'
      });
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
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{matchData.teams.team1}</h3>
                  <span className="text-lg">{matchData.score.team1}</span>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{matchData.teams.team2}</h3>
                  <span className="text-lg">{matchData.score.team2}</span>
                </div>
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
