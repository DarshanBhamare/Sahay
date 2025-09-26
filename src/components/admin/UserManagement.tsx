import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, UserPlus, Shield, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { UserRole } from '@/contexts/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  verified: boolean;
  lastLogin: string;
  reportsSubmitted: number;
  location: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@incois.gov.in',
    role: 'analyst',
    status: 'active',
    verified: true,
    lastLogin: '2 hours ago',
    reportsSubmitted: 0,
    location: 'Hyderabad'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    role: 'citizen',
    status: 'active',
    verified: true,
    lastLogin: '5 minutes ago',
    reportsSubmitted: 12,
    location: 'Mumbai'
  },
  {
    id: '3',
    name: 'Capt. Ravi Menon',
    email: 'ravi.menon@coastguard.gov.in',
    role: 'official',
    status: 'active',
    verified: true,
    lastLogin: '1 hour ago',
    reportsSubmitted: 8,
    location: 'Kochi'
  },
  {
    id: '4',
    name: 'Admin User',
    email: 'admin@incois.gov.in',
    role: 'admin',
    status: 'active',
    verified: true,
    lastLogin: '30 minutes ago',
    reportsSubmitted: 0,
    location: 'Delhi'
  },
  {
    id: '5',
    name: 'Suresh Fisherman',
    email: 'suresh.fish@yahoo.com',
    role: 'citizen',
    status: 'suspended',
    verified: false,
    lastLogin: '2 days ago',
    reportsSubmitted: 23,
    location: 'Chennai'
  }
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'analyst': return 'default';
      case 'official': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'suspended': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleStatusToggle = (userId: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'suspended' : 'active';
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="citizen">Citizens</SelectItem>
              <SelectItem value="official">Officials</SelectItem>
              <SelectItem value="analyst">Analysts</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="w-full md:w-auto">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Users Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reports</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.name}</span>
                          {user.verified && <CheckCircle className="h-4 w-4 text-green-600" />}
                        </div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <div className="text-xs text-muted-foreground">📍 {user.location}</div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Select 
                      value={user.role} 
                      onValueChange={(value: UserRole) => handleRoleChange(user.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <Badge variant={getRoleColor(user.role)} className="text-xs">
                          {user.role}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="citizen">Citizen</SelectItem>
                        <SelectItem value="official">Official</SelectItem>
                        <SelectItem value="analyst">Analyst</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant={getStatusColor(user.status)} className="text-xs">
                      {user.status}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    {user.reportsSubmitted}
                  </TableCell>
                  
                  <TableCell className="text-sm text-muted-foreground">
                    {user.lastLogin}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleStatusToggle(user.id)}
                      >
                        {user.status === 'active' ? 
                          <XCircle className="h-4 w-4 text-red-600" /> : 
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        }
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No users found matching your filters.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;