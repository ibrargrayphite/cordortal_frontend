import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import styles from '../../leads/leads.module.css';
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
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => onFormChange("first_name", e.target.value)}
                  placeholder="Enter first name"
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => onFormChange("last_name", e.target.value)}
                  placeholder="Enter last name"
                />
              </Form.Group>
            </div>
          </div>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={formData.email}
              onChange={(e) => onFormChange("email", e.target.value)}
              placeholder="Enter email address"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              value={formData.phone}
              onChange={(e) => onFormChange("phone", e.target.value)}
              placeholder="Enter phone number"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Source</Form.Label>
            <Form.Select
              value={formData.source}
              onChange={(e) => onFormChange("source", e.target.value)}
            >
              <option value="">Select source</option>
              <option value="WEBSITE">Website</option>
              <option value="GMAIL">Gmail</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.message}
              onChange={(e) => onFormChange("message", e.target.value)}
              placeholder="Enter message"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={onHide}
          className={theme.secondaryButton}
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={onSave} 
          disabled={saving}
          className={theme.successButton}
        >
          {saving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              {isEdit ? 'Updating...' : 'Saving...'}
            </>
          ) : (
            isEdit ? 'Update Lead' : 'Add Lead'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LeadModal; 