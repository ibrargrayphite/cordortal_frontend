import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import theme from '../../styles/adminTheme.module.css';

const LeadModal = ({ 
  show, 
  onHide, 
  mode, 
  lead, 
  formData, 
  onFormChange, 
  onSave, 
  saving 
}) => {
  const isEdit = mode === 'edit';
  const title = isEdit ? 'Edit Lead' : 'Add New Lead';

  return (
    <Dialog open={show} onOpenChange={onHide}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-gray-200">
          <DialogTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-user-plus text-blue-600"></i>
            </div>
            {title}
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-2">
            {isEdit ? 'Update lead information below' : 'Fill in the details to create a new lead'}
          </p>
        </DialogHeader>
        
        <div className="py-6">
          {/* Personal Information Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <i className="fas fa-user text-gray-500"></i>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => onFormChange("first_name", e.target.value)}
                  placeholder="Enter first name"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => onFormChange("last_name", e.target.value)}
                  placeholder="Enter last name"
                  className="h-11"
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <i className="fas fa-address-book text-gray-500"></i>
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => onFormChange("email", e.target.value)}
                  placeholder="Enter email address"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => onFormChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                  className="h-11"
                />
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <i className="fas fa-info-circle text-gray-500"></i>
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="source" className="text-sm font-medium text-gray-700">
                  Lead Source
                </Label>
                <Select value={formData.source} onValueChange={(value) => onFormChange("source", value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select lead source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WEBSITE">Website</SelectItem>
                    <SelectItem value="GMAIL">Gmail</SelectItem>
                    <SelectItem value="REFERRAL">Referral</SelectItem>
                    <SelectItem value="SOCIAL_MEDIA">Social Media</SelectItem>
                    <SelectItem value="PHONE">Phone Call</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                  Message/Notes
                </Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => onFormChange("message", e.target.value)}
                  placeholder="Enter any additional message or notes..."
                  className="resize-none"
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="pt-6 border-t border-gray-200 bg-gray-50 -mx-6 -mb-6 px-6 pb-6 rounded-b-lg">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-gray-500">
              <span className="text-red-500">*</span> Required fields
            </p>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={onHide}
                className={`${theme.secondaryButton} min-w-[120px] h-11`}
                disabled={saving}
              >
                <i className="fas fa-times mr-2"></i>
                Cancel
              </Button>
              <Button 
                onClick={onSave} 
                disabled={saving}
                className={`${theme.successButton} min-w-[140px] h-11`}
              >
                {saving ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                    {isEdit ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <i className={`fas ${isEdit ? 'fa-save' : 'fa-plus'} mr-2`}></i>
                    {isEdit ? 'Update Lead' : 'Add Lead'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeadModal; 