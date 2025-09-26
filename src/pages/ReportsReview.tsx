import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  MapPin,
  User,
  Calendar,
  FileText,
  Eye,
  Flag,
  Download,
  Star,
  Waves,
  CloudLightning,
  Droplet,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import WebsiteHeader from '@/components/WebsiteHeader';

interface HazardReport {
  id: string;
  trackingId: string;
  type: 'tsunami' | 'storm-surge' | 'high-waves' | 'flooding' | 'erosion';
  severity: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  reporter: {
    name: string;
    phone: string;
    email: string;
    verified: boolean;
  };
  timestamp: string;
  status: 'pending' | 'under-review' | 'verified' | 'false-alarm' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  mediaFiles: { type: 'image' | 'video'; url: string; name: string }[];
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  publicVisibility: boolean;
  confidence: number;
}

const mockReports: HazardReport[] = [
  {
    id: '1',
    trackingId: 'HR-001234',
    type: 'tsunami',
    severity: 5,
    title: 'Massive waves approaching Dwarka coast',
    description: 'Observed extremely high waves approaching the coastline. Water level rising rapidly. Immediate evacuation recommended for coastal areas.',
    location: {
      address: 'Dwarka Beach, Gujarat',
      coordinates: { lat: 22.2394, lng: 68.9685 }
    },
    reporter: {
      name: 'Rajesh Patel',
      phone: '+91 9876543210',
      email: 'rajesh.patel@gmail.com',
      verified: true
    },
    timestamp: '2024-01-15 14:30:00',
    status: 'under-review',
    priority: 'critical',
    mediaFiles: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1549480119-94776100c5c3?q=80&w=2070&auto=format&fit=crop', name: 'tsunami-waves-1.jpg' },
      { type: 'video', url: 'https://images.unsplash.com/photo-1517590457682-1c251d187768?q=80&w=1932&auto=format&fit=crop', name: 'tsunami-video.mp4' }
    ],
    publicVisibility: true,
    confidence: 85
  },
  {
    id: '2',
    trackingId: 'HR-001235',
    type: 'storm-surge',
    severity: 4,
    title: 'Storm surge warning - Chennai Port',
    description: 'Strong winds and storm surge observed at Chennai Port. Several fishing boats struggling to return to harbor.',
    location: {
      address: 'Chennai Port, Tamil Nadu',
      coordinates: { lat: 13.1067, lng: 80.3012 }
    },
    reporter: {
      name: 'Captain S. Kumar',
      phone: '+91 9123456789',
      email: 's.kumar@chennaiport.gov.in',
      verified: true
    },
    timestamp: '2024-01-15 13:45:00',
    status: 'verified',
    priority: 'high',
    mediaFiles: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1502685973808-f4de3823485d?q=80&w=2070&auto=format&fit=crop', name: 'storm-surge-1.jpg' }
    ],
    reviewNotes: 'Verified by Coast Guard. Official storm surge warning issued.',
    reviewedBy: 'Dr. A. Sharma',
    reviewedAt: '2024-01-15 14:15:00',
    publicVisibility: true,
    confidence: 92
  },
  {
    id: '3',
    trackingId: 'HR-001236',
    type: 'high-waves',
    severity: 3,
    title: 'High waves at Kovalam Beach',
    description: 'Unusually high waves observed at Kovalam Beach. Tourists advised to maintain safe distance from shoreline.',
    location: {
      address: 'Kovalam Beach, Kerala',
      coordinates: { lat: 8.4004, lng: 76.9787 }
    },
    reporter: {
      name: 'Beach Resort Manager',
      phone: '+91 9087654321',
      email: 'manager@kovalamresort.com',
      verified: false
    },
    timestamp: '2024-01-15 12:20:00',
    status: 'pending',
    priority: 'medium',
    mediaFiles: [],
    publicVisibility: false,
    confidence: 67
  },
  {
    id: '4',
    trackingId: 'HR-001237',
    type: 'flooding',
    severity: 2,
    title: 'Minor coastal flooding in Kolkata',
    description: 'Water logging observed in low-lying coastal areas during high tide. Roads partially affected.',
    location: {
      address: 'Salt Lake, Kolkata, West Bengal',
      coordinates: { lat: 22.5958, lng: 88.2636 }
    },
    reporter: {
      name: 'Local Resident',
      phone: '+91 9234567890',
      email: 'resident@gmail.com',
      verified: false
    },
    timestamp: '2024-01-15 11:00:00',
    status: 'false-alarm',
    priority: 'low',
    mediaFiles: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1596707323136-23589b273d2a?q=80&w=1935&auto=format&fit=crop', name: 'minor-flooding.jpg' }
    ],
    reviewNotes: 'Normal tidal flooding. No emergency action required.',
    reviewedBy: 'City Official',
    reviewedAt: '2024-01-15 12:30:00',
    publicVisibility: false,
    confidence: 45
  },
  {
    id: '5',
    trackingId: 'HR-001238',
    type: 'erosion',
    severity: 3,
    title: 'Significant beach erosion at Goa',
    description: 'Noticeable loss of sand and collapse of some dunes due to recent high tides. Local authorities are being informed.',
    location: {
      address: 'Colva Beach, Goa',
      coordinates: { lat: 15.2891, lng: 73.9213 }
    },
    reporter: {
      name: 'Environmentalist Group',
      phone: '+91 9543210987',
      email: 'goa.env@org.in',
      verified: true
    },
    timestamp: '2024-01-14 09:15:00',
    status: 'pending',
    priority: 'medium',
    mediaFiles: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1549495400-058869151759?q=80&w=2070&auto=format&fit=crop', name: 'erosion-goa.jpg' }
    ],
    publicVisibility: true,
    confidence: 75
  },
];

const ReportsReview: React.FC = () => {
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState<HazardReport | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [reviewNotes, setReviewNotes] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const activeFilters = [statusFilter, priorityFilter, typeFilter].filter(f => f !== 'all').length;

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = searchQuery === '' || 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporter.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'default';
      case 'under-review': return 'secondary';
      case 'pending': return 'outline';
      case 'false-alarm': return 'destructive';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 5) return 'bg-red-600';
    if (severity >= 4) return 'bg-orange-500';
    if (severity >= 3) return 'bg-yellow-500';
    if (severity >= 2) return 'bg-blue-500';
    return 'bg-green-500';
  };
  
  const getIconForType = (type: string) => {
    switch (type) {
      case 'tsunami':
      case 'high-waves':
        return <Waves className="h-4 w-4" />;
      case 'storm-surge':
        return <CloudLightning className="h-4 w-4" />;
      case 'flooding':
        return <Droplet className="h-4 w-4" />;
      case 'erosion':
        return <Globe className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleReviewAction = (reportId: string, action: 'verify' | 'reject' | 'false-alarm') => {
    const actionText = action === 'verify' ? 'verified' : action === 'reject' ? 'rejected' : 'marked as false alarm';
    
    toast({
      title: `Report ${actionText}`,
      description: `Report ${reportId} has been ${actionText} successfully.`,
    });
    
    setSelectedReport(null);
    setReviewNotes('');
  };

  return (
    <>
      <WebsiteHeader />
      <div className="space-y-6 px-4 max-w-7xl mx-auto py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports Review</h1>
          <p className="text-muted-foreground">
            Review and validate hazard reports from citizens and officials
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Reports
          </Button>
          <Button className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Summary
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by tracking ID, title, or reporter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 relative w-full md:w-auto"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilters > 0 && (
                <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 justify-center rounded-full p-0 text-xs">
                  {activeFilters}
                </Badge>
              )}
            </Button>
          </div>
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="false-alarm">False Alarm</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="tsunami">Tsunami</SelectItem>
                  <SelectItem value="storm-surge">Storm Surge</SelectItem>
                  <SelectItem value="high-waves">High Waves</SelectItem>
                  <SelectItem value="flooding">Flooding</SelectItem>
                  <SelectItem value="erosion">Erosion</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="table" className="space-y-6">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity/Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id} className="cursor-pointer" onClick={() => setSelectedReport(report)}>
                      <TableCell className="font-mono text-sm">
                        {report.trackingId}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{report.title}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {report.location.address}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize flex items-center gap-1">
                          {getIconForType(report.type)}
                          {report.type.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getSeverityColor(report.severity)}`} />
                          <span className="text-sm">{report.severity}</span>
                        </div>
                        <span className={`text-xs font-medium ${getPriorityColor(report.priority)}`}>
                          {report.priority.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(report.status)} className="text-xs capitalize">
                          {report.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {report.reporter.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-sm font-medium">{report.reporter.name}</div>
                          {report.reporter.verified && (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(report.timestamp).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); setSelectedReport(report); }}
                          className="flex items-center gap-1 text-sm text-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <Card key={report.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedReport(report)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{report.title}</CardTitle>
                      <div className="text-sm text-muted-foreground font-mono mt-1">
                        {report.trackingId}
                      </div>
                    </div>
                    <Badge variant={getStatusColor(report.status)} className="text-xs capitalize">
                      {report.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(report.severity)}`} />
                      <span className="text-sm font-medium">Severity {report.severity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flag className={`h-4 w-4 ${getPriorityColor(report.priority)}`} />
                      <span className={`text-sm font-medium ${getPriorityColor(report.priority)}`}>
                        {report.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {report.location.address}</div>
                    <div className="flex items-center gap-1"><User className="h-4 w-4" /> {report.reporter.name} {report.reporter.verified && <CheckCircle className="h-3 w-3 text-green-600" />}</div>
                    <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(report.timestamp).toLocaleDateString()}</div>
                  </div>
                  
                  {report.mediaFiles.length > 0 && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                      <FileText className="h-3 w-3" /> {report.mediaFiles.length} attachment(s)
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="map">
          <div className="text-center py-12 text-muted-foreground">
            Map view integration coming soon...
          </div>
        </TabsContent>
      </Tabs>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedReport.title}</CardTitle>
                  <div className="text-sm text-muted-foreground font-mono mt-1">
                    {selectedReport.trackingId}
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setSelectedReport(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Report Details Section */}
                <div className="space-y-4">
                  <h4 className="font-medium text-lg">Report Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <strong>Type:</strong> 
                      <Badge variant="outline" className="capitalize">
                        {selectedReport.type.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <strong>Severity:</strong> 
                      <div className="flex items-center gap-1">
                        <div className={`w-4 h-4 rounded-full ${getSeverityColor(selectedReport.severity)}`} />
                        Level {selectedReport.severity}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-muted-foreground" />
                      <strong>Priority:</strong> 
                      <span className={`font-medium ${getPriorityColor(selectedReport.priority)}`}>
                        {selectedReport.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <strong>Status:</strong> 
                      <Badge variant={getStatusColor(selectedReport.status)} className="capitalize">
                        {selectedReport.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <strong>Confidence:</strong>
                        <span className="text-sm">{selectedReport.confidence}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-500" 
                          style={{ width: `${selectedReport.confidence}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Reporter and Timestamps */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-lg mb-2">Reporter Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <strong>Name:</strong> {selectedReport.reporter.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className={`h-4 w-4 ${selectedReport.reporter.verified ? 'text-green-600' : 'text-red-600'}`} />
                        <strong>Verified:</strong> {selectedReport.reporter.verified ? 'Yes' : 'No'}
                      </div>
                      <div className="flex items-center gap-1">
                        <strong>Phone:</strong> {selectedReport.reporter.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <strong>Email:</strong> {selectedReport.reporter.email}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-lg mb-2">Timestamps</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <strong>Reported:</strong> {new Date(selectedReport.timestamp).toLocaleString()}
                      </div>
                      {selectedReport.reviewedAt && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <strong>Reviewed:</strong> {new Date(selectedReport.reviewedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-lg mb-2">Description</h4>
                <p className="text-sm bg-muted/30 p-4 rounded-md shadow-inner">{selectedReport.description}</p>
              </div>
              
              {selectedReport.reviewNotes && (
                <div>
                  <h4 className="font-medium text-lg mb-2">Review Notes</h4>
                  <p className="text-sm bg-muted/30 p-4 rounded-md shadow-inner">{selectedReport.reviewNotes}</p>
                  <p className="text-xs text-muted-foreground mt-1">Reviewed by: {selectedReport.reviewedBy}</p>
                </div>
              )}
              
              {selectedReport.mediaFiles.length > 0 && (
                <div>
                  <h4 className="font-medium text-lg mb-2">Media Evidence</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedReport.mediaFiles.map((file, index) => (
                      <div key={index} className="relative aspect-video rounded-md overflow-hidden border cursor-pointer group">
                        <img 
                          src={file.url} 
                          alt={file.name} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {(selectedReport.status === 'pending' || selectedReport.status === 'under-review') && (
                <div>
                  <h4 className="font-medium text-lg mb-2">Review Action</h4>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Add review notes..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={3}
                      className="bg-muted/30"
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        onClick={() => handleReviewAction(selectedReport.trackingId, 'verify')}
                        className="flex items-center gap-2 flex-1 min-w-[150px]"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Verify
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleReviewAction(selectedReport.trackingId, 'false-alarm')}
                        className="flex items-center gap-2 flex-1 min-w-[150px]"
                      >
                        <Flag className="h-4 w-4" />
                        False Alarm
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleReviewAction(selectedReport.trackingId, 'reject')}
                        className="flex items-center gap-2 flex-1 min-w-[150px]"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
    </>
  );
};

export default ReportsReview;