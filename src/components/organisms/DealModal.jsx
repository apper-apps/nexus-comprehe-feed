import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import CommentSystem from "@/components/organisms/CommentSystem";
const DealModal = ({ 
  deal, 
  contact, 
  company, 
  activities = [], 
  onClose, 
  onEdit, 
  onDelete 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Prospect': return 'text-gray-600 bg-gray-100';
      case 'Qualified': return 'text-info-600 bg-info-100';
      case 'Proposal': return 'text-warning-600 bg-warning-100';
      case 'Negotiation': return 'text-accent-600 bg-accent-100';
      case 'Closed Won': return 'text-success-600 bg-success-100';
      case 'Closed Lost': return 'text-error-600 bg-error-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return 'text-success-600';
    if (probability >= 60) return 'text-warning-600';
    if (probability >= 40) return 'text-info-600';
    return 'text-error-600';
  };

  const tabs = [
    { id: 'overview', name: 'Deal Info', icon: 'FileText' },
    { id: 'activity', name: 'Activities', icon: 'Activity' },
{ id: 'notes', name: 'Notes', icon: 'StickyNote' },
    { id: 'comments', name: 'Comments', icon: 'MessageSquare' }
  ];

  const dealActivities = activities.filter(activity => activity.dealId === deal.Id);

  if (!deal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{deal.name}</h1>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(deal.stage)}`}>
                  {deal.stage}
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ApperIcon name="DollarSign" className="h-4 w-4" />
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(deal.value)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="TrendingUp" className="h-4 w-4" />
                  <span className={`font-semibold ${getProbabilityColor(deal.probability)}`}>
                    {deal.probability}% probability
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Calendar" className="h-4 w-4" />
                  <span>Due {format(new Date(deal.expectedCloseDate), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={onEdit}>
                <ApperIcon name="Edit" className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="ghost" onClick={onClose}>
                <ApperIcon name="X" className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ApperIcon name={tab.icon} className="h-4 w-4" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Deal Name</label>
                      <p className="mt-1 text-sm text-gray-900">{deal.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Value</label>
                      <p className="mt-1 text-sm text-gray-900">{formatCurrency(deal.value)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Probability</label>
                      <p className="mt-1 text-sm text-gray-900">{deal.probability}%</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Stage</label>
                      <p className="mt-1 text-sm text-gray-900">{deal.stage}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Expected Close Date</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {format(new Date(deal.expectedCloseDate), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    {contact && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Primary Contact</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {contact.firstName} {contact.lastName}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="mt-1 text-sm text-gray-900">{contact.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Phone</label>
                          <p className="mt-1 text-sm text-gray-900">{contact.phone}</p>
                        </div>
                      </>
                    )}
                    {company && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Company</label>
                          <p className="mt-1 text-sm text-gray-900">{company.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Industry</label>
                          <p className="mt-1 text-sm text-gray-900">{company.industry}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Employees</label>
                          <p className="mt-1 text-sm text-gray-900">{company.employeeCount}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {deal.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{deal.description}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Created {format(new Date(deal.createdAt), 'MMM dd, yyyy')} • 
                  Updated {format(new Date(deal.updatedAt), 'MMM dd, yyyy')}
                </div>
                <Button
                  variant="outline"
                  className="text-error-600 border-error-300 hover:bg-error-50"
                  onClick={() => onDelete(deal.Id)}
                >
                  <ApperIcon name="Trash2" className="h-4 w-4" />
                  Delete Deal
                </Button>
              </div>
            </div>
          )}

{activeTab === 'activity' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Activity Timeline</h3>
              {dealActivities.length > 0 ? (
                <div className="space-y-4">
                  {dealActivities
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map((activity, index) => {
                      const getActivityIcon = (type) => {
                        switch (type) {
                          case 'email': return 'Mail';
                          case 'call': return 'Phone';
                          case 'meeting': return 'Calendar';
                          case 'note': return 'FileText';
                          case 'proposal': return 'FileText';
                          case 'contract': return 'File';
                          case 'negotiation': return 'MessageSquare';
                          case 'demo': return 'Play';
                          case 'followup': return 'RefreshCw';
                          default: return 'Activity';
                        }
                      };

                      const getActivityColor = (type) => {
                        switch (type) {
                          case 'email': return 'from-info-400 to-info-500';
                          case 'call': return 'from-success-400 to-success-500';
                          case 'meeting': return 'from-accent-400 to-accent-500';
                          case 'note': return 'from-gray-400 to-gray-500';
                          case 'proposal': return 'from-warning-400 to-warning-500';
                          case 'contract': return 'from-primary-400 to-primary-500';
                          case 'negotiation': return 'from-secondary-400 to-secondary-500';
                          case 'demo': return 'from-accent-400 to-accent-500';
                          case 'followup': return 'from-info-400 to-info-500';
                          default: return 'from-gray-400 to-gray-500';
                        }
                      };

                      return (
                        <div key={activity.Id} className="relative">
                          {index < dealActivities.length - 1 && (
                            <div className="absolute left-6 top-14 w-0.5 h-6 bg-gray-200" />
                          )}
                          <Card className="p-5 hover:shadow-lg transition-all duration-200">
                            <div className="flex items-start space-x-4">
                              <div className={`w-12 h-12 bg-gradient-to-r ${getActivityColor(activity.type)} rounded-full flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                <ApperIcon name={getActivityIcon(activity.type)} className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-base font-semibold text-gray-900 capitalize">
                                    {activity.type.replace(/([A-Z])/g, ' $1').trim()}
                                  </h4>
                                  <time className="text-sm text-gray-500 font-medium">
                                    {format(new Date(activity.timestamp), "MMM d, yyyy 'at' h:mm a")}
                                  </time>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">{activity.description}</p>
                              </div>
                            </div>
                          </Card>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <Card className="p-10 text-center bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ApperIcon name="Activity" className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">No Deal Activity Yet</h4>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Track calls, meetings, emails, and other interactions related to this deal to build a comprehensive activity timeline.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
                    <span className="px-3 py-2 bg-white rounded-lg shadow-sm">Calls</span>
                    <span className="px-3 py-2 bg-white rounded-lg shadow-sm">Meetings</span>
                    <span className="px-3 py-2 bg-white rounded-lg shadow-sm">Proposals</span>
                    <span className="px-3 py-2 bg-white rounded-lg shadow-sm">Negotiations</span>
                  </div>
                </Card>
              )}
            </div>
          )}

{activeTab === 'notes' && (
            <div>
              <CommentSystem dealId={deal.Id} />
            </div>
          )}

          {activeTab === 'comments' && (
            <div>
              <CommentSystem dealId={deal.Id} />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DealModal;