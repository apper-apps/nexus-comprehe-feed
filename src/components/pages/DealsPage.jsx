import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import DealModal from "@/components/organisms/DealModal";
import DealForm from "@/components/organisms/DealForm";
import ActivityForm from "@/components/organisms/ActivityForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import * as dealService from "@/services/api/dealService";
import * as contactService from "@/services/api/contactService";
import * as companyService from "@/services/api/companyService";
import * as activityService from "@/services/api/activityService";

const DealsPage = ({ onMobileMenuToggle }) => {
const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [selectedDeal, setSelectedDeal] = useState(null);
  const [showDealForm, setShowDealForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [dealsData, contactsData, companiesData, activitiesData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        companyService.getAll(),
        activityService.getAll()
      ]);

      setDeals(dealsData);
      setContacts(contactsData);
      setCompanies(companiesData);
      setActivities(activitiesData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
      toast.error('Failed to load deals data');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const dealId = parseInt(draggableId);
    const newStage = destination.droppableId;

    // Find the deal and check if stage actually changed
    const deal = deals.find(d => d.Id === dealId);
    if (!deal || deal.stage === newStage) return;

    try {
      // Optimistically update UI
      setDeals(prevDeals =>
        prevDeals.map(d =>
          d.Id === dealId ? { ...d, stage: newStage } : d
        )
      );

      // Update on server
      await dealService.updateStage(dealId, newStage);
      toast.success(`Deal moved to ${newStage}`);
    } catch (error) {
      console.error('Error updating deal stage:', error);
      toast.error('Failed to update deal stage');
      // Revert optimistic update
      loadData();
    }
  };

  const handleDealClick = (deal) => {
    setSelectedDeal(deal);
  };

  const handleCreateDeal = () => {
    setEditingDeal(null);
    setShowDealForm(true);
  };

  const handleEditDeal = (deal) => {
    setEditingDeal(deal);
    setSelectedDeal(null);
    setShowDealForm(true);
  };

  const handleSaveDeal = async (formData) => {
    try {
      setFormLoading(true);
      
      let savedDeal;
      if (editingDeal) {
        savedDeal = await dealService.update(editingDeal.Id, formData);
        setDeals(prevDeals =>
          prevDeals.map(d => d.Id === editingDeal.Id ? savedDeal : d)
        );
        toast.success('Deal updated successfully');
      } else {
        savedDeal = await dealService.create(formData);
        setDeals(prevDeals => [...prevDeals, savedDeal]);
        toast.success('Deal created successfully');
      }

      setShowDealForm(false);
      setEditingDeal(null);
    } catch (error) {
      console.error('Error saving deal:', error);
      toast.error('Failed to save deal');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteDeal = async (dealId) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return;

    try {
      await dealService.delete_(dealId);
      setDeals(prevDeals => prevDeals.filter(d => d.Id !== dealId));
      setSelectedDeal(null);
      toast.success('Deal deleted successfully');
    } catch (error) {
      console.error('Error deleting deal:', error);
      toast.error('Failed to delete deal');
    }
  };
function handleCreateActivity(dealId = null) {
    setEditingActivity(null);
    setShowActivityForm(true);
    if (dealId) {
      setSelectedDeal(deals.find(d => d.Id === dealId));
    }
  }

  function handleEditActivity(activity) {
    setEditingActivity(activity);
    setShowActivityForm(true);
  }

  async function handleSaveActivity(formData) {
    setFormLoading(true);
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
    } finally {
      setFormLoading(false);
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
  const getContactById = (contactId) => {
    return contacts.find(contact => contact.Id === contactId);
  };

  const getCompanyById = (companyId) => {
    return companies.find(company => company.Id === companyId);
  };

  if (loading) return <Loading type="deals" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="flex-1 flex flex-col">
      <Header 
        title="Deals" 
        onMobileMenuToggle={onMobileMenuToggle}
        showSearch={false}
      />

      <div className="flex-1 p-6">
        <KanbanBoard
          deals={deals}
          contacts={contacts}
          companies={companies}
          onDealClick={handleDealClick}
          onDragEnd={handleDragEnd}
          onCreateDeal={handleCreateDeal}
        />
      </div>

{selectedDeal && (
<DealModal
          deal={selectedDeal}
          contact={getContactById(selectedDeal.contactId)}
          company={getCompanyById(selectedDeal.companyId)}
          activities={activities}
          onClose={() => setSelectedDeal(null)}
          onEdit={() => handleEditDeal(selectedDeal)}
          onDelete={handleDeleteDeal}
          onCreateActivity={() => handleCreateActivity(selectedDeal.Id)}
          onEditActivity={handleEditActivity}
          onDeleteActivity={handleDeleteActivity}
        />
      )}

      {showDealForm && (
        <DealForm
          deal={editingDeal}
          contacts={contacts}
          companies={companies}
          onSave={handleSaveDeal}
          onCancel={() => {
            setShowDealForm(false);
            setEditingDeal(null);
          }}
          loading={formLoading}
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
          loading={formLoading}
          preselectedDealId={selectedDeal?.Id}
        />
      )}
    </div>
  );
};

export default DealsPage;