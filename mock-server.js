const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Enhanced configuration
const config = {
  enableLogging: true,
  enableRateLimiting: false,
  enableMockDelays: true,
  mockDelayRange: { min: 100, max: 500 }
};

// Utility functions
const logger = (message, data = null) => {
  if (config.enableLogging) {
    console.log(`[${new Date().toISOString()}] ${message}`, data || '');
  }
};

const addMockDelay = () => {
  if (config.enableMockDelays) {
    const delay = Math.random() * (config.mockDelayRange.max - config.mockDelayRange.min) + config.mockDelayRange.min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
  return Promise.resolve();
};

// In-memory data store for dynamic data
const dataStore = {
  notifications: [],
  userSettings: {},
  pendingTransactions: [],
  loanApplications: [],
  transferRequests: []
};

// Enhanced mock user data
const mockUser = {
  authenticated: true,
  base64EncodedAuthenticationKey: 'YWRtaW46cGFzc3dvcmQ=', // base64 of "admin:password"
  clients: [1],
  isSelfServiceUser: true,
  officeId: 1,
  officeName: 'Head Office',
  userId: 1,
  username: 'admin',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  lastLoginDate: '2023-12-01T10:30:00Z',
  accountLocked: false,
  failedLoginAttempts: 0,
  passwordExpiryDate: '2024-06-01T00:00:00Z',
  roles: [
    {
      id: 2,
      name: 'Self Service User',
      description: 'Self Service User Role'
    }
  ],
  permissions: [
    'READ_ACCOUNT',
    'READ_TRANSACTION',
    'READ_BENEFICIARY',
    'READ_CHARGE',
    'CREATE_LOAN',
    'CREATE_TRANSFER',
    'READ_LOAN',
    'READ_TRANSFER',
    'UPDATE_PROFILE',
    'CHANGE_PASSWORD',
    'READ_NOTIFICATIONS',
    'MANAGE_SETTINGS'
  ]
};

// Enhanced mock client data
const mockClient = {
  id: 1,
  accountNo: '000000001',
  status: { id: 300, code: 'clientStatusType.active', value: 'Active' },
  active: true,
  activationDate: '2023-01-01',
  firstname: 'John',
  lastname: 'Doe',
  displayName: 'John Doe',
  officeId: 1,
  officeName: 'Head Office',
  mobileNo: '+1234567890',
  emailAddress: 'john.doe@example.com',
  dateOfBirth: '1990-01-01',
  gender: { id: 1, code: 'gender.male', value: 'Male' },
  address: {
    addressLine1: '123 Main Street',
    addressLine2: 'Apt 4B',
    city: 'New York',
    stateProvinceId: 1,
    stateProvinceName: 'New York',
    countryId: 1,
    countryName: 'United States',
    postalCode: '10001'
  },
  familyMembers: [
    {
      id: 1,
      firstname: 'Jane',
      lastname: 'Doe',
      relationship: 'Spouse',
      dateOfBirth: '1992-05-15'
    }
  ],
  documents: [
    {
      id: 1,
      name: 'ID Card',
      fileName: 'id_card.pdf',
      size: 1024000,
      uploadedOn: '2023-01-01T09:00:00Z'
    }
  ]
};



// Mock accounts data
const mockAccounts = {
  loanAccounts: [
    {
      id: 1,
      accountNo: '000000001',
      productId: 1,
      productName: 'Personal Loan',
      status: { id: 300, code: 'loanStatusType.active', value: 'Active' },
      currency: { code: 'USD', name: 'US Dollar' },
      principal: 10000,
      principalDisbursed: 10000,
      principalOutstanding: 8000,
      principalPaid: 2000,
      interestOutstanding: 500,
      feeChargesOutstanding: 0,
      penaltyChargesOutstanding: 0,
      totalOutstanding: 8500,
      loanTermFrequency: 12,
      loanTermFrequencyType: { id: 2, code: 'frequencyType.months', value: 'Months' },
      loanType: { id: 1, code: 'loanType.individual', value: 'Individual' },
      interestRatePerPeriod: 8.5,
      interestType: { id: 1, code: 'interestType.declining', value: 'Declining Balance' },
      amortizationType: { id: 1, code: 'amortizationType.equal.installments', value: 'Equal installments' },
      transactionProcessingStrategyId: 1,
      transactionProcessingStrategyName: 'Standard Strategy'
    },
    {
      id: 2,
      accountNo: '000000002',
      productId: 2,
      productName: 'Business Loan',
      status: { id: 300, code: 'loanStatusType.active', value: 'Active' },
      currency: { code: 'USD', name: 'US Dollar' },
      principal: 25000,
      principalDisbursed: 25000,
      principalOutstanding: 20000,
      principalPaid: 5000,
      interestOutstanding: 1200,
      feeChargesOutstanding: 0,
      penaltyChargesOutstanding: 0,
      totalOutstanding: 21200,
      loanTermFrequency: 24,
      loanTermFrequencyType: { id: 2, code: 'frequencyType.months', value: 'Months' },
      loanType: { id: 1, code: 'loanType.individual', value: 'Individual' },
      interestRatePerPeriod: 7.5,
      interestType: { id: 1, code: 'interestType.declining', value: 'Declining Balance' },
      amortizationType: { id: 1, code: 'amortizationType.equal.installments', value: 'Equal installments' },
      transactionProcessingStrategyId: 1,
      transactionProcessingStrategyName: 'Standard Strategy'
    }
  ],
  savingsAccounts: [
    {
      id: 3,
      accountNo: '000000003',
      productId: 3,
      productName: 'Savings Account',
      status: { id: 100, code: 'savingsAccountStatusType.active', value: 'Active' },
      currency: { code: 'USD', name: 'US Dollar' },
      accountBalance: 5000,
      availableBalance: 5000,
      totalDeposits: 10000,
      totalWithdrawals: 5000,
      nominalAnnualInterestRate: 2.5,
      interestCompoundingPeriodType: { id: 1, code: 'interestCompoundingPeriodType.monthly', value: 'Monthly' },
      interestPostingPeriodType: { id: 4, code: 'interestPostingPeriodType.quarterly', value: 'Quarterly' },
      interestCalculationType: { id: 1, code: 'interestCalculationType.balance', value: 'Daily Balance' }
    },
    {
      id: 4,
      accountNo: '000000004',
      productId: 4,
      productName: 'Fixed Deposit',
      status: { id: 100, code: 'savingsAccountStatusType.active', value: 'Active' },
      currency: { code: 'USD', name: 'US Dollar' },
      accountBalance: 15000,
      availableBalance: 15000,
      totalDeposits: 15000,
      totalWithdrawals: 0,
      nominalAnnualInterestRate: 4.5,
      interestCompoundingPeriodType: { id: 1, code: 'interestCompoundingPeriodType.monthly', value: 'Monthly' },
      interestPostingPeriodType: { id: 4, code: 'interestPostingPeriodType.quarterly', value: 'Quarterly' },
      interestCalculationType: { id: 1, code: 'interestCalculationType.balance', value: 'Daily Balance' }
    }
  ],
  shareAccounts: [
    {
      id: 5,
      accountNo: '000000005',
      productId: 5,
      productName: 'Share Account',
      status: { id: 100, code: 'shareAccountStatusType.active', value: 'Active' },
      currency: { code: 'USD', name: 'US Dollar' },
      totalShares: 100,
      totalSharesIssued: 100,
      totalSharesPendingForApproval: 0,
      totalSharesApproved: 100,
      totalSharesApplied: 100,
      totalSharesRedeemed: 0,
      unitPrice: 10,
      totalChargePayable: 0,
      totalDividendPayable: 50
    }
  ]
};

// Mock loan products
const mockLoanProducts = [
  {
    id: 1,
    name: 'Personal Loan',
    shortName: 'PL',
    description: 'Personal loan for individual borrowers',
    currency: { code: 'USD', name: 'US Dollar' },
    principal: 10000,
    minPrincipal: 1000,
    maxPrincipal: 50000,
    numberOfRepayments: 12,
    repaymentEvery: 1,
    repaymentFrequencyType: { id: 2, code: 'frequencyType.months', value: 'Months' },
    interestRatePerPeriod: 8.5,
    interestRateFrequencyType: { id: 2, code: 'frequencyType.months', value: 'Months' },
    amortizationType: { id: 1, code: 'amortizationType.equal.installments', value: 'Equal installments' },
    interestType: { id: 1, code: 'interestType.declining', value: 'Declining Balance' },
    interestCalculationPeriodType: { id: 1, code: 'interestCalculationPeriodType.days', value: 'Days' },
    transactionProcessingStrategyId: 1,
    transactionProcessingStrategyName: 'Standard Strategy',
    loanPurposeOptions: [
      { id: 1, name: 'Home Improvement' },
      { id: 2, name: 'Education' },
      { id: 3, name: 'Medical' },
      { id: 4, name: 'Vehicle Purchase' },
      { id: 5, name: 'Business' }
    ]
  },
  {
    id: 2,
    name: 'Business Loan',
    shortName: 'BL',
    description: 'Business loan for entrepreneurs',
    currency: { code: 'USD', name: 'US Dollar' },
    principal: 25000,
    minPrincipal: 5000,
    maxPrincipal: 100000,
    numberOfRepayments: 24,
    repaymentEvery: 1,
    repaymentFrequencyType: { id: 2, code: 'frequencyType.months', value: 'Months' },
    interestRatePerPeriod: 7.5,
    interestRateFrequencyType: { id: 2, code: 'frequencyType.months', value: 'Months' },
    amortizationType: { id: 1, code: 'amortizationType.equal.installments', value: 'Equal installments' },
    interestType: { id: 1, code: 'interestType.declining', value: 'Declining Balance' },
    interestCalculationPeriodType: { id: 1, code: 'interestCalculationPeriodType.days', value: 'Days' },
    transactionProcessingStrategyId: 1,
    transactionProcessingStrategyName: 'Standard Strategy',
    loanPurposeOptions: [
      { id: 5, name: 'Business' },
      { id: 6, name: 'Equipment Purchase' },
      { id: 7, name: 'Working Capital' }
    ]
  }
];

// Mock transactions
const mockTransactions = {
  pageItems: [
    {
      id: 1,
      transactionType: { id: 1, code: 'transactionType.deposit', value: 'Deposit' },
      amount: 1000,
      date: '2023-12-01',
      currency: { code: 'USD', name: 'US Dollar' },
      reversed: false,
      accountId: 3,
      accountNo: '000000003',
      runningBalance: 5000,
      receiptNumber: 'RCP001',
      description: 'Salary deposit'
    },
    {
      id: 2,
      transactionType: { id: 2, code: 'transactionType.withdrawal', value: 'Withdrawal' },
      amount: 500,
      date: '2023-11-30',
      currency: { code: 'USD', name: 'US Dollar' },
      reversed: false,
      accountId: 3,
      accountNo: '000000003',
      runningBalance: 4000,
      receiptNumber: 'RCP002',
      description: 'ATM withdrawal'
    },
    {
      id: 3,
      transactionType: { id: 3, code: 'transactionType.transfer', value: 'Transfer' },
      amount: 2000,
      date: '2023-11-29',
      currency: { code: 'USD', name: 'US Dollar' },
      reversed: false,
      accountId: 3,
      accountNo: '000000003',
      runningBalance: 4500,
      receiptNumber: 'RCP003',
      description: 'Transfer to savings'
    },
    {
      id: 4,
      transactionType: { id: 4, code: 'transactionType.payment', value: 'Payment' },
      amount: 300,
      date: '2023-11-28',
      currency: { code: 'USD', name: 'US Dollar' },
      reversed: false,
      accountId: 1,
      accountNo: '000000001',
      runningBalance: 8200,
      receiptNumber: 'RCP004',
      description: 'Loan payment'
    }
  ],
  totalFilteredRecords: 4
};

// Mock beneficiaries
const mockBeneficiaries = {
  pageItems: [
    {
      id: 1,
      accountType: { id: 1, code: 'beneficiaryType.external', value: 'External' },
      accountNumber: '1234567890',
      accountTypeName: 'Savings Account',
      transferLimit: 10000,
      name: 'Jane Smith',
      officeName: 'Branch Office',
      bankName: 'First National Bank',
      routingCode: '021000021',
      accountType: { id: 1, code: 'accountType.savings', value: 'Savings' }
    },
    {
      id: 2,
      accountType: { id: 2, code: 'beneficiaryType.internal', value: 'Internal' },
      accountNumber: '000000004',
      accountTypeName: 'Fixed Deposit',
      transferLimit: 50000,
      name: 'John Doe',
      officeName: 'Head Office',
      accountType: { id: 2, code: 'accountType.fixed', value: 'Fixed Deposit' }
    }
  ],
  totalFilteredRecords: 2
};

// Mock charges
const mockCharges = {
  pageItems: [
    {
      id: 1,
      name: 'Monthly Maintenance Fee',
      amount: 10,
      amountOutstanding: 10,
      amountPaid: 0,
      amountWaived: 0,
      chargeTimeType: { id: 1, code: 'chargeTimeType.monthlyFee', value: 'Monthly Fee' },
      chargeCalculationType: { id: 1, code: 'chargeCalculationType.flat', value: 'Flat' },
      currency: { code: 'USD', name: 'US Dollar' },
      dueDate: '2023-12-31',
      chargeType: { id: 1, code: 'chargeType.savings', value: 'Savings' },
      accountId: 3,
      accountNo: '000000003'
    },
    {
      id: 2,
      name: 'Late Payment Fee',
      amount: 25,
      amountOutstanding: 25,
      amountPaid: 0,
      amountWaived: 0,
      chargeTimeType: { id: 2, code: 'chargeTimeType.specifiedDueDate', value: 'Specified Due Date' },
      chargeCalculationType: { id: 1, code: 'chargeCalculationType.flat', value: 'Flat' },
      currency: { code: 'USD', name: 'US Dollar' },
      dueDate: '2023-12-15',
      chargeType: { id: 2, code: 'chargeType.loan', value: 'Loan' },
      accountId: 1,
      accountNo: '000000001'
    }
  ],
  totalFilteredRecords: 2
};

// Enhanced mock transfer template
const mockTransferTemplate = {
  fromAccountTypeOptions: [
    { id: 1, code: 'accountType.savings', value: 'Savings' },
    { id: 2, code: 'accountType.loan', value: 'Loan' },
    { id: 3, code: 'accountType.share', value: 'Share' }
  ],
  toAccountTypeOptions: [
    { id: 1, code: 'accountType.savings', value: 'Savings' },
    { id: 2, code: 'accountType.loan', value: 'Loan' },
    { id: 3, code: 'accountType.share', value: 'Share' }
  ],
  fromAccountOptions: [
    { id: 3, accountNo: '000000003', productName: 'Savings Account', accountType: { id: 1, code: 'accountType.savings', value: 'Savings' } },
    { id: 1, accountNo: '000000001', productName: 'Personal Loan', accountType: { id: 2, code: 'accountType.loan', value: 'Loan' } },
    { id: 5, accountNo: '000000005', productName: 'Share Account', accountType: { id: 3, code: 'accountType.share', value: 'Share' } }
  ],
  toAccountOptions: [
    { id: 4, accountNo: '000000004', productName: 'Fixed Deposit', accountType: { id: 1, code: 'accountType.savings', value: 'Savings' } },
    { id: 2, accountNo: '000000002', productName: 'Business Loan', accountType: { id: 2, code: 'accountType.loan', value: 'Loan' } }
  ],
  officeOptions: [
    { id: 1, name: 'Head Office' },
    { id: 2, name: 'Branch Office' }
  ],
  clientOptions: [
    { id: 1, displayName: 'John Doe' },
    { id: 2, displayName: 'Jane Smith' }
  ],
  dateFormat: 'dd MMMM yyyy',
  locale: 'en'
};

// Mock notifications
const mockNotifications = {
  pageItems: [
    {
      id: 1,
      title: 'Account Statement Available',
      message: 'Your monthly account statement for December 2023 is now available.',
      type: 'INFO',
      read: false,
      createdAt: '2023-12-01T09:00:00Z',
      priority: 'LOW'
    },
    {
      id: 2,
      title: 'Loan Payment Due',
      message: 'Your loan payment of $300 is due on December 15, 2023.',
      type: 'WARNING',
      read: false,
      createdAt: '2023-11-30T14:30:00Z',
      priority: 'HIGH'
    },
    {
      id: 3,
      title: 'Transfer Completed',
      message: 'Your transfer of $500 to account 000000004 has been completed successfully.',
      type: 'SUCCESS',
      read: true,
      createdAt: '2023-11-29T16:45:00Z',
      priority: 'MEDIUM'
    }
  ],
  totalFilteredRecords: 3
};

// Mock user settings
const mockUserSettings = {
  id: 1,
  userId: 1,
  language: 'en',
  timezone: 'America/New_York',
  dateFormat: 'dd MMMM yyyy',
  currency: 'USD',
  notifications: {
    email: true,
    sms: false,
    push: true,
    transactionAlerts: true,
    securityAlerts: true,
    marketingAlerts: false
  },
  security: {
    twoFactorAuth: false,
    biometricAuth: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5
  },
  display: {
    theme: 'light',
    fontSize: 'medium',
    showBalance: true,
    showAccountNumbers: false
  }
};

// Mock loan applications
const mockLoanApplications = {
  pageItems: [
    {
      id: 1,
      loanProductId: 1,
      loanProductName: 'Personal Loan',
      principal: 15000,
      loanTermFrequency: 24,
      loanTermFrequencyType: { id: 2, code: 'frequencyType.months', value: 'Months' },
      loanPurposeId: 1,
      loanPurposeName: 'Home Improvement',
      submittedOnDate: '2023-11-15',
      status: { id: 1, code: 'loanApplicationStatusType.pending', value: 'Pending' },
      assignedTo: 'Loan Officer',
      expectedDisbursementDate: '2023-12-15'
    }
  ],
  totalFilteredRecords: 1
};

// Mock savings products
const mockSavingsProducts = [
  {
    id: 3,
    name: 'Savings Account',
    shortName: 'SA',
    description: 'Basic savings account with competitive interest rates',
    currency: { code: 'USD', name: 'US Dollar' },
    nominalAnnualInterestRate: 2.5,
    interestCompoundingPeriodType: { id: 1, code: 'interestCompoundingPeriodType.monthly', value: 'Monthly' },
    interestPostingPeriodType: { id: 4, code: 'interestPostingPeriodType.quarterly', value: 'Quarterly' },
    interestCalculationType: { id: 1, code: 'interestCalculationType.balance', value: 'Daily Balance' },
    minRequiredOpeningBalance: 100,
    lockinPeriodFrequency: 0,
    lockinPeriodFrequencyType: { id: 1, code: 'frequencyType.days', value: 'Days' }
  },
  {
    id: 4,
    name: 'Fixed Deposit',
    shortName: 'FD',
    description: 'Fixed deposit with higher interest rates',
    currency: { code: 'USD', name: 'US Dollar' },
    nominalAnnualInterestRate: 4.5,
    interestCompoundingPeriodType: { id: 1, code: 'interestCompoundingPeriodType.monthly', value: 'Monthly' },
    interestPostingPeriodType: { id: 4, code: 'interestPostingPeriodType.quarterly', value: 'Quarterly' },
    interestCalculationType: { id: 1, code: 'interestCalculationType.balance', value: 'Daily Balance' },
    minRequiredOpeningBalance: 1000,
    lockinPeriodFrequency: 12,
    lockinPeriodFrequencyType: { id: 2, code: 'frequencyType.months', value: 'Months' }
  }
];

// Enhanced authentication endpoint
app.post('/fineract-provider/api/v1/self/authentication', async (req, res) => {
  const { username, password } = req.body;
  
  logger('Login attempt:', { username, password: '***' });
  
  await addMockDelay();
  
  if (username === 'admin' && password === 'password') {
    // Update last login date
    mockUser.lastLoginDate = new Date().toISOString();
    mockUser.failedLoginAttempts = 0;
    
    res.status(200).json(mockUser);
  } else {
    // Increment failed login attempts
    mockUser.failedLoginAttempts = (mockUser.failedLoginAttempts || 0) + 1;
    
    if (mockUser.failedLoginAttempts >= 5) {
      mockUser.accountLocked = true;
    }
    
    res.status(401).json({
      developerMessage: 'Invalid username or password',
      httpStatusCode: '401',
      defaultUserMessage: 'Invalid username or password'
    });
  }
});

// Logout endpoint
app.post('/fineract-provider/api/v1/self/authentication/logout', async (req, res) => {
  logger('Logout request');
  await addMockDelay();
  res.status(200).json({ message: 'Logged out successfully' });
});

// Change password endpoint
app.post('/fineract-provider/api/v1/self/users/:userId/password', async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;
  
  logger('Change password request:', { userId, currentPassword: '***', newPassword: '***' });
  
  await addMockDelay();
  
  if (currentPassword === 'password') {
    // Update password expiry date
    mockUser.passwordExpiryDate = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(); // 180 days
    
    res.status(200).json({ 
      message: 'Password changed successfully',
      passwordExpiryDate: mockUser.passwordExpiryDate
    });
  } else {
    res.status(400).json({
      developerMessage: 'Current password is incorrect',
      httpStatusCode: '400',
      defaultUserMessage: 'Current password is incorrect'
    });
  }
});

// Reset password endpoint
app.post('/fineract-provider/api/v1/self/users/password', async (req, res) => {
  const { username, email, newPassword } = req.body;
  
  logger('Reset password request:', { username, email, hasNewPassword: !!newPassword });
  
  await addMockDelay();
  
  // Validate required fields
  if (!username || !email) {
    return res.status(400).json({
      developerMessage: 'Missing required fields',
      httpStatusCode: '400',
      defaultUserMessage: 'Username and email are required'
    });
  }
  
  // Validate password if provided
  if (newPassword) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        developerMessage: 'Password does not meet requirements',
        httpStatusCode: '400',
        defaultUserMessage: 'Password must contain at least 8 characters with uppercase, lowercase, number, and special character'
      });
    }
  }
  
  // Check if user exists (mock validation)
  if (username === 'admin' && email === 'john.doe@example.com') {
    if (newPassword) {
      // Complete password reset with new password
      res.status(200).json({ 
        message: 'Password reset successful',
        username: username,
        email: email,
        resetCompleted: true
      });
    } else {
      // Initial password reset request (send email)
      res.status(200).json({ 
        message: 'Password reset instructions sent to your email',
        resetToken: 'mock-reset-token-' + Date.now(),
        emailSent: true
      });
    }
  } else {
    res.status(404).json({
      developerMessage: 'User not found',
      httpStatusCode: '404',
      defaultUserMessage: 'User not found with the provided credentials'
    });
  }
});

// Get user accounts
app.get('/fineract-provider/api/v1/self/clients/:clientId/accounts', async (req, res) => {
  logger('Getting accounts for client:', req.params.clientId);
  await addMockDelay();
  res.status(200).json(mockAccounts);
});

// Get client details
app.get('/fineract-provider/api/v1/self/clients/:clientId', async (req, res) => {
  logger('Getting client details for:', req.params.clientId);
  await addMockDelay();
  res.status(200).json(mockClient);
});

// Get recent transactions
app.get('/fineract-provider/api/v1/self/clients/:clientId/transactions', async (req, res) => {
  logger('Getting transactions for client:', req.params.clientId);
  await addMockDelay();
  res.status(200).json(mockTransactions);
});

// Get beneficiaries
app.get('/fineract-provider/api/v1/self/beneficiaries', async (req, res) => {
  logger('Getting beneficiaries');
  await addMockDelay();
  res.status(200).json(mockBeneficiaries);
});

// Get beneficiaries for TPT
app.get('/fineract-provider/api/v1/self/beneficiaries/tpt', async (req, res) => {
  logger('Getting TPT beneficiaries');
  await addMockDelay();
  res.status(200).json(mockBeneficiaries);
});

// Get charges
app.get('/fineract-provider/api/v1/self/clients/:clientId/charges', async (req, res) => {
  logger('Getting charges for client:', req.params.clientId);
  await addMockDelay();
  res.status(200).json(mockCharges);
});

// Get loan products template
app.get('/fineract-provider/api/v1/self/loans/template', async (req, res) => {
  const { templateType, clientId, productId } = req.query;
  logger('Getting loan template:', { templateType, clientId, productId });
  
  await addMockDelay();
  
  if (productId) {
    // Return specific product details
    const product = mockLoanProducts.find(p => p.id === parseInt(productId));
    if (product) {
      res.status(200).json({
        ...product,
        clientId: parseInt(clientId),
        dateFormat: 'dd MMMM yyyy',
        locale: 'en'
      });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } else {
    // Return all products
    res.status(200).json({
      productOptions: mockLoanProducts,
      clientId: parseInt(clientId),
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    });
  }
});

// Create new loan
app.post('/fineract-provider/api/v1/self/loans', async (req, res) => {
  logger('Creating new loan:', req.body);
  
  await addMockDelay();
  
  // Simulate loan creation
  const newLoan = {
    resourceId: Math.floor(Math.random() * 1000) + 100,
    resourceIdentifier: `LOAN${Date.now()}`,
    status: { id: 1, code: 'loanStatusType.submitted.and.pending.approval', value: 'Submitted and Pending Approval' },
    ...req.body
  };
  
  // Add to loan applications
  dataStore.loanApplications.push(newLoan);
  
  res.status(201).json(newLoan);
});

// Get transfer template
app.get('/fineract-provider/api/v1/self/accounttransfers/template', async (req, res) => {
  const { type } = req.query;
  logger('Getting transfer template:', { type });
  
  await addMockDelay();
  
  if (type === 'tpt') {
    // Return TPT-specific template
    res.status(200).json({
      ...mockTransferTemplate,
      transferType: 'tpt',
      tptBeneficiaries: mockBeneficiaries.pageItems
    });
  } else {
    // Return regular transfer template
    res.status(200).json(mockTransferTemplate);
  }
});

// Create new transfer
app.post('/fineract-provider/api/v1/self/accounttransfers', async (req, res) => {
  logger('Creating new transfer:', req.body);
  
  await addMockDelay();
  
  // Simulate transfer creation
  const newTransfer = {
    resourceId: Math.floor(Math.random() * 1000) + 200,
    resourceIdentifier: `TRANSFER${Date.now()}`,
    status: { id: 1, code: 'transferStatusType.pending', value: 'Pending' },
    ...req.body
  };
  
  // Add to transfer requests
  dataStore.transferRequests.push(newTransfer);
  
  res.status(201).json(newTransfer);
});

// Get account details by ID
app.get('/fineract-provider/api/v1/self/accounts/:accountType/:accountId', async (req, res) => {
  const { accountType, accountId } = req.params;
  logger('Getting account details:', { accountType, accountId });
  
  await addMockDelay();
  
  let account = null;
  
  switch (accountType) {
    case 'loans':
      account = mockAccounts.loanAccounts.find(a => a.id === parseInt(accountId));
      break;
    case 'savings':
      account = mockAccounts.savingsAccounts.find(a => a.id === parseInt(accountId));
      break;
    case 'shares':
      account = mockAccounts.shareAccounts.find(a => a.id === parseInt(accountId));
      break;
  }
  
  if (account) {
    res.status(200).json(account);
  } else {
    res.status(404).json({ message: 'Account not found' });
  }
});

// Get account transactions
app.get('/fineract-provider/api/v1/self/accounts/:accountType/:accountId/transactions', async (req, res) => {
  const { accountType, accountId } = req.params;
  logger('Getting account transactions:', { accountType, accountId });
  
  await addMockDelay();
  
  // Filter transactions by account
  const accountTransactions = {
    pageItems: mockTransactions.pageItems.filter(t => t.accountId === parseInt(accountId)),
    totalFilteredRecords: mockTransactions.pageItems.filter(t => t.accountId === parseInt(accountId)).length
  };
  
  res.status(200).json(accountTransactions);
});

// Get notifications
app.get('/fineract-provider/api/v1/self/notifications', async (req, res) => {
  logger('Getting notifications');
  await addMockDelay();
  res.status(200).json(mockNotifications);
});

// Mark notification as read
app.put('/fineract-provider/api/v1/self/notifications/:notificationId', async (req, res) => {
  const { notificationId } = req.params;
  logger('Marking notification as read:', { notificationId });
  
  await addMockDelay();
  
  const notification = mockNotifications.pageItems.find(n => n.id === parseInt(notificationId));
  if (notification) {
    notification.read = true;
    res.status(200).json(notification);
  } else {
    res.status(404).json({ message: 'Notification not found' });
  }
});

// Get user settings
app.get('/fineract-provider/api/v1/self/users/:userId/settings', async (req, res) => {
  const { userId } = req.params;
  logger('Getting user settings:', { userId });
  
  await addMockDelay();
  res.status(200).json(mockUserSettings);
});

// Update user settings
app.put('/fineract-provider/api/v1/self/users/:userId/settings', async (req, res) => {
  const { userId } = req.params;
  const settings = req.body;
  
  logger('Updating user settings:', { userId, settings });
  
  await addMockDelay();
  
  // Update settings
  Object.assign(mockUserSettings, settings);
  
  res.status(200).json(mockUserSettings);
});

// Get loan applications
app.get('/fineract-provider/api/v1/self/loans/applications', async (req, res) => {
  logger('Getting loan applications');
  await addMockDelay();
  res.status(200).json(mockLoanApplications);
});

// Get savings products
app.get('/fineract-provider/api/v1/self/savingsproducts', async (req, res) => {
  logger('Getting savings products');
  await addMockDelay();
  res.status(200).json({ pageItems: mockSavingsProducts, totalFilteredRecords: mockSavingsProducts.length });
});

// Create savings account
app.post('/fineract-provider/api/v1/self/savingsaccounts', async (req, res) => {
  logger('Creating savings account:', req.body);
  
  await addMockDelay();
  
  const newSavingsAccount = {
    resourceId: Math.floor(Math.random() * 1000) + 300,
    resourceIdentifier: `SAVINGS${Date.now()}`,
    ...req.body
  };
  
  res.status(201).json(newSavingsAccount);
});

// Get account statements
app.get('/fineract-provider/api/v1/self/accounts/:accountType/:accountId/statements', async (req, res) => {
  const { accountType, accountId } = req.params;
  logger('Getting account statements:', { accountType, accountId });
  
  await addMockDelay();
  
  const statements = {
    pageItems: [
      {
        id: 1,
        statementId: `STMT-${accountId}-2023-12`,
        statementDate: '2023-12-01',
        startDate: '2023-11-01',
        endDate: '2023-11-30',
        currency: { code: 'USD', name: 'US Dollar' },
        openingBalance: 4500,
        closingBalance: 5000,
        totalDeposits: 1000,
        totalWithdrawals: 500,
        totalFees: 10,
        totalInterest: 50,
        accountType: accountType,
        accountId: accountId
      }
    ],
    totalFilteredRecords: 1
  };
  
  res.status(200).json(statements);
});

// Get all account statements for client
app.get('/fineract-provider/api/v1/self/clients/:clientId/statements', async (req, res) => {
  const { clientId } = req.params;
  logger('Getting all account statements for client:', clientId);
  
  await addMockDelay();
  
  const statements = {
    pageItems: [
      {
        id: 1,
        statementId: 'STMT-3-2023-12',
        statementDate: '2023-12-01',
        startDate: '2023-11-01',
        endDate: '2023-11-30',
        currency: { code: 'USD', name: 'US Dollar' },
        openingBalance: 4500,
        closingBalance: 5000,
        totalDeposits: 1000,
        totalWithdrawals: 500,
        totalFees: 10,
        totalInterest: 50,
        accountType: 'savings',
        accountId: '3'
      },
      {
        id: 2,
        statementId: 'STMT-1-2023-12',
        statementDate: '2023-12-01',
        startDate: '2023-11-01',
        endDate: '2023-11-30',
        currency: { code: 'USD', name: 'US Dollar' },
        openingBalance: 8200,
        closingBalance: 8500,
        totalDeposits: 0,
        totalWithdrawals: 300,
        totalFees: 0,
        totalInterest: 0,
        accountType: 'loans',
        accountId: '1'
      }
    ],
    totalFilteredRecords: 2
  };
  
  res.status(200).json(statements);
});

// Get account statement PDF
app.get('/fineract-provider/api/v1/self/accounts/:accountType/:accountId/statements/:statementId', async (req, res) => {
  const { accountType, accountId, statementId } = req.params;
  logger('Getting account statement PDF:', { accountType, accountId, statementId });
  
  await addMockDelay();
  
  // Mock PDF response
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="statement-${statementId}.pdf"`);
  res.status(200).send('Mock PDF content');
});

// Get account standing instructions
app.get('/fineract-provider/api/v1/self/accounts/:accountType/:accountId/standinginstructions', async (req, res) => {
  const { accountType, accountId } = req.params;
  logger('Getting standing instructions:', { accountType, accountId });
  
  await addMockDelay();
  
  const standingInstructions = {
    pageItems: [
      {
        id: 1,
        name: 'Monthly Savings Transfer',
        instructionType: { id: 1, code: 'instructionType.standingInstruction', value: 'Standing Instruction' },
        status: { id: 1, code: 'standingInstructionStatusType.active', value: 'Active' },
        priority: { id: 1, code: 'priority.regular', value: 'Regular' },
        amount: 500,
        currency: { code: 'USD', name: 'US Dollar' },
        validFrom: '2023-01-01',
        validTill: '2024-12-31',
        recurrenceInterval: 1,
        recurrenceFrequency: { id: 2, code: 'frequencyType.months', value: 'Months' }
      }
    ],
    totalFilteredRecords: 1
  };
  
  res.status(200).json(standingInstructions);
});

// Get all standing instructions for client
app.get('/fineract-provider/api/v1/self/clients/:clientId/standinginstructions', async (req, res) => {
  const { clientId } = req.params;
  logger('Getting all standing instructions for client:', clientId);
  
  await addMockDelay();
  
  const standingInstructions = {
    pageItems: [
      {
        id: 1,
        name: 'Monthly Savings Transfer',
        instructionType: { id: 1, code: 'instructionType.standingInstruction', value: 'Standing Instruction' },
        status: { id: 1, code: 'standingInstructionStatusType.active', value: 'Active' },
        priority: { id: 1, code: 'priority.regular', value: 'Regular' },
        amount: 500,
        currency: { code: 'USD', name: 'US Dollar' },
        validFrom: '2023-01-01',
        validTill: '2024-12-31',
        recurrenceInterval: 1,
        recurrenceFrequency: { id: 2, code: 'frequencyType.months', value: 'Months' }
      },
      {
        id: 2,
        name: 'Weekly Loan Payment',
        instructionType: { id: 1, code: 'instructionType.standingInstruction', value: 'Standing Instruction' },
        status: { id: 1, code: 'standingInstructionStatusType.active', value: 'Active' },
        priority: { id: 1, code: 'priority.regular', value: 'Regular' },
        amount: 200,
        currency: { code: 'USD', name: 'US Dollar' },
        validFrom: '2023-06-01',
        validTill: '2025-06-01',
        recurrenceInterval: 1,
        recurrenceFrequency: { id: 1, code: 'frequencyType.weeks', value: 'Weeks' }
      }
    ],
    totalFilteredRecords: 2
  };
  
  res.status(200).json(standingInstructions);
});

// Create standing instruction
app.post('/fineract-provider/api/v1/self/standinginstructions', async (req, res) => {
  logger('Creating standing instruction:', req.body);
  
  await addMockDelay();
  
  const newStandingInstruction = {
    resourceId: Math.floor(Math.random() * 1000) + 400,
    resourceIdentifier: `SI${Date.now()}`,
    ...req.body
  };
  
  res.status(201).json(newStandingInstruction);
});

// Update standing instruction
app.put('/fineract-provider/api/v1/self/standinginstructions/:instructionId', async (req, res) => {
  const { instructionId } = req.params;
  logger('Updating standing instruction:', { instructionId, body: req.body });
  
  await addMockDelay();
  
  const updatedInstruction = {
    id: parseInt(instructionId),
    ...req.body
  };
  
  res.status(200).json(updatedInstruction);
});

// Delete standing instruction
app.delete('/fineract-provider/api/v1/self/standinginstructions/:instructionId', async (req, res) => {
  const { instructionId } = req.params;
  logger('Deleting standing instruction:', instructionId);
  
  await addMockDelay();
  
  res.status(200).json({ 
    message: 'Standing instruction deleted successfully',
    instructionId: instructionId
  });
});

// Health check
app.get('/health', async (req, res) => {
  await addMockDelay();
  res.status(200).json({ 
    status: 'OK', 
    message: 'Enhanced mock server is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    features: [
      'Enhanced Authentication',
      'User Settings Management',
      'Notifications System',
      'Account Statements',
      'Standing Instructions',
      'Savings Products',
      'Loan Applications',
      'Mock Delays',
      'Enhanced Logging'
    ]
  });
});

// Server configuration endpoint
app.get('/config', async (req, res) => {
  await addMockDelay();
  res.status(200).json({
    config,
    dataStore: {
      notificationsCount: dataStore.notifications.length,
      pendingTransactionsCount: dataStore.pendingTransactions.length,
      loanApplicationsCount: dataStore.loanApplications.length,
      transferRequestsCount: dataStore.transferRequests.length
    }
  });
});

// Reset server data endpoint
app.post('/reset', async (req, res) => {
  logger('Resetting server data');
  
  // Reset data store
  dataStore.notifications = [];
  dataStore.userSettings = {};
  dataStore.pendingTransactions = [];
  dataStore.loanApplications = [];
  dataStore.transferRequests = [];
  
  // Reset user state
  mockUser.failedLoginAttempts = 0;
  mockUser.accountLocked = false;
  
  await addMockDelay();
  res.status(200).json({ message: 'Server data reset successfully' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger('Error:', err);
  res.status(500).json({
    developerMessage: 'Internal server error',
    httpStatusCode: '500',
    defaultUserMessage: 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  logger('404 - Route not found:', `${req.method} ${req.url}`);
  res.status(404).json({
    developerMessage: 'Route not found',
    httpStatusCode: '404',
    defaultUserMessage: 'The requested resource was not found',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Enhanced Mock Server running on http://localhost:${PORT}`);
  console.log('\n📋 Available endpoints:');
  console.log('🔐 Authentication:');
  console.log('  - POST /fineract-provider/api/v1/self/authentication');
  console.log('  - POST /fineract-provider/api/v1/self/authentication/logout');
  console.log('  - POST /fineract-provider/api/v1/self/users/:userId/password');
  console.log('  - POST /fineract-provider/api/v1/self/users/password');
  console.log('\n👤 User Management:');
  console.log('  - GET /fineract-provider/api/v1/self/clients/:clientId');
  console.log('  - GET /fineract-provider/api/v1/self/users/:userId/settings');
  console.log('  - PUT /fineract-provider/api/v1/self/users/:userId/settings');
  console.log('\n💰 Accounts & Transactions:');
  console.log('  - GET /fineract-provider/api/v1/self/clients/:clientId/accounts');
  console.log('  - GET /fineract-provider/api/v1/self/clients/:clientId/transactions');
  console.log('  - GET /fineract-provider/api/v1/self/accounts/:accountType/:accountId');
  console.log('  - GET /fineract-provider/api/v1/self/accounts/:accountType/:accountId/transactions');
  console.log('  - GET /fineract-provider/api/v1/self/accounts/:accountType/:accountId/statements');
  console.log('  - GET /fineract-provider/api/v1/self/accounts/:accountType/:accountId/statements/:statementId');
  console.log('\n🏦 Banking Services:');
  console.log('  - GET /fineract-provider/api/v1/self/beneficiaries');
  console.log('  - GET /fineract-provider/api/v1/self/beneficiaries/tpt');
  console.log('  - GET /fineract-provider/api/v1/self/clients/:clientId/charges');
  console.log('  - GET /fineract-provider/api/v1/self/loans/template');
  console.log('  - POST /fineract-provider/api/v1/self/loans');
  console.log('  - GET /fineract-provider/api/v1/self/loans/applications');
  console.log('  - GET /fineract-provider/api/v1/self/savingsproducts');
  console.log('  - POST /fineract-provider/api/v1/self/savingsaccounts');
  console.log('  - GET /fineract-provider/api/v1/self/accounttransfers/template');
  console.log('  - POST /fineract-provider/api/v1/self/accounttransfers');
  console.log('  - GET /fineract-provider/api/v1/self/accounts/:accountType/:accountId/standinginstructions');
  console.log('  - POST /fineract-provider/api/v1/self/standinginstructions');
  console.log('\n🔔 Notifications:');
  console.log('  - GET /fineract-provider/api/v1/self/notifications');
  console.log('  - PUT /fineract-provider/api/v1/self/notifications/:notificationId');
  console.log('\n⚙️ Server Management:');
  console.log('  - GET /health');
  console.log('  - GET /config');
  console.log('  - POST /reset');
  console.log('\n🔑 Test credentials:');
  console.log('  Username: admin');
  console.log('  Password: password');
  console.log('\n✨ Enhanced Features:');
  console.log('  - Mock delays for realistic API simulation');
  console.log('  - Enhanced logging with timestamps');
  console.log('  - User settings management');
  console.log('  - Notification system');
  console.log('  - Account statements and PDFs');
  console.log('  - Standing instructions');
  console.log('  - Loan applications tracking');
  console.log('  - Transfer request tracking');
  console.log('  - Password management');
  console.log('  - Server configuration and reset');
}); 