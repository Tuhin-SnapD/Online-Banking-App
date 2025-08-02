const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock user data
const mockUser = {
  authenticated: true,
  base64EncodedAuthenticationKey: 'c2VsZnNlcnZpY2VfaW1vYmlsZTpwYXNzd29yZA==', // base64 of "selfservice_imobile:password"
  clients: [1],
  isSelfServiceUser: true,
  officeId: 1,
  officeName: 'Head Office',
  userId: 1,
  username: 'selfservice_imobile',
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
    'READ_CHARGE'
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
      totalOutstanding: 8500
    }
  ],
  savingsAccounts: [
    {
      id: 2,
      accountNo: '000000002',
      productId: 2,
      productName: 'Savings Account',
      status: { id: 100, code: 'savingsAccountStatusType.active', value: 'Active' },
      currency: { code: 'USD', name: 'US Dollar' },
      accountBalance: 5000,
      availableBalance: 5000,
      totalDeposits: 10000,
      totalWithdrawals: 5000
    }
  ],
  shareAccounts: [
    {
      id: 3,
      accountNo: '000000003',
      productId: 3,
      productName: 'Share Account',
      status: { id: 100, code: 'shareAccountStatusType.active', value: 'Active' },
      currency: { code: 'USD', name: 'US Dollar' },
      totalShares: 100,
      totalSharesIssued: 100,
      totalSharesPendingForApproval: 0,
      totalSharesApproved: 100
    }
  ]
};

// Authentication endpoint
app.post('/fineract-provider/api/v1/self/authentication', (req, res) => {
  const { username, password } = req.body;
  
  console.log('Login attempt:', { username, password });
  
  if (username === 'selfservice_imobile' && password === 'password') {
    res.status(200).json(mockUser);
  } else {
    res.status(401).json({
      developerMessage: 'Invalid username or password',
      httpStatusCode: '401',
      defaultUserMessage: 'Invalid username or password'
    });
  }
});

// Get user accounts
app.get('/fineract-provider/api/v1/self/clients/:clientId/accounts', (req, res) => {
  res.status(200).json(mockAccounts);
});

// Get client details
app.get('/fineract-provider/api/v1/self/clients/:clientId', (req, res) => {
  res.status(200).json({
    id: 1,
    accountNo: '000000001',
    status: { id: 300, code: 'clientStatusType.active', value: 'Active' },
    active: true,
    activationDate: '2023-01-01',
    firstname: 'John',
    lastname: 'Doe',
    displayName: 'John Doe',
    officeId: 1,
    officeName: 'Head Office'
  });
});

// Get recent transactions
app.get('/fineract-provider/api/v1/self/clients/:clientId/transactions', (req, res) => {
  res.status(200).json({
    pageItems: [
      {
        id: 1,
        transactionType: { id: 1, code: 'transactionType.deposit', value: 'Deposit' },
        amount: 1000,
        date: '2023-12-01',
        currency: { code: 'USD', name: 'US Dollar' },
        reversed: false
      },
      {
        id: 2,
        transactionType: { id: 2, code: 'transactionType.withdrawal', value: 'Withdrawal' },
        amount: 500,
        date: '2023-11-30',
        currency: { code: 'USD', name: 'US Dollar' },
        reversed: false
      }
    ],
    totalFilteredRecords: 2
  });
});

// Get beneficiaries
app.get('/fineract-provider/api/v1/self/beneficiaries', (req, res) => {
  res.status(200).json({
    pageItems: [
      {
        id: 1,
        accountType: { id: 1, code: 'beneficiaryType.external', value: 'External' },
        accountNumber: '1234567890',
        accountTypeName: 'Savings Account',
        transferLimit: 10000,
        name: 'Jane Smith',
        officeName: 'Branch Office'
      }
    ],
    totalFilteredRecords: 1
  });
});

// Get charges
app.get('/fineract-provider/api/v1/self/clients/:clientId/charges', (req, res) => {
  res.status(200).json({
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
        dueDate: '2023-12-31'
      }
    ],
    totalFilteredRecords: 1
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Mock server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- POST /fineract-provider/api/v1/self/authentication');
  console.log('- GET /fineract-provider/api/v1/self/clients/:clientId/accounts');
  console.log('- GET /fineract-provider/api/v1/self/clients/:clientId');
  console.log('- GET /fineract-provider/api/v1/self/clients/:clientId/transactions');
  console.log('- GET /fineract-provider/api/v1/self/beneficiaries');
  console.log('- GET /fineract-provider/api/v1/self/clients/:clientId/charges');
}); 