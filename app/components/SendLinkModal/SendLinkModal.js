import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { ButtonLoader } from '../LoadingSpinner';
import theme from '../../styles/adminTheme.module.css';

const SendLinkModal = ({ 
  show, 
  onHide, 
  onSendLink, 
  leadData, 
  formData, 
  isSending = false 
}) => {
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: ''
  });

  // Get domain name from current URL
  const getDomainName = () => {
    try {
      const hostname = window.location.hostname;
      // Remove 'www.' if present and capitalize first letter
      const domain = hostname.replace(/^www\./, '');
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    } catch (error) {
      return 'Clinic';
    }
  };

  // Pre-populate fields when modal opens
  useEffect(() => {
    if (show && leadData) {
      const domainName = getDomainName();
      const leadName = leadData.first_name && leadData.last_name 
        ? `${leadData.first_name} ${leadData.last_name}`
        : 'Patient';

      setEmailData({
        to: leadData.email || '',
        subject: `Consent Form from ${domainName}`,
        message: `Dear ${leadName},

Please use the given link to sign the consent form.

The link will expire in 24 hours and is only usable once.

Thank you for your cooperation.

Best regards,
${domainName} Team`
      });
    }
  }, [show, leadData]);

  const handleFieldChange = (field, value) => {
    setEmailData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSend = () => {
    if (onSendLink) {
      onSendLink(emailData);
    }
  };

  const isFormValid = emailData.to && emailData.subject && emailData.message;

  return (
    <Dialog open={show} onOpenChange={onHide}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-gray-200">
          <DialogTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-envelope text-green-600"></i>
            </div>
            Send Consent Form Link
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-2">
            Send a secure link to the patient to sign the consent form
          </p>
        </DialogHeader>
        
        <div className="py-6 space-y-6">
          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="email_to" className="text-sm font-medium text-gray-700">
              Send To <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email_to"
              type="email"
              value={emailData.to}
              onChange={(e) => handleFieldChange('to', e.target.value)}
              placeholder="Enter recipient email address"
              className="h-11"
            />
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="email_subject" className="text-sm font-medium text-gray-700">
              Subject <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email_subject"
              type="text"
              value={emailData.subject}
              onChange={(e) => handleFieldChange('subject', e.target.value)}
              placeholder="Enter email subject"
              className="h-11"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="email_message" className="text-sm font-medium text-gray-700">
              Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="email_message"
              rows={8}
              value={emailData.message}
              onChange={(e) => handleFieldChange('message', e.target.value)}
              placeholder="Enter email message"
              className="resize-none"
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <i className="fas fa-info-circle text-blue-500 mt-0.5"></i>
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Important Information:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-600">
                  <li>The consent form link will expire in 24 hours</li>
                  <li>The link can only be used once</li>
                  <li>Patient will receive a secure link to sign the form</li>
                  <li>You will be notified when the form is signed</li>
                </ul>
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
                disabled={isSending}
              >
                <i className="fas fa-times mr-2"></i>
                Cancel
              </Button>
              <Button 
                onClick={handleSend} 
                disabled={!isFormValid || isSending}
                className={`${theme.successButton} min-w-[140px] h-11`}
              >
                {isSending ? (
                  <ButtonLoader message="Sending..." />
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Send Link
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

export default SendLinkModal;