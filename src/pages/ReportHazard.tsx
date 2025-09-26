import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  MapPin, 
  Camera, 
  Upload, 
  Navigation, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileImage,
  Mic,
  MicOff,
  Phone,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import WebsiteHeader from '@/components/WebsiteHeader';

interface ReportStep {
  id: number;
  title: string;
  description: string;
}

const reportSteps: ReportStep[] = [
  { id: 1, title: 'Location', description: 'Confirm your location' },
  { id: 2, title: 'Hazard Details', description: 'Describe the hazard' },
  { id: 3, title: 'Media Upload', description: 'Add photos/videos' },
  { id: 4, title: 'Review', description: 'Review and submit' }
];

const ReportHazard: React.FC = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [reportData, setReportData] = useState({
    location: {
      latitude: '',
      longitude: '',
      address: '',
      accuracy: 0
    },
    hazard: {
      type: '',
      severity: [3],
      description: '',
      immediateRisk: false
    },
    media: {
      files: [] as File[],
      uploads: [] as { name: string; progress: number; url?: string }[]
    },
    contact: {
      name: '',
      phone: '',
      email: ''
    }
  });

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setReportData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              latitude: position.coords.latitude.toFixed(6),
              longitude: position.coords.longitude.toFixed(6),
              accuracy: Math.round(position.coords.accuracy)
            }
          }));
          toast({
            title: "Location captured",
            description: `Accuracy: ${Math.round(position.coords.accuracy)}m`,
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Unable to get your location. Please enter manually.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).slice(0, 5); // Max 5 files
    setReportData(prev => ({
      ...prev,
      media: {
        ...prev.media,
        files: [...prev.media.files, ...newFiles].slice(0, 5)
      }
    }));

    // Simulate upload progress
    newFiles.forEach((file, index) => {
      const upload = { name: file.name, progress: 0 };
      setReportData(prev => ({
        ...prev,
        media: {
          ...prev.media,
          uploads: [...prev.media.uploads, upload]
        }
      }));

      // Simulate upload progress
      const interval = setInterval(() => {
        setReportData(prev => ({
          ...prev,
          media: {
            ...prev.media,
            uploads: prev.media.uploads.map(u => 
              u.name === file.name && u.progress < 100 
                ? { ...u, progress: u.progress + 10 }
                : u
            )
          }
        }));
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setReportData(prev => ({
          ...prev,
          media: {
            ...prev.media,
            uploads: prev.media.uploads.map(u => 
              u.name === file.name 
                ? { ...u, progress: 100, url: URL.createObjectURL(file) }
                : u
            )
          }
        }));
      }, 2000);
    });
  };

  const handleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Voice note has been added to your report",
      });
    } else {
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speak clearly to describe the hazard",
      });
    }
  };

  const submitReport = () => {
    // Generate tracking ID
    const trackingId = `HR-${Date.now().toString().slice(-6)}`;
    
    toast({
      title: "Report submitted successfully!",
      description: `Tracking ID: ${trackingId}. You will receive updates via SMS/email.`,
    });
    
    // Reset form
    setCurrentStep(1);
    setReportData({
      location: { latitude: '', longitude: '', address: '', accuracy: 0 },
      hazard: { type: '', severity: [3], description: '', immediateRisk: false },
      media: { files: [], uploads: [] },
      contact: { name: '', phone: '', email: '' }
    });
  };

  const canProceed = (step: number) => {
    switch (step) {
      case 1:
        return reportData.location.latitude && reportData.location.longitude;
      case 2:
        return reportData.hazard.type && reportData.hazard.description.length > 10;
      case 3:
        return true; // Media is optional
      case 4:
        return reportData.contact.name && reportData.contact.phone;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Confirm Your Location</h3>
              <p className="text-muted-foreground">
                Accurate location helps emergency responders reach you quickly
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <Button 
                  onClick={getCurrentLocation} 
                  className="w-full flex items-center gap-2"
                  size="lg"
                >
                  <Navigation className="h-5 w-5" />
                  Get Current Location
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or enter manually
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Latitude</label>
                    <Input
                      type="number"
                      step="0.000001"
                      placeholder="e.g., 19.0760"
                      value={reportData.location.latitude}
                      onChange={(e) => setReportData(prev => ({
                        ...prev,
                        location: { ...prev.location, latitude: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Longitude</label>
                    <Input
                      type="number"
                      step="0.000001"
                      placeholder="e.g., 72.8777"
                      value={reportData.location.longitude}
                      onChange={(e) => setReportData(prev => ({
                        ...prev,
                        location: { ...prev.location, longitude: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Address/Landmark</label>
                  <Input
                    placeholder="e.g., Near Marine Drive, Mumbai"
                    value={reportData.location.address}
                    onChange={(e) => setReportData(prev => ({
                      ...prev,
                      location: { ...prev.location, address: e.target.value }
                    }))}
                  />
                </div>

                {reportData.location.accuracy > 0 && (
                  <div className="text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Location accuracy: {reportData.location.accuracy}m
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Describe the Hazard</h3>
              <p className="text-muted-foreground">
                Provide detailed information about what you're observing
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium">Hazard Type *</label>
                  <Select 
                    value={reportData.hazard.type} 
                    onValueChange={(value) => setReportData(prev => ({
                      ...prev,
                      hazard: { ...prev.hazard, type: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select hazard type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tsunami">🌊 Tsunami</SelectItem>
                      <SelectItem value="storm-surge">⛈️ Storm Surge</SelectItem>
                      <SelectItem value="high-waves">🌊 High Waves</SelectItem>
                      <SelectItem value="flooding">💧 Coastal Flooding</SelectItem>
                      <SelectItem value="erosion">🏔️ Coastal Erosion</SelectItem>
                      <SelectItem value="other">⚠️ Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Severity Level: {reportData.hazard.severity[0]}</label>
                  <div className="mt-2">
                    <Slider
                      value={reportData.hazard.severity}
                      onValueChange={(value) => setReportData(prev => ({
                        ...prev,
                        hazard: { ...prev.hazard, severity: value }
                      }))}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1 - Minor</span>
                      <span>3 - Moderate</span>
                      <span>5 - Critical</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Description *</label>
                  <Textarea
                    placeholder="Describe what you're seeing, hearing, or experiencing. Include details like wave height, water levels, damage, etc."
                    value={reportData.hazard.description}
                    onChange={(e) => setReportData(prev => ({
                      ...prev,
                      hazard: { ...prev.hazard, description: e.target.value }
                    }))}
                    rows={4}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {reportData.hazard.description.length}/500 characters
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    onClick={handleVoiceRecording}
                    className="flex items-center gap-2"
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    {isRecording ? 'Stop Recording' : 'Voice Description'}
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="immediate-risk"
                      checked={reportData.hazard.immediateRisk}
                      onChange={(e) => setReportData(prev => ({
                        ...prev,
                        hazard: { ...prev.hazard, immediateRisk: e.target.checked }
                      }))}
                    />
                    <label htmlFor="immediate-risk" className="text-sm">
                      Immediate risk to life/property
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Add Photos or Videos</h3>
              <p className="text-muted-foreground">
                Visual evidence helps verify and assess the situation (Optional)
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Images, videos up to 10MB each (Max 5 files)
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />

                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Take Photo
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileImage className="h-4 w-4" />
                    Choose from Gallery
                  </Button>
                </div>

                {reportData.media.uploads.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Uploaded Files</h4>
                    {reportData.media.uploads.map((upload, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm truncate">{upload.name}</span>
                        <div className="flex items-center gap-2">
                          {upload.progress < 100 ? (
                            <Progress value={upload.progress} className="w-20" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Review Your Report</h3>
              <p className="text-muted-foreground">
                Please review all information before submitting
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Your Name *</label>
                    <Input
                      placeholder="Full name"
                      value={reportData.contact.name}
                      onChange={(e) => setReportData(prev => ({
                        ...prev,
                        contact: { ...prev.contact, name: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone Number *</label>
                    <Input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={reportData.contact.phone}
                      onChange={(e) => setReportData(prev => ({
                        ...prev,
                        contact: { ...prev.contact, phone: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email (Optional)</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={reportData.contact.email}
                      onChange={(e) => setReportData(prev => ({
                        ...prev,
                        contact: { ...prev.contact, email: e.target.value }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Report Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Location:</span>
                    <p className="text-sm">{reportData.location.address || `${reportData.location.latitude}, ${reportData.location.longitude}`}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Hazard:</span>
                    <p className="text-sm capitalize">{reportData.hazard.type?.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Severity:</span>
                    <Badge variant={reportData.hazard.severity[0] >= 4 ? 'destructive' : reportData.hazard.severity[0] >= 3 ? 'default' : 'secondary'}>
                      Level {reportData.hazard.severity[0]}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Description:</span>
                    <p className="text-sm">{reportData.hazard.description.substring(0, 100)}...</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Media Files:</span>
                    <p className="text-sm">{reportData.media.files.length} files attached</p>
                  </div>
                  {reportData.hazard.immediateRisk && (
                    <Badge variant="destructive">Immediate Risk Alert</Badge>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Emergency Contacts</p>
                    <p className="text-muted-foreground">
                      For immediate emergencies, call: <span className="font-medium">Emergency Services (100/108)</span> or 
                      Coast Guard Emergency (1554)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <WebsiteHeader />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Report Ocean Hazard</h1>
        <p className="text-muted-foreground mt-2">
          Help protect coastal communities by reporting hazardous conditions
        </p>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-8">
            {reportSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-muted-foreground text-muted-foreground'
                }`}>
                  {currentStep > step.id ? <CheckCircle className="h-5 w-5" /> : step.id}
                </div>
                <div className="ml-2 hidden sm:block">
                  <div className={`text-sm font-medium ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
                {index < reportSteps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${currentStep > step.id ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>

          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              {currentStep < 4 ? (
                <Button 
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceed(currentStep)}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={submitReport}
                  disabled={!canProceed(currentStep)}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Submit Report
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-red-700 dark:text-red-400">Emergency Situation?</p>
              <p className="text-sm text-red-600 dark:text-red-300">
                For immediate danger, call emergency services first: 100, 108, or Coast Guard: 1554
              </p>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default ReportHazard;