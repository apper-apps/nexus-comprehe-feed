import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ActivityForm from "@/components/organisms/ActivityForm";
import * as contactService from "@/services/api/contactService";
import * as companyService from "@/services/api/companyService";
import * as dealService from "@/services/api/dealService";
import * as activityService from "@/services/api/activityService";
import ActionButton from "@/components/molecules/ActionButton";
import ContactFilters from "@/components/organisms/ContactFilters";
import ContactsTable from "@/components/organisms/ContactsTable";
import Header from "@/components/organisms/Header";
import ContactForm from "@/components/organisms/ContactForm";
import ContactModal from "@/components/organisms/ContactModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
const ContactsPage = ({ onMobileMenuToggle }) => {
const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    lifecycleStage: "",
    companyId: ""
  });

  // Sorting states
  const [sortField, setSortField] = useState("first_name_c");
  const [sortDirection, setSortDirection] = useState("asc");

  // Bulk selection states
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  // Load data
  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [contactsData, companiesData, activitiesData] = await Promise.all([
        contactService.getAll(),
        companyService.getAll(),
        activityService.getAll()
      ]);
      
      setContacts(contactsData);
      setCompanies(companiesData);
      setActivities(activitiesData);
    } catch (err) {
      setError("Failed to load contacts. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter and search logic
useEffect(() => {
    let filtered = [...contacts];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(contact => 
        `${contact.first_name_c} ${contact.last_name_c}`.toLowerCase().includes(query) ||
        contact.email_c?.toLowerCase().includes(query) ||
        contact.phone_c?.includes(query)
      );
    }

    // Apply lifecycle stage filter
    if (filters.lifecycleStage) {
      filtered = filtered.filter(contact => contact.lifecycle_stage_c === filters.lifecycleStage);
    }

    // Apply company filter
    if (filters.companyId) {
      filtered = filtered.filter(contact => contact.company_id_c === parseInt(filters.companyId));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "company_id_c") {
        const aCompany = companies.find(c => c.Id === a.company_id_c)?.Name || "";
        const bCompany = companies.find(c => c.Id === b.company_id_c)?.Name || "";
        aValue = aCompany.toLowerCase();
        bValue = bCompany.toLowerCase();
      } else if (sortField === "first_name_c") {
        aValue = `${a.first_name_c} ${a.last_name_c}`.toLowerCase();
        bValue = `${b.first_name_c} ${b.last_name_c}`.toLowerCase();
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredContacts(filtered);
  }, [contacts, searchQuery, filters, sortField, sortDirection, companies]);

  // Event handlers
const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      lifecycleStage: "",
      companyId: ""
    });
    setSearchQuery("");
  };

  const handleSort = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
  };

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setShowContactModal(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowContactForm(true);
    setShowContactModal(false);
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      await contactService.delete(contactId);
      setContacts(contacts.filter(c => c.Id !== contactId));
      toast.success("Contact deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete contact. Please try again.");
    }
  };

const handleSaveContact = async (formData) => {
    try {
      let updatedContact;

      if (editingContact) {
        updatedContact = await contactService.update(editingContact.Id, formData);
        setContacts(contacts.map(c => c.Id === editingContact.Id ? updatedContact : c));
      } else {
        updatedContact = await contactService.create(formData);
        setContacts([...contacts, updatedContact]);
      }

      setShowContactForm(false);
      setEditingContact(null);
    } catch (error) {
      throw error;
    }
  };

  const handleCreateContact = () => {
    setEditingContact(null);
    setShowContactForm(true);
  };

  // Bulk selection handlers
  const handleContactSelect = (contactId, isSelected) => {
    setSelectedContacts(prev => {
      const newSelection = isSelected 
        ? [...prev, contactId]
        : prev.filter(id => id !== contactId);
      
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleSelectAll = (selectAll) => {
    if (selectAll) {
      const allContactIds = filteredContacts.map(contact => contact.Id);
      setSelectedContacts(allContactIds);
      setShowBulkActions(true);
    } else {
      setSelectedContacts([]);
      setShowBulkActions(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedContacts.length} contacts? This action cannot be undone.`)) {
      return;
    }

    try {
      await contactService.bulkDelete(selectedContacts);
      setContacts(contacts.filter(c => !selectedContacts.includes(c.Id)));
      setSelectedContacts([]);
      setShowBulkActions(false);
      toast.success(`${selectedContacts.length} contacts deleted successfully!`);
    } catch (error) {
      toast.error("Failed to delete contacts. Please try again.");
    }
  };

  const handleBulkLifecycleUpdate = async (lifecycleStage) => {
    if (!lifecycleStage) return;

    if (!window.confirm(`Are you sure you want to update ${selectedContacts.length} contacts to "${lifecycleStage}" stage?`)) {
      return;
    }

    try {
const updatedContacts = await contactService.bulkUpdateLifecycleStage(selectedContacts, lifecycleStage);
      setContacts(contacts.map(contact => {
        const updated = updatedContacts.find(uc => uc.Id === contact.Id);
        return updated || contact;
      }));
      setSelectedContacts([]);
      setShowBulkActions(false);
      toast.success(`${selectedContacts.length} contacts updated to "${lifecycleStage}" stage!`);
    } catch (error) {
      toast.error("Failed to update contacts. Please try again.");
    }
};

  function handleCreateActivity(contactId = null) {
    setEditingActivity(null);
    setShowActivityForm(true);
    if (contactId) {
      setSelectedContact(contacts.find(c => c.Id === contactId));
    }
  }

  function handleEditActivity(activity) {
    setEditingActivity(activity);
    setShowActivityForm(true);
  }

  async function handleSaveActivity(formData) {
    try {
      let savedActivity;
      if (editingActivity) {
        savedActivity = await activityService.update(editingActivity.Id, formData);
        setActivities(prev => prev.map(a => a.Id === editingActivity.Id ? savedActivity : a));
        toast.success("Activity updated successfully");
      } else {
        savedActivity = await activityService.create(formData);
        setActivities(prev => [...prev, savedActivity]);
        toast.success("Activity created successfully");
      }
      setShowActivityForm(false);
      setEditingActivity(null);
    } catch (error) {
      console.error("Error saving activity:", error);
      toast.error(`Failed to ${editingActivity ? 'update' : 'create'} activity`);
    }
  }

  async function handleDeleteActivity(activityId) {
    try {
      await activityService.delete_(activityId);
      setActivities(prev => prev.filter(a => a.Id !== activityId));
      toast.success("Activity deleted successfully");
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error("Failed to delete activity");
    }
  }
  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <Header 
          title="Contacts" 
          onMobileMenuToggle={onMobileMenuToggle}
          showSearch={false}
        />
        <div className="flex-1 p-6">
          <Loading type="table" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col">
        <Header 
          title="Contacts" 
          onMobileMenuToggle={onMobileMenuToggle}
          showSearch={false}
        />
        <div className="flex-1 p-6">
          <Error 
            title="Failed to load contacts"
            message={error}
            onRetry={loadData}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header 
        title="Contacts" 
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        onMobileMenuToggle={onMobileMenuToggle}
      >
        <ActionButton
          icon="Plus"
          variant="primary"
          onClick={handleCreateContact}
        >
          Add Contact
        </ActionButton>
      </Header>

      <div className="flex-1 p-6 space-y-6">
        {/* Filters */}
        <ContactFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          companies={companies}
        />

        {/* Results Summary */}
<div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredContacts.length} of {contacts.length} contacts
            {selectedContacts.length > 0 && (
              <span className="ml-2 font-medium text-primary-600">
                ({selectedContacts.length} selected)
              </span>
            )}
          </p>
          
          {showBulkActions && (
            <div className="flex items-center space-x-3 bg-primary-50 border border-primary-200 rounded-lg px-4 py-2">
              <span className="text-sm font-medium text-primary-700">
                {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} selected
              </span>
              
              <div className="flex items-center space-x-2">
                <select
                  onChange={(e) => handleBulkLifecycleUpdate(e.target.value)}
                  className="text-xs px-2 py-1 border border-primary-300 rounded focus:ring-primary-500 focus:border-primary-500"
                  defaultValue=""
                >
                  <option value="">Update Stage</option>
                  <option value="lead">Lead</option>
                  <option value="prospect">Prospect</option>
                  <option value="customer">Customer</option>
                  <option value="evangelist">Evangelist</option>
                </select>
                
                <ActionButton
                  icon="Trash2"
                  variant="danger"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  Delete
                </ActionButton>
                
                <ActionButton
                  icon="X"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedContacts([]);
                    setShowBulkActions(false);
                  }}
                >
                  Cancel
                </ActionButton>
              </div>
            </div>
          )}
        </div>
        {/* Content */}
        {filteredContacts.length === 0 && !searchQuery && Object.values(filters).every(f => !f) ? (
          <Empty
            title="No contacts yet"
            message="Get started by adding your first contact to the system."
            actionLabel="Add First Contact"
            onAction={handleCreateContact}
            icon="Users"
          />
        ) : filteredContacts.length === 0 ? (
          <Empty
            title="No contacts found"
            message="Try adjusting your search criteria or filters."
            actionLabel="Clear Filters"
            onAction={handleClearFilters}
            icon="Search"
          />
        ) : (
<ContactsTable
            contacts={filteredContacts}
            companies={companies}
            onContactClick={handleContactClick}
            onEditContact={handleEditContact}
            onDeleteContact={handleDeleteContact}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            selectedContacts={selectedContacts}
            onContactSelect={handleContactSelect}
            onSelectAll={handleSelectAll}
            showBulkActions={showBulkActions}
          />
        )}
      </div>

      {/* Modals */}
      {showContactModal && selectedContact && (
<ContactModal
          contact={selectedContact}
          companies={companies}
          activities={activities}
          onClose={() => {
            setShowContactModal(false);
            setSelectedContact(null);
          }}
          onEdit={handleEditContact}
          onCreateActivity={() => handleCreateActivity(selectedContact.Id)}
          onEditActivity={handleEditActivity}
          onDeleteActivity={handleDeleteActivity}
        />
      )}

      {showContactForm && (
        <ContactForm
          contact={editingContact}
          companies={companies}
          onSave={handleSaveContact}
          onClose={() => {
            setShowContactForm(false);
            setEditingContact(null);
          }}
/>
      )}

      {showActivityForm && (
        <ActivityForm
          activity={editingActivity}
          contacts={contacts}
          deals={deals}
          onSave={handleSaveActivity}
          onCancel={() => {
            setShowActivityForm(false);
            setEditingActivity(null);
          }}
          preselectedContactId={selectedContact?.Id}
        />
      )}
    </div>
  );
};

export default ContactsPage;