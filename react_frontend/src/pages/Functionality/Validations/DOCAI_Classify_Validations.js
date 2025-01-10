const FIELD_VALIDATION_MAPPING = {
    "Insurance Application": {
        policy_holder_name: {
            required: true,
            pattern: /^[A-Za-z\s]{2,30}$/,
            errorMessage: "Name should be 2-30 characters long and contain only letters"
        },
        policy_holder_email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage: "Please enter a valid email address"
        },
        policy_type: {
            required: true,
            errorMessage: "Please select a policy type"
        },
        property_address: {
            required: true,
            minLength: 10,
            maxLength: 100,
            errorMessage: "Address should be between 10 and 100 characters"
        },
        effective_date_of_coverage: {
            required: true,
            maxDate: new Date(),
            errorMessage: "Date cannot be in the future"
        },
        policy_holder_mobile: {
            required: true,
            pattern: /^\d{10}$/,
            errorMessage: "Please enter a valid 10-digit mobile number"
        }
    },
    "Quotes and Proposals": {
        Quote_or_Proposal_number: {
            required: true,
            pattern: /^[A-Za-z0-9]{5,15}$/,
            errorMessage: "Quote number should be 5-15 alphanumeric characters"
        },
        Customer_name: {
            required: true,
            pattern: /^[A-Za-z\s]{2,50}$/,
            errorMessage: "Name should be 2-30 characters long and contain only letters"
        },
        Effective_date: {
            required: true,
            maxDate: new Date(),
            errorMessage: "Date cannot be in the future"
        },
        Type_of_coverage: {
            required: true,
            errorMessage: "Please select coverage type"
        },
        Agent_name: {
            required: true,
            pattern: /^[A-Za-z\s]{2,50}$/,
            errorMessage: "Agent name should be 2-30 characters long"
        },
        Underwriting_company_name: {
            required: true,
            minLength: 3,
            maxLength: 100,
            errorMessage: "Company name should be between 3 and 50 characters"
        }
    },
    "Policy Declaration": {
        Policy_number: {
            required: true,
            pattern: /^[A-Z0-9]{5,15}$/,
            errorMessage: "Policy number should be 6-15 alphanumeric characters"
        },
        Policy_holder_name: {
            required: true,
            pattern: /^[A-Za-z\s]{2,50}$/,
            errorMessage: "Name should be 2-30 characters long and contain only letters"
        },
        Policy_effective_date: {
            required: true,
            maxDate: new Date(),
            errorMessage: "Effective date cannot be in the future"
        },
        Policy_expiration_date: {
            required: true,
            minDate: new Date(),
            errorMessage: "Expiration date must be in the future"
        },
        Type_of_coverage: {
            required: true,
            errorMessage: "Please select coverage type"
        },
        Premium_amount: {
            required: true,
            pattern: /^\d+(\.\d{1,10})?$/,
            errorMessage: "Please enter a valid premium amount"
        }
    },
    "Renewal Notice": {
        Policy_number: {
            required: true,
            pattern: /^[A-Z0-9]{5,15}$/,
            errorMessage: "Policy number should be 6-15 alphanumeric characters"
        },
        Policy_holder_name: {
            required: true,
            pattern: /^[A-Za-z\s]{2,50}$/,
            errorMessage: "Name should be 2-30 characters long and contain only letters"
        },
        Policy_expiration_date: {
            required: true,
            minDate: new Date(),
            errorMessage: "Expiration date must be in the future"
        },
        Renewal_effective_date: {
            required: true,
            minDate: new Date(),
            errorMessage: "Renewal date must be in the future"
        },
        Policy_type: {
            required: true,
            errorMessage: "Please select policy type"
        }
    },
    "Cancellation Notice": {
        Policy_number: {
            required: true,
            pattern: /^[A-Z0-9]{5,15}$/,
            errorMessage: "Policy number should be 6-15 alphanumeric characters"
        },
        Policy_holder_name: {
            required: true,
            pattern: /^[A-Za-z\s]{2,50}$/,
            errorMessage: "Name should be 2-30 characters long and contain only letters"
        },
        Policy_effective_date: {
            required: true,
            maxDate: new Date(),
            errorMessage: "Effective date cannot be in the future"
        },
        Policy_expiration_date: {
            required: true,
            minDate: new Date(),
            errorMessage: "Expiration date must be in the future"
        },
        Policy_cancellation_date: {
            required: true,
            minDate: new Date(),
            errorMessage: "Cancellation date must be in the future"
        },
        Reason_for_policy_cancellation: {
            required: true,
            minLength: 10,
            maxLength: 500,
            errorMessage: "Please provide a detailed reason (10-500 characters)"
        }
    },
    "First Notice of Loss (FNOL)": {
        policy_number: {
            required: true,
            pattern: /^[A-Z0-9]{5,15}$/,
            errorMessage: "Policy number should be 6-15 alphanumeric characters"
        },
        loss_date_and_time: {
            required: true,
            maxDate: new Date(),
            errorMessage: "Loss date cannot be in the future"
        },
        policy_effective_date: {
            required: true,
            maxDate: new Date(),
            errorMessage: "Effective date cannot be in the future"
        },
        policy_expiration_date: {
            required: true,
            minDate: new Date(),
            errorMessage: "Expiration date must be in the future"
        },
        loss_location: {
            required: true,
            minLength: 10,
            maxLength: 200,
            errorMessage: "Location should be between 10 and 100 characters"
        }
    },
    "Medical Bill": {
        Patient_name: {
            required: true,
            pattern: /^[A-Za-z\s]{2,50}$/,
            errorMessage: "Name should be 2-30 characters long and contain only letters"
        },
        Patient_ID: {
            required: true,
            pattern: /^[A-Z0-9]{5,15}$/,
            errorMessage: "Patient ID should be 6-15 alphanumeric characters"
        },
        Guarantor_name: {
            required: true,
            pattern: /^[A-Za-z\s]{2,50}$/,
            errorMessage: "Guarantor name should be 2-30 characters long"
        },
        Guarantor_number: {
            required: true,
            pattern: /^\d{5,15}$/,
            errorMessage: "Guarantor number should be 10-15 digits"
        },
        Statement_date: {
            required: true,
            maxDate: new Date(),
            errorMessage: "Statement date cannot be in the future"
        }
    },
    "Credit Report": {
        Policy_holder_name: {
            required: true,
            pattern: /^[A-Za-z\s]{2,50}$/,
            errorMessage: "Name should be 2-30 characters long and contain only letters"
        },
        Policy_holder_mobile: {
            required: true,
            pattern: /^\d{10}$/,
            errorMessage: "Please enter a valid 10-digit mobile number"
        },
        Policy_holder_email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage: "Please enter a valid email address"
        },
        Insurance_score: {
            required: true,
            pattern: /^\d{2,6}$/,
            errorMessage: "Insurance score should be 3-4 digits"
        },
        Credit_inquiry_type: {
            required: true,
            errorMessage: "Please select inquiry type"
        },
        Credit_account_type: {
            required: true,
            errorMessage: "Please select account type"
        }
    },
    "Appraisal Report": {
        Policy_holder_name: {
            required: true,
            pattern: /^[A-Za-z\s]{2,50}$/,
            errorMessage: "Name should be 2-30 characters long and contain only letters"
        },
        Policy_number: {
            required: true,
            pattern: /^[A-Z0-9]{5,15}$/,
            errorMessage: "Policy number should be 6-15 alphanumeric characters"
        },
        Claim_number: {
            required: true,
            pattern: /^[A-Z0-9]{5,15}$/,
            errorMessage: "Claim number should be 6-15 alphanumeric characters"
        },
        Appraiser_name: {
            required: true,
            pattern: /^[A-Za-z\s]{2,50}$/,
            errorMessage: "Appraiser name should be 2-30 characters long"
        },
        Appraisal_date: {
            required: true,
            maxDate: new Date(),
            errorMessage: "Appraisal date cannot be in the future"
        },
        Date_of_loss: {
            required: true,
            maxDate: new Date(),
            errorMessage: "Loss date cannot be in the future"
        },
        Appraisal_id_number: {
            required: true,
            pattern: /^[A-Z0-9]{5,15}$/,
            errorMessage: "Appraisal ID should be 6-15 alphanumeric characters"
        }
    },
    "Inspection Report": {
        Policy_number: {
            required: true,
            pattern: /^[A-Z0-9]{5,15}$/,
            errorMessage: "Policy number should be 6-15 alphanumeric characters"
        },
        Policy_holder_name: {
            required: true,
            pattern: /^[A-Za-z\s]{2,50}$/,
            errorMessage: "Name should be 2-30 characters long and contain only letters"
        },
        Property_address: {
            required: true,
            minLength: 10,
            maxLength: 200,
            errorMessage: "Address should be between 10 and 100 characters"
        },
        Inspection_date: {
            required: true,
            maxDate: new Date(),
            errorMessage: "Inspection date cannot be in the future"
        },
        Inspection_type: {
            required: true,
            errorMessage: "Please select inspection type"
        },
        Inspection_id_number: {
            required: true,
            pattern: /^[A-Z0-9]{5,15}$/,
            errorMessage: "Inspection ID should be 6-15 alphanumeric characters"
        }
    }
};

const MODEL_MAPPING = {
    "Insurance Application": "Insurance Application",
    "Quotes and Proposals": "Quotes and Proposals",
    "Policy Declaration": "Policy Declaration",
    "Renewal Notice": "Renewal Notice",
    "Cancellation Notice": "Cancellation Notice",
    "First Notice of Loss (FNOL)": "First Notice of Loss (FNOL)",
    "Medical Bill": "Medical Bill",
    "Credit Report": "Credit Report",
    "Appraisal Report": "Appraisal Report",
    "Inspection Report": "Inspection Report",
  }
  
  const MODEL_FIELD_MAPPING = {
    "Insurance Application": ["policy_holder_name", "policy_holder_email", "policy_type", "property_address", "effective_date_of_coverage", "policy_holder_mobile"],
    "Quotes and Proposals": ["Quote_or_Proposal_number", "Customer_name", "Effective_date", "Type_of_coverage", "Agent_name", "Underwriting_company_name"],
    "Policy Declaration": ["Policy_number", "Policy_holder_name", "Policy_effective_date", "Policy_expiration_date", "Type_of_coverage", "Premium_amount"],
    "Renewal Notice": ["Policy_number", "Policy_holder_name", "Policy_expiration_date", "Renewal_effective_date", "Policy_type"],
    "Cancellation Notice": ["Policy_number", "Policy_holder_name", "Policy_effective_date", "Policy_expiration_date", "Policy_cancellation_date", "Reason_for_policy_cancellation"],
    "First Notice of Loss (FNOL)": ["policy_number", "loss_date_and_time", "policy_effective_date", "policy_expiration_date", "loss_location"],
    "Medical Bill": ["Patient_name", "Patient_ID", "Guarantor_name", "Guarantor_number", "Statement_date"],
    "Credit Report": ["Policy_holder_name", "Policy_holder_mobile", "Policy_holder_email", "Insurance_score", "Credit_inquiry_type", "Credit_account_type"],
    "Appraisal Report": ["Policy_holder_name", "Policy_number", "Claim_number", "Appraiser_name", "Appraisal_date", "Date_of_loss", "Appraisal_id_number"],
    "Inspection Report": ["Policy_number", "Policy_holder_name", "Property_address", "Inspection_date", "Inspection_type", "Inspection_id_number"],
  };
  
  const FIELD_TYPES = {
    TEXT: "text",
    SELECT: "select",
    DATE: "date",
  };
  
  const FIELD_TYPE_MAPPING = {
    "Insurance Application": {
      policy_holder_name: FIELD_TYPES.TEXT,
      policy_holder_email: FIELD_TYPES.TEXT,
      policy_type: FIELD_TYPES.SELECT,
      property_address: FIELD_TYPES.TEXT,
      effective_date_of_coverage: FIELD_TYPES.DATE,
      policy_holder_mobile: FIELD_TYPES.TEXT,
    },
    "Quotes and Proposals": {
      Quote_or_Proposal_number: FIELD_TYPES.TEXT,
      Customer_name: FIELD_TYPES.TEXT,
      Effective_date: FIELD_TYPES.DATE,
      Type_of_coverage: FIELD_TYPES.SELECT,
      Agent_name: FIELD_TYPES.TEXT,
      Underwriting_company_name: FIELD_TYPES.TEXT,
    },
    "Policy Declaration": {
      Policy_number: FIELD_TYPES.TEXT,
      Policy_holder_name: FIELD_TYPES.TEXT,
      Policy_effective_date: FIELD_TYPES.DATE,
      Policy_expiration_date: FIELD_TYPES.DATE,
      Type_of_coverage: FIELD_TYPES.SELECT,
      Premium_amount: FIELD_TYPES.TEXT,
    },
    "Renewal Notice": {
      Policy_number: FIELD_TYPES.TEXT,
      Policy_holder_name: FIELD_TYPES.TEXT,
      Policy_expiration_date: FIELD_TYPES.DATE,
      Renewal_effective_date: FIELD_TYPES.DATE,
      Policy_type: FIELD_TYPES.SELECT,
    },
    "Cancellation Notice": {
      Policy_number: FIELD_TYPES.TEXT,
      Policy_holder_name: FIELD_TYPES.TEXT,
      Policy_effective_date: FIELD_TYPES.DATE,
      Policy_expiration_date: FIELD_TYPES.DATE,
      Policy_cancellation_date: FIELD_TYPES.DATE,
      Reason_for_policy_cancellation: FIELD_TYPES.TEXT,
    },
    "First Notice of Loss (FNOL)": {
      policy_number: FIELD_TYPES.TEXT,
      loss_date_and_time: FIELD_TYPES.DATE,
      policy_effective_date: FIELD_TYPES.DATE,
      policy_expiration_date: FIELD_TYPES.DATE,
      loss_location: FIELD_TYPES.TEXT,
    },
    "Medical Bill": {
      Patient_name: FIELD_TYPES.TEXT,
      Patient_ID: FIELD_TYPES.TEXT,
      Guarantor_name: FIELD_TYPES.TEXT,
      Guarantor_number: FIELD_TYPES.TEXT,
      Statement_date: FIELD_TYPES.DATE,
    },
    "Credit Report": {
      Policy_holder_name: FIELD_TYPES.TEXT,
      Policy_holder_mobile: FIELD_TYPES.TEXT,
      Policy_holder_email: FIELD_TYPES.TEXT,
      Insurance_score: FIELD_TYPES.TEXT,
      Credit_inquiry_type: FIELD_TYPES.SELECT,
      Credit_account_type: FIELD_TYPES.SELECT,
    },
    "Appraisal Report": {
      Policy_holder_name: FIELD_TYPES.TEXT,
      Policy_number: FIELD_TYPES.TEXT,
      Claim_number: FIELD_TYPES.TEXT,
      Appraiser_name: FIELD_TYPES.TEXT,
      Appraisal_date: FIELD_TYPES.DATE,
      Date_of_loss: FIELD_TYPES.DATE,
      Appraisal_id_number: FIELD_TYPES.TEXT,
    },
    "Inspection Report": {
      Policy_number: FIELD_TYPES.TEXT,
      Policy_holder_name: FIELD_TYPES.TEXT,
      Property_address: FIELD_TYPES.TEXT,
      Inspection_date: FIELD_TYPES.DATE,
      Inspection_type: FIELD_TYPES.SELECT,
      Inspection_id_number: FIELD_TYPES.TEXT
    }
  };

  const FIELD_OPTIONS_MAPPING = {
    Policy_type:['HO1 - Basic Coverage','HO2 - Additional Perils','HO3 - Homeowners Insurance','HO6 - Condo Insurance'],
    policy_type:['HO1 - Basic Coverage','HO2 - Additional Perils','HO3 - Homeowners Insurance','HO6 - Condo Insurance'],
    Type_of_coverage:['Auto Insurance','Homeowners Insurance','Commercial Insurance','Renters Insurance'],
    Credit_inquiry_type:['Hard','Soft'],
    Credit_account_type:['Revolving','Instalment','Mortgage','Auto Loan'],
    Inspection_type:['Routine','Follow-up','Initial','Final'],
  };
  

  export { FIELD_VALIDATION_MAPPING, FIELD_TYPE_MAPPING, MODEL_FIELD_MAPPING, MODEL_MAPPING, FIELD_TYPES, FIELD_OPTIONS_MAPPING }; 