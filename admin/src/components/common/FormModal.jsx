import React from 'react'
import { Modal, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'

const FormModal = ({
  visible,
  onClose,
  title,
  onSubmit,
  submitText = 'Save',
  cancelText = 'Cancel',
  loading = false,
  loadingText = 'Saving...',
  submitIcon,
  size = 'lg',
  children,
  onConfirm, // Extract but don't use
  confirmText, // Extract but don't use
  ...props
}) => {
  return (
    <Modal show={visible} onHide={onClose} size={size}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {children}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onClose} 
          disabled={loading}
        >
          {cancelText}
        </button>
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {loadingText}
            </>
          ) : (
            <>
              {submitIcon && <FontAwesomeIcon icon={submitIcon} className="me-1" />}
              {submitText}
            </>
          )}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

FormModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string,
  cancelText: PropTypes.string,
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  submitIcon: PropTypes.object,
  size: PropTypes.string,
  children: PropTypes.node,
  onConfirm: PropTypes.func, // For compatibility
  confirmText: PropTypes.string // For compatibility
}

export default FormModal
