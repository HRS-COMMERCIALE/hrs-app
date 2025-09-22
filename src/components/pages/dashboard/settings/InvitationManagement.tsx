'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Copy, 
  MoreHorizontal, 
  Ban, 
  XCircle, 
  CheckCircle,
  Clock,
  Users,
  RefreshCw,
  Filter,
  Search,
  Calendar,
  Shield,
  Crown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { cn } from '@/lib/utils';

interface Invitation {
  id: string;
  invitationCode: string;
  role: string;
  status: string;
  isUsed: boolean;
  usedAt: string | null;
  expiredAt: string;
  createdAt: string;
  inviter: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  usedByUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  businessUser: {
    id: string;
    role: string;
    businessId: number;
  };
  inviteUrl: string;
  isExpired: boolean;
}

interface InvitationManagementProps {
  isOpen: boolean;
  onClose: () => void;
  businessId?: number;
}

export default function InvitationManagement({ isOpen, onClose, businessId = 1 }: InvitationManagementProps) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(false);
  const [invitationStatusFilter, setInvitationStatusFilter] = useState<string>('all');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [invitationCode, setInvitationCode] = useState<string>('');
  const [inviteRole, setInviteRole] = useState<string>('member');
  const [isGeneratingInvite, setIsGeneratingInvite] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(4);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  // Filter invitations based on search and status
  const filteredInvitations = invitations.filter(invitation => {
    const matchesSearch = invitation.invitationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invitation.inviter.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invitation.inviter.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = invitationStatusFilter === 'all' || invitation.status === invitationStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const generateInviteCode = async (role: string = 'member') => {
    try {
      const response = await fetch('/api/dashboard/settings/invitation/inviteUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role,
          businessUserId: businessId,
          expiresInDays: 1
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate invitation');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating invitation:', error);
      throw error;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Simple visual feedback - you could replace this with a proper toast library
    const button = document.activeElement as HTMLElement;
    if (button) {
      const originalText = button.innerHTML;
      button.innerHTML = '<CheckCircle className="h-2.5 w-2.5" />';
      button.style.color = '#10b981';
      setTimeout(() => {
        button.innerHTML = originalText;
        button.style.color = '';
      }, 2000);
    }
  };

  const fetchInvitations = async (page: number = currentPage) => {
    setIsLoadingInvitations(true);
    try {
      const response = await fetch(`/api/dashboard/settings/invitation/getInvitations?businessId=${businessId}&status=${invitationStatusFilter}&page=${page}&limit=${itemsPerPage}`);
      if (response.ok) {
        const data = await response.json();
        setInvitations(data.invitations);
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.totalItems);
        setHasNextPage(data.pagination.hasNextPage);
        setHasPrevPage(data.pagination.hasPrevPage);
        setCurrentPage(data.pagination.currentPage);
      }
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setIsLoadingInvitations(false);
    }
  };

  const updateInvitation = async (invitationId: string, action: string) => {
    try {
      const response = await fetch('/api/dashboard/settings/invitation/UpdateInvitations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitationId,
          action
        }),
      });

      if (response.ok) {
        await fetchInvitations(); // Refresh the list
      } else {
        const errorData = await response.json();
        console.error('Error updating invitation:', errorData.error);
      }
    } catch (error) {
      console.error('Error updating invitation:', error);
    }
  };

  const deleteInvitation = async (invitationId: string) => {
    try {
      const response = await fetch(`/api/dashboard/settings/invitation/deleteInvitation?id=${invitationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchInvitations(); // Refresh the list
      } else {
        const errorData = await response.json();
        console.error('Error deleting invitation:', errorData.error);
      }
    } catch (error) {
      console.error('Error deleting invitation:', error);
    }
  };

  const handleGenerateInvite = async () => {
    setIsGeneratingInvite(true);
    try {
      const invitation = await generateInviteCode(inviteRole);
      setInvitationCode(invitation.inviteUrl);
      // Refresh the invitations list to show the new invitation
      await fetchInvitations();
    } catch (error) {
      console.error('Error generating invitation:', error);
    } finally {
      setIsGeneratingInvite(false);
    }
  };

  const resetInviteDialog = () => {
    setInvitationCode('');
    setInviteRole('member');
    setIsInviteDialogOpen(false);
    // Always refresh invitations list when dialog closes
    fetchInvitations();
  };

  // Ensure the invite dialog always starts in default state when opened
  useEffect(() => {
    if (isInviteDialogOpen) {
      setInvitationCode('');
      setInviteRole('member');
    }
  }, [isInviteDialogOpen]);

  // Load invitations on component mount and when filter changes
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1); // Reset to first page when filter changes
      fetchInvitations(1);
    }
  }, [invitationStatusFilter, isOpen]);

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchInvitations(page);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    return role === 'manager' ? <Shield className="h-3 w-3" /> : <Users className="h-3 w-3" />;
  };

  return (
    <>
      {/* Main Invitation Management Dialog */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="!max-w-[65vw] !w-[65vw] h-[85vh] bg-white border-0 shadow-2xl overflow-hidden p-0 flex flex-col" style={{ maxWidth: '65vw', width: '65vw' }}>
          {/* Enhanced Header Section */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 text-white relative overflow-hidden flex-shrink-0">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <UserPlus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-white mb-1">Invitation Management</DialogTitle>
                    <DialogDescription className="text-emerald-100 text-base">
                      Generate, manage, and track invitation links for your organization
                    </DialogDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 flex-wrap">
                  <Button 
                    onClick={() => setIsInviteDialogOpen(true)}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl px-4 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Generate Invitation
                  </Button>
                  
                  <Select value={invitationStatusFilter} onValueChange={setInvitationStatusFilter}>
                    <SelectTrigger className="w-36 h-10 rounded-xl border-white/30 bg-white/20 text-white backdrop-blur-sm">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-0 shadow-xl bg-white">
                      <SelectItem value="all" className="rounded-lg">All Status</SelectItem>
                      <SelectItem value="pending" className="rounded-lg">Pending</SelectItem>
                      <SelectItem value="accepted" className="rounded-lg">Accepted</SelectItem>
                      <SelectItem value="expired" className="rounded-lg">Expired</SelectItem>
                      <SelectItem value="cancelled" className="rounded-lg">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fetchInvitations()}
                    disabled={isLoadingInvitations}
                    className="h-10 px-4 rounded-xl border-white/30 bg-white/20 hover:bg-white/30 text-white font-semibold"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingInvitations ? 'animate-spin' : ''}`} />
                    {isLoadingInvitations ? 'Loading...' : 'Refresh'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Stats Section */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Search className="h-4 w-4 text-gray-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">Search Invitations</h3>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                  {totalItems} total
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                  {invitations.filter(inv => inv.status === 'pending').length} pending
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                  Page {currentPage} of {totalPages}
                </Badge>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by invitation code or inviter name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 rounded-xl border-gray-200 bg-white/80 focus:bg-white focus:border-emerald-300 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircle className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Compact Invitations Table */}
          <div className="flex-1 overflow-auto bg-white min-h-0">
            <table className="w-full table-fixed text-xs">
              <thead className="sticky top-0 bg-gray-50 z-10 border-b border-gray-200">
                <tr>
                  <th className="w-[120px] px-2 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Code</th>
                  <th className="w-[100px] px-1 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Role</th>
                  <th className="w-[50px] px-1 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                  <th className="w-[60px] px-1 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Created</th>
                  <th className="w-[60px] px-1 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Expires</th>
                  <th className="w-[140px] px-1 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Invited By</th>
                  <th className="w-[100px] px-1 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Used By</th>
                  <th className="w-[40px] px-1 py-2 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredInvitations.map((invitation, index) => (
                  <tr key={invitation.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    {/* Invitation Code */}
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-1">
                        <code className="text-xs font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-700 truncate flex-1">
                          {invitation.invitationCode.substring(0, 8)}...
                        </code>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(invitation.inviteUrl)}
                          className="h-5 w-5 p-0 hover:bg-gray-200"
                        >
                          <Copy className="h-2.5 w-2.5" />
                        </Button>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-1 py-2">
                      <Badge className={cn("text-xs px-2 py-1", 
                        invitation.role === 'manager' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      )}>
                        {invitation.role === 'manager' ? 'Manager' : 'Member'}
                      </Badge>
                    </td>

                    {/* Status */}
                    <td className="px-1 py-2">
                      <Badge className={cn("text-xs px-1.5 py-0.5", getStatusColor(invitation.status))}>
                        {invitation.status === 'pending' ? 'Pend' :
                         invitation.status === 'accepted' ? 'Acc' :
                         invitation.status === 'expired' ? 'Exp' : 'Can'}
                      </Badge>
                    </td>

                    {/* Created */}
                    <td className="px-1 py-2">
                      <div className="text-xs text-gray-600 truncate">
                        {new Date(invitation.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </div>
                    </td>

                    {/* Expires */}
                    <td className="px-1 py-2">
                      <div className={`text-xs truncate ${invitation.isExpired ? 'text-red-600' : 'text-gray-600'}`}>
                        {new Date(invitation.expiredAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </div>
                    </td>

                    {/* Invited By */}
                    <td className="px-1 py-2">
                      <div className="text-xs text-gray-700 truncate">
                        {invitation.inviter.firstName} {invitation.inviter.lastName}
                      </div>
                    </td>

                    {/* Used By */}
                    <td className="px-1 py-2">
                      <div className="text-xs text-gray-700 truncate">
                        {invitation.usedByUser ? 
                          `${invitation.usedByUser.firstName} ${invitation.usedByUser.lastName}` : 
                          invitation.isUsed ? 'Unknown' : '-'
                        }
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-1 py-2 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-200">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-lg border-0 shadow-lg">
                          <DropdownMenuLabel className="text-xs font-semibold">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => copyToClipboard(invitation.inviteUrl)}
                            className="text-xs"
                          >
                            <Copy className="h-3 w-3 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                          {invitation.status === 'pending' && (
                            <DropdownMenuItem 
                              onClick={() => updateInvitation(invitation.id, 'cancel')}
                              className="text-orange-600 text-xs"
                            >
                              <XCircle className="h-3 w-3 mr-2" />
                              Cancel
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => updateInvitation(invitation.id, 'expire')}
                            className="text-red-600 text-xs"
                          >
                            <Ban className="h-3 w-3 mr-2" />
                            Expire
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => deleteInvitation(invitation.id)}
                            className="text-red-600 text-xs"
                          >
                            <XCircle className="h-3 w-3 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {isLoadingInvitations && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <LoadingSpinner 
                        icon={UserPlus}
                        message="Loading invitations..."
                        variant="default"
                        size="md"
                      />
                    </td>
                  </tr>
                )}
                {filteredInvitations.length === 0 && !isLoadingInvitations && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl">
                          <UserPlus className="h-8 w-8 text-emerald-600" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold text-gray-900">No invitations found</h3>
                          <p className="text-gray-600 text-sm">Create your first invitation to get started</p>
                        </div>
                        <Button 
                          onClick={() => setIsInviteDialogOpen(true)}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2 rounded-lg font-semibold text-sm"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Generate Invitation
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls - Always show for debugging */}
          {totalItems > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} invitations</span>
                  <span className="text-xs text-gray-400">(Page {currentPage} of {totalPages})</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!hasPrevPage || isLoadingInvitations}
                    className="h-8 px-3 rounded-lg"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {totalPages <= 5 ? (
                      // Show all pages if 5 or fewer
                      Array.from({ length: totalPages }, (_, i) => {
                        const pageNum = i + 1;
                        const isActive = pageNum === currentPage;
                        return (
                          <Button
                            key={pageNum}
                            variant={isActive ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            disabled={isLoadingInvitations}
                            className={`h-8 w-8 p-0 rounded-lg ${
                              isActive 
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </Button>
                        );
                      })
                    ) : (
                      // Show first few pages, ellipsis, and last page
                      <>
                        {Array.from({ length: 3 }, (_, i) => {
                          const pageNum = i + 1;
                          const isActive = pageNum === currentPage;
                          return (
                            <Button
                              key={pageNum}
                              variant={isActive ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              disabled={isLoadingInvitations}
                              className={`h-8 w-8 p-0 rounded-lg ${
                                isActive 
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                                  : 'hover:bg-gray-100'
                              }`}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                        <span className="text-gray-400 px-2">...</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
                          disabled={isLoadingInvitations}
                          className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasNextPage || isLoadingInvitations}
                    className="h-8 px-3 rounded-lg"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Enhanced Invitation Generation Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl">
                <UserPlus className="h-8 w-8 text-emerald-600" />
              </div>
              <DialogTitle className="text-3xl font-bold text-gray-900">Generate Invitation Link</DialogTitle>
            </div>
            <DialogDescription className="text-gray-600 text-lg">
              Create an invitation link to add new users to your organization.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-8 py-6">
            {!invitationCode ? (
              <>
                <div className="space-y-4">
                  <Label htmlFor="invite-role" className="text-lg font-bold text-gray-700">Default Role</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger className="h-14 rounded-xl border-gray-200 bg-white/80 text-lg">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-0 shadow-xl">
                      <SelectItem value="member" className="rounded-lg text-lg">Member</SelectItem>
                      <SelectItem value="manager" className="rounded-lg text-lg">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                    <span className="font-bold text-emerald-800 text-xl">Invitation Link Generated!</span>
                  </div>
                  <p className="text-lg text-emerald-700">Share this link with the person you want to invite:</p>
                </div>
                
                <div className="space-y-4">
                  <Label className="text-lg font-bold text-gray-700">Invitation Link</Label>
                  <div className="flex gap-3">
                    <Input 
                      value={invitationCode} 
                      readOnly 
                      className="font-mono text-lg h-14 rounded-xl border-gray-200 bg-gray-50"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-14 w-14 rounded-xl border-gray-200 hover:bg-emerald-50 hover:border-emerald-300"
                      onClick={() => copyToClipboard(invitationCode)}
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 text-center">User can click this link to join directly</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-4">
            {!invitationCode ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={resetInviteDialog}
                  className="rounded-xl border-gray-200 hover:bg-gray-50 h-12 px-8 text-lg font-semibold"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleGenerateInvite}
                  disabled={isGeneratingInvite}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl h-12 px-8 text-lg font-semibold"
                >
                  {isGeneratingInvite ? 'Generating...' : 'Generate Link'}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={resetInviteDialog}
                  className="rounded-xl border-gray-200 hover:bg-gray-50 h-12 px-8 text-lg font-semibold"
                >
                  Close
                </Button>
                <Button 
                  onClick={() => copyToClipboard(invitationCode)}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl h-12 px-8 text-lg font-semibold"
                >
                  Copy Link
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}