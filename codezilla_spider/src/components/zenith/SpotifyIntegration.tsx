import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Disc3, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Heart,
  Clock,
  TrendingUp,
  Brain,
  Heart as HeartIcon,
  Activity,
  Moon,
  Sun,
  Zap
} from 'lucide-react';

interface SpotifyIntegrationProps {
  className?: string;
}

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: string;
  image: string;
  uri: string;
  mood: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  image: string;
  trackCount: number;
  mood: string;
}

export const SpotifyIntegration: React.FC<SpotifyIntegrationProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [currentMood, setCurrentMood] = useState('calm');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState(50);
  const [recommendedTracks, setRecommendedTracks] = useState<Track[]>([]);
  const [moodPlaylists, setMoodPlaylists] = useState<Playlist[]>([]);
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);

  // Initialize with sample data
  useEffect(() => {
    const sampleTracks: Track[] = [
      {
        id: '1',
        name: 'Weightless',
        artist: 'Marconi Union',
        album: 'Different Colours',
        duration: '8:10',
        image: 'https://via.placeholder.com/150/3B82F6/FFFFFF?text=Weightless',
        uri: 'spotify:track:1',
        mood: 'calm'
      },
      {
        id: '2',
        name: 'Claire de Lune',
        artist: 'Debussy',
        album: 'Suite Bergamasque',
        duration: '5:32',
        image: 'https://via.placeholder.com/150/8B5CF6/FFFFFF?text=Claire+de+Lune',
        uri: 'spotify:track:2',
        mood: 'relaxed'
      },
      {
        id: '3',
        name: 'River Flows in You',
        artist: 'Yiruma',
        album: 'First Love',
        duration: '3:10',
        image: 'https://via.placeholder.com/150/10B981/FFFFFF?text=River+Flows',
        uri: 'spotify:track:3',
        mood: 'peaceful'
      },
      {
        id: '4',
        name: 'Gymnopedie No. 1',
        artist: 'Erik Satie',
        album: 'Gymnopedies',
        duration: '3:21',
        image: 'https://via.placeholder.com/150/F59E0B/FFFFFF?text=Gymnopedie',
        uri: 'spotify:track:4',
        mood: 'contemplative'
      },
      {
        id: '5',
        name: 'The Scientist',
        artist: 'Coldplay',
        album: 'A Rush of Blood to the Head',
        duration: '5:09',
        image: 'https://via.placeholder.com/150/EF4444/FFFFFF?text=The+Scientist',
        uri: 'spotify:track:5',
        mood: 'melancholic'
      }
    ];

    const samplePlaylists: Playlist[] = [
      {
        id: '1',
        name: 'Calm & Peaceful',
        description: 'Soothing melodies for relaxation and stress relief',
        image: 'https://via.placeholder.com/150/3B82F6/FFFFFF?text=Calm',
        trackCount: 45,
        mood: 'calm'
      },
      {
        id: '2',
        name: 'Focus & Concentration',
        description: 'Instrumental tracks to enhance productivity',
        image: 'https://via.placeholder.com/150/10B981/FFFFFF?text=Focus',
        trackCount: 32,
        mood: 'focused'
      },
      {
        id: '3',
        name: 'Energy Boost',
        description: 'Upbeat tracks to lift your mood and energy',
        image: 'https://via.placeholder.com/150/F59E0B/FFFFFF?text=Energy',
        trackCount: 28,
        mood: 'energetic'
      },
      {
        id: '4',
        name: 'Sleep & Meditation',
        description: 'Gentle sounds for better sleep and mindfulness',
        image: 'https://via.placeholder.com/150/8B5CF6/FFFFFF?text=Sleep',
        trackCount: 52,
        mood: 'sleep'
      }
    ];

    setRecommendedTracks(sampleTracks);
    setMoodPlaylists(samplePlaylists);
    setRecentTracks(sampleTracks.slice(0, 3));
  }, []);

  const getMoodRecommendations = (mood: string) => {
    const moodTracks = {
      calm: recommendedTracks.filter(track => ['calm', 'relaxed', 'peaceful'].includes(track.mood)),
      focused: recommendedTracks.filter(track => ['focused', 'concentrated'].includes(track.mood)),
      energetic: recommendedTracks.filter(track => ['energetic', 'upbeat'].includes(track.mood)),
      sleep: recommendedTracks.filter(track => ['sleep', 'meditation'].includes(track.mood)),
      melancholic: recommendedTracks.filter(track => ['melancholic', 'contemplative'].includes(track.mood))
    };
    return moodTracks[mood as keyof typeof moodTracks] || recommendedTracks;
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'calm': return <Heart className="h-4 w-4" />;
      case 'focused': return <Brain className="h-4 w-4" />;
      case 'energetic': return <Zap className="h-4 w-4" />;
      case 'sleep': return <Moon className="h-4 w-4" />;
      case 'melancholic': return <HeartIcon className="h-4 w-4" />;
      default: return <Disc3 className="h-4 w-4" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'calm': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'focused': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'energetic': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'sleep': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'melancholic': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Music for Mental Health
        </h1>
        <p className="text-muted-foreground">AI-powered music recommendations based on your mood and wellbeing</p>
      </div>

      {/* Current Player */}
      {currentTrack && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <img 
                src={currentTrack.image} 
                alt={currentTrack.album}
                className="w-16 h-16 rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{currentTrack.name}</h3>
                <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
                <p className="text-xs text-muted-foreground">{currentTrack.album}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button onClick={togglePlayPause} size="sm">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mood Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            How are you feeling today?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={currentMood} onValueChange={setCurrentMood}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calm">😌 Calm & Relaxed</SelectItem>
              <SelectItem value="focused">🧠 Focused & Productive</SelectItem>
              <SelectItem value="energetic">⚡ Energetic & Motivated</SelectItem>
              <SelectItem value="sleep">😴 Sleep & Meditation</SelectItem>
              <SelectItem value="melancholic">💭 Melancholic & Contemplative</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="playlists">Mood Playlists</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getMoodRecommendations(currentMood).map(track => (
              <Card key={track.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <img 
                      src={track.image} 
                      alt={track.album}
                      className="w-12 h-12 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{track.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className={getMoodColor(track.mood)}>
                          {getMoodIcon(track.mood)}
                          <span className="ml-1 capitalize">{track.mood}</span>
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {track.duration}
                        </span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => playTrack(track)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="playlists" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moodPlaylists.map(playlist => (
              <Card key={playlist.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <img 
                      src={playlist.image} 
                      alt={playlist.name}
                      className="w-16 h-16 rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{playlist.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{playlist.description}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline" className={getMoodColor(playlist.mood)}>
                          {getMoodIcon(playlist.mood)}
                          <span className="ml-1 capitalize">{playlist.mood}</span>
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {playlist.trackCount} tracks
                        </span>
                      </div>
                    </div>
                    <Button size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="space-y-3">
            {recentTracks.map(track => (
              <Card key={track.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={track.image} 
                      alt={track.album}
                      className="w-10 h-10 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{track.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getMoodColor(track.mood)}>
                        {getMoodIcon(track.mood)}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => playTrack(track)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Wellness Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Music & Mental Health Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">For Stress Relief</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Listen to slow, instrumental music with 60-80 BPM to reduce cortisol levels and promote relaxation.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
              <h4 className="font-medium text-green-800 dark:text-green-200">For Focus</h4>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Classical music or nature sounds can improve concentration and cognitive performance.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
              <h4 className="font-medium text-purple-800 dark:text-purple-200">For Sleep</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                White noise or gentle ambient music can help you fall asleep faster and improve sleep quality.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">For Energy</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Upbeat music with 120-140 BPM can boost mood and increase energy levels naturally.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
