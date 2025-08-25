import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import LifecycleBadge from "@/components/molecules/LifecycleBadge";
import ActionButton from "@/components/molecules/ActionButton";

const ContactsTable = ({ 
  contacts = [], 
  companies = [],
  onContactClick,
  onEditContact,
  onDeleteContact,
  sortField,
  sortDirection,
  onSort,
  selectedContacts = [],
  onContactSelect,
  onSelectAll,
  showBulkActions = false
}) => {
  const getCompanyName = (companyId) => {
const company = companies.find(c => c.Id === companyId);
    return company ? company.Name : "No Company";
  };

  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    onSort(field, direction);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return "ChevronsUpDown";
    return sortDirection === "asc" ? "ChevronUp" : "ChevronDown";
  };

  if (contacts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <ApperIcon name="Users" className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
        <p className="text-gray-500 mb-6">Get started by adding your first contact to the system.</p>
        <ActionButton
          icon="Plus"
          variant="primary"
          onClick={() => onContactClick(null)}
        >
          Add First Contact
        </ActionButton>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
<tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedContacts.length === contacts.length && contacts.length > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
onClick={() => handleSort("first_name_c")}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  <ApperIcon name={getSortIcon("first_name_c")} className="h-4 w-4" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
onClick={() => handleSort("company_id_c")}
              >
                <div className="flex items-center space-x-1">
                  <span>Company</span>
                  <ApperIcon name={getSortIcon("company_id_c")} className="h-4 w-4" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
onClick={() => handleSort("email_c")}
              >
                <div className="flex items-center space-x-1">
                  <span>Email</span>
                  <ApperIcon name={getSortIcon("email_c")} className="h-4 w-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
onClick={() => handleSort("lifecycle_stage_c")}
              >
                <div className="flex items-center space-x-1">
                  <span>Lifecycle Stage</span>
                  <ApperIcon name={getSortIcon("lifecycle_stage_c")} className="h-4 w-4" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
onClick={() => handleSort("created_at_c")}
              >
                <div className="flex items-center space-x-1">
                  <span>Created</span>
                  <ApperIcon name={getSortIcon("created_at_c")} className="h-4 w-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contacts.map((contact) => (
<tr 
                key={contact.Id} 
                className="table-row hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100"
              >
<td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.Id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      onContactSelect(contact.Id, e.target.checked);
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => onContactClick(contact)}>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
{contact.first_name_c?.[0]}{contact.last_name_c?.[0]}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
{contact.first_name_c} {contact.last_name_c}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
{getCompanyName(contact.company_id_c)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
{contact.email_c}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
{contact.phone_c}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
<LifecycleBadge stage={contact.lifecycle_stage_c} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
{format(new Date(contact.created_at_c), "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditContact(contact);
                      }}
                      className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50 transition-colors duration-200"
                    >
                      <ApperIcon name="Edit" className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteContact(contact.Id);
                      }}
                      className="text-error-600 hover:text-error-900 p-1 rounded hover:bg-error-50 transition-colors duration-200"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ContactsTable;