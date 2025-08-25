import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import LifecycleBadge from "@/components/molecules/LifecycleBadge";
const ContactModal = ({ contact, companies = [], activities = [], onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!contact) return null;

const getCompanyName = (companyId) => {
    const company = companies.find(c => c.Id === companyId);
    return company ? company.Name : "No Company";
  };

  const getCompanyDetails = (companyId) => {
    return companies.find(c => c.Id === companyId);
  };

const contactActivities = activities.filter(activity => activity.contact_id_c === contact.Id);

  const tabs = [
    { id: "overview", name: "Overview", icon: "User" },
    { id: "activity", name: "Activity", icon: "Activity" },
    { id: "notes", name: "Notes", icon: "FileText" }
  ];

  const company = getCompanyDetails(contact.companyId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 modal-backdrop"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-white">
{contact.first_name_c?.[0]}{contact.last_name_c?.[0]}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
{contact.first_name_c} {contact.last_name_c}
                </h2>
                <p className="text-gray-600">{getCompanyName(contact.companyId)}</p>
                <div className="mt-2">
<LifecycleBadge stage={contact.lifecycle_stage_c} />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                onClick={() => onEdit(contact)}
              >
                <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
                Edit Contact
              </Button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                <ApperIcon name="X" className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <ApperIcon name={tab.icon} className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-96">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Mail" className="h-4 w-4 text-gray-400" />
<span className="text-sm text-gray-900">{contact.email_c}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Phone" className="h-4 w-4 text-gray-400" />
<span className="text-sm text-gray-900">{contact.phone_c}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Lifecycle Stage</label>
<LifecycleBadge stage={contact.lifecycle_stage_c} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Created</label>
                        <span className="text-sm text-gray-900">
{format(new Date(contact.created_at_c), "MMMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                {company && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
                    <Card className="p-4 bg-gradient-to-r from-gray-50 to-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Company Name</label>
<span className="text-sm text-gray-900">{company.Name}</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Industry</label>
                          <span className="text-sm text-gray-900">{company.industry_c}</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Website</label>
                          <span className="text-sm text-gray-900">{company.website_c}</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Employee Count</label>
                          <span className="text-sm text-gray-900">{company.employee_count_c} employees</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            )}

{activeTab === "activity" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Activity Timeline</h3>
                {contactActivities.length > 0 ? (
                  <div className="space-y-4">
                    {contactActivities
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                      .map((activity, index) => {
                        const getActivityIcon = (type) => {
                          switch (type) {
                            case 'email': return 'Mail';
                            case 'call': return 'Phone';
                            case 'meeting': return 'Calendar';
                            case 'note': return 'FileText';
                            case 'download': return 'Download';
                            case 'referral': return 'Users';
                            case 'support': return 'HelpCircle';
                            case 'training': return 'BookOpen';
                            case 'webinar': return 'Video';
                            default: return 'Activity';
                          }
                        };

                        const getActivityColor = (type) => {
                          switch (type) {
                            case 'email': return 'from-info-400 to-info-500';
                            case 'call': return 'from-success-400 to-success-500';
                            case 'meeting': return 'from-accent-400 to-accent-500';
                            case 'note': return 'from-gray-400 to-gray-500';
                            case 'download': return 'from-warning-400 to-warning-500';
                            case 'referral': return 'from-secondary-400 to-secondary-500';
                            case 'support': return 'from-error-400 to-error-500';
                            case 'training': return 'from-primary-400 to-primary-500';
                            case 'webinar': return 'from-info-400 to-info-500';
                            default: return 'from-gray-400 to-gray-500';
                          }
                        };

                        return (
                          <div key={activity.Id} className="relative">
                            {index < contactActivities.length - 1 && (
                              <div className="absolute left-6 top-12 w-0.5 h-6 bg-gray-200" />
                            )}
                            <Card className="p-4 hover:shadow-md transition-shadow duration-200">
                              <div className="flex items-start space-x-4">
                                <div className={`w-12 h-12 bg-gradient-to-r ${getActivityColor(activity.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                                  <ApperIcon name={getActivityIcon(activity.type)} className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-semibold text-gray-900 capitalize">
{activity.type_c?.replace(/([A-Z])/g, ' $1').trim()}
                                    </h4>
                                    <time className="text-xs text-gray-500 font-medium">
{format(new Date(activity.timestamp_c), "MMM d, yyyy 'at' h:mm a")}
                                    </time>
                                  </div>
<p className="text-sm text-gray-700 leading-relaxed">{activity.description_c}</p>
                                </div>
                              </div>
                            </Card>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <Card className="p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ApperIcon name="Activity" className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Activity Yet</h4>
                    <p className="text-sm text-gray-600 mb-4">Start tracking interactions with this contact to see their activity timeline here.</p>
                    <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                      <span className="px-2 py-1 bg-white rounded-full">Calls</span>
                      <span className="px-2 py-1 bg-white rounded-full">Emails</span>
                      <span className="px-2 py-1 bg-white rounded-full">Meetings</span>
                      <span className="px-2 py-1 bg-white rounded-full">Notes</span>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "notes" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
{contact.notes_c ? (
                  <Card className="p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.notes}</p>
                  </Card>
                ) : (
                  <Card className="p-8 text-center">
                    <ApperIcon name="FileText" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-sm font-medium text-gray-900 mb-2">No notes yet</h4>
                    <p className="text-sm text-gray-500">Add notes to keep track of important information about this contact.</p>
                    <Button
                      variant="secondary"
                      className="mt-4"
                      onClick={() => onEdit(contact)}
                    >
                      Add Notes
                    </Button>
                  </Card>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContactModal;