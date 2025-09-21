'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Ban, 
  CheckCircle, 
  XCircle, 
  Crown, 
  User, 
  Settings,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Clock
} from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import InvitationManagement from './InvitationManagement';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  status: 'active' | 'banned';
  isOnline: boolean;
  lastSeen: string;
  joinDate: string;
  department?: string;
  isBanned?: boolean;
  bannedReason?: string;
  bannedAt?: string;
}

// Helper function to generate avatar with initials
const generateAvatar = (name: string) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128&bold=true`;
};

const roleConfig = {
  admin: { label: 'Admin', color: 'bg-red-100 text-red-800', icon: Crown },
  manager: { label: 'Manager', color: 'bg-blue-100 text-blue-800', icon: Shield },
  member: { label: 'Member', color: 'bg-green-100 text-green-800', icon: User },
};

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-800' },
  banned: { label: 'Banned', color: 'bg-red-100 text-red-800' },
};

export default function RoleManagement({ businessId = 1 }: { businessId?: number }) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isInvitationManagementOpen, setIsInvitationManagementOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  // API functions
  const fetchUsers = async (page: number = currentPage) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        businessId: businessId.toString(),
        page: page.toString(),
        limit: itemsPerPage.toString(),
        role: roleFilter,
        status: statusFilter,
        search: searchTerm
      });

      const response = await fetch(`/api/dashboard/settings/UserManagement/getAll?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.totalItems);
        setCurrentPage(data.pagination.currentPage);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userId: string, action: string, newRole?: string, banReason?: string) => {
    try {
      const response = await fetch('/api/dashboard/settings/UserManagement/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          businessId,
          action,
          newRole,
          banReason
        }),
      });

      if (response.ok) {
        await fetchUsers(); // Refresh the list
      } else {
        const errorData = await response.json();
        console.error('Error updating user:', errorData.error);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/dashboard/settings/UserManagement/delte?id=${userId}&businessId=${businessId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchUsers(); // Refresh the list
      } else {
        const errorData = await response.json();
        console.error('Error deleting user:', errorData.error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Load users on component mount and when filters change
  useEffect(() => {
    fetchUsers(1);
  }, [roleFilter, statusFilter, searchTerm, businessId]);

  // Filter users based on search and filters (client-side filtering for better UX)
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    await updateUser(userId, 'changeRole', newRole);
    setIsRoleDialogOpen(false);
    setSelectedUser(null);
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    if (newStatus === 'banned') {
      await updateUser(userId, 'ban', undefined, 'Banned by admin');
    } else if (newStatus === 'active') {
      await updateUser(userId, 'unban');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to remove this user from the business?')) {
      await deleteUser(userId);
    }
  };


  const getRoleIcon = (role: string) => {
    const IconComponent = roleConfig[role as keyof typeof roleConfig]?.icon || User;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100 rounded-3xl border border-gray-200/50 p-8 shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-white/80 rounded-2xl shadow-sm">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    User Management
                  </h1>
                  <p className="text-gray-600 mt-1 font-medium">Manage user roles, permissions, and access</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => setIsInvitationManagementOpen(true)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl"
            >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Invite User
                </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border border-blue-200/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/80 rounded-xl shadow-sm">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                <p className="text-sm font-medium text-blue-600">Total</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-700">Total Users</p>
            <p className="text-xs text-gray-500 mt-1">All registered users</p>
          </div>
        </div>

        {/* Online Users Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border border-green-200/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/80 rounded-xl shadow-sm">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{users.filter(u => u.isOnline).length}</p>
                <p className="text-sm font-medium text-green-600">Online</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-700">Online Now</p>
            <p className="text-xs text-gray-500 mt-1">Currently active</p>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl border border-purple-200/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/80 rounded-xl shadow-sm">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{users.filter(u => u.status === 'active').length}</p>
                <p className="text-sm font-medium text-purple-600">Active</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-700">Active Users</p>
            <p className="text-xs text-gray-500 mt-1">Not banned or pending</p>
          </div>
        </div>

        {/* Banned Users Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-red-50 to-rose-100 rounded-2xl border border-red-200/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-400/20 to-rose-400/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/80 rounded-xl shadow-sm">
                <Ban className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{users.filter(u => u.status === 'banned').length}</p>
                <p className="text-sm font-medium text-red-600">Banned</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-700">Banned Users</p>
            <p className="text-xs text-gray-500 mt-1">Restricted access</p>
          </div>
        </div>
      </div>

      {/* Invitation Management Component */}
      <InvitationManagement 
        isOpen={isInvitationManagementOpen}
        onClose={() => setIsInvitationManagementOpen(false)}
        businessId={1}
      />


      {/* Compact Filters */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/50 p-4 shadow-sm">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full -translate-y-8 translate-x-8"></div>
        
        <div className="relative">
          {/* Compact Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                <Filter className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            </div>
            
            {/* Active Filters Badge */}
            {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                {[searchTerm && 'Search', roleFilter !== 'all' && 'Role', statusFilter !== 'all' && 'Status'].filter(Boolean).length} active
              </Badge>
            )}
          </div>

          {/* Compact Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 rounded-xl border-gray-200 bg-white/80 focus:bg-white focus:border-blue-300 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XCircle className="h-3 w-3 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40 h-10 rounded-xl border-gray-200 bg-white/80">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 shadow-xl">
                <SelectItem value="all" className="rounded-lg">All Roles</SelectItem>
                <SelectItem value="admin" className="rounded-lg">Admin</SelectItem>
                <SelectItem value="manager" className="rounded-lg">Manager</SelectItem>
                <SelectItem value="member" className="rounded-lg">Member</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 h-10 rounded-xl border-gray-200 bg-white/80">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 shadow-xl">
                <SelectItem value="all" className="rounded-lg">All Status</SelectItem>
                <SelectItem value="active" className="rounded-lg">Active</SelectItem>
                <SelectItem value="banned" className="rounded-lg">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Compact Quick Filters */}
          <div className="mt-3 pt-3 border-t border-gray-200/50">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('all');
                  setStatusFilter('all');
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  !searchTerm && roleFilter === 'all' && statusFilter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('all');
                  setStatusFilter('active');
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  statusFilter === 'active' && !searchTerm && roleFilter === 'all'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('admin');
                  setStatusFilter('all');
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  roleFilter === 'admin' && !searchTerm && statusFilter === 'all'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Admins
              </button>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('all');
                  setStatusFilter('banned');
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  statusFilter === 'banned' && !searchTerm && roleFilter === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Banned
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Users Table */}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200/50 shadow-sm">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/3 to-purple-400/3 rounded-full -translate-y-10 translate-x-10"></div>
        
        <div className="relative">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Users</h3>
                  <p className="text-sm text-gray-500">{filteredUsers.length} total users</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                {filteredUsers.length} users
              </Badge>
            </div>
          </div>

          {/* Professional Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <LoadingSpinner 
                        icon={Users}
                        message="Loading users..."
                        variant="default"
                        size="md"
                      />
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl">
                          <Users className="h-8 w-8 text-emerald-600" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold text-gray-900">No users found</h3>
                          <p className="text-gray-600 text-sm">No users match your current filters</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                  <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    {/* User Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                            <AvatarImage src={generateAvatar(user.name)} alt={user.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-gray-700 font-semibold text-sm">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="ml-4 min-w-0 flex-1">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={cn("inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium", roleConfig[user.role].color)}>
                        {getRoleIcon(user.role)}
                        {roleConfig[user.role].label}
                      </Badge>
                    </td>

                    {/* Status Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={cn("inline-flex items-center px-2.5 py-1 text-xs font-medium", statusConfig[user.status].color)}>
                        {statusConfig[user.status].label}
                      </Badge>
                    </td>

                    {/* Activity Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className={`text-sm font-medium ${user.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                          {user.isOnline ? 'Online' : user.lastSeen}
                        </span>
                      </div>
                    </td>

                    {/* Department Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.department || 'N/A'}
                      </div>
                    </td>

                    {/* Join Date Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(user.joinDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-gray-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl border-0 shadow-xl">
                          <DropdownMenuLabel className="font-semibold text-sm">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedUser(user);
                              setIsRoleDialogOpen(true);
                            }}
                            className="rounded-lg text-sm"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Change Role
                          </DropdownMenuItem>
                          {user.status === 'active' ? (
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(user.id, 'banned')}
                              className="text-red-600 rounded-lg text-sm"
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Ban User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(user.id, 'active')}
                              className="text-green-600 rounded-lg text-sm"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Unban User
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 rounded-lg text-sm"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Remove User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Role Change Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-900">Change User Role</DialogTitle>
            </div>
            <DialogDescription className="text-gray-600 text-base">
              Update the role for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Select New Role</Label>
              <Select 
                defaultValue={selectedUser?.role} 
                onValueChange={(value) => selectedUser && handleRoleChange(selectedUser.id, value)}
              >
                <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-white/80">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-0 shadow-xl">
                  <SelectItem value="member" className="rounded-lg">Member</SelectItem>
                  <SelectItem value="manager" className="rounded-lg">Manager</SelectItem>
                  <SelectItem value="admin" className="rounded-lg">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsRoleDialogOpen(false)}
              className="rounded-xl border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => setIsRoleDialogOpen(false)}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 rounded-xl"
            >
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
