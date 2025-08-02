# Online Banking App

A modern, feature-rich online banking application built with Angular 15. This application provides a comprehensive banking experience with account management, transfers, loans, and more.

## 🚀 Features

- **Account Management**: View and manage savings, loan, and share accounts
- **Fund Transfers**: Transfer money between accounts with review functionality
- **Third Party Transfers (TPT)**: Send money to external beneficiaries
- **Loan Applications**: Apply for loans with validation
- **Transaction History**: View recent transactions across all accounts
- **Beneficiary Management**: Add and manage transfer beneficiaries
- **Charges Overview**: Monitor account charges and fees
- **Responsive Design**: Mobile-friendly interface with Material Design
- **Authentication**: Secure login with session management
- **Multi-language Support**: Internationalization ready

## 🛠️ Technology Stack

- **Frontend**: Angular 15.2.9
- **UI Framework**: Angular Material 15.2.9
- **Styling**: SCSS with Flex Layout
- **Charts**: Chart.js and CanvasJS
- **Icons**: FontAwesome
- **State Management**: RxJS
- **Build Tool**: Angular CLI 15.2.9
- **Package Manager**: npm

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)

## 🚀 Getting Started

### 1. Install Angular CLI

```bash
npm install -g @angular/cli@15.2.9
```

### 2. Clone the Repository

```bash
git clone https://github.com/Tuhin-SnapD/Online-Banking-App.git
cd Online-Banking-App
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
ng serve
# or
npm start
```

Navigate to `http://localhost:4200/` to view the application.

### 5. Default Login Credentials

The application uses a development server with basic authentication:

- **Username**: `selfservice_imobile`
- **Password**: `password`

> **Important**: These are development credentials. Do not use in production.

## 📁 Project Structure

```
src/
├── app/
│   ├── accounts/          # Account management modules
│   ├── beneficiaries/     # Beneficiary management
│   ├── charges/          # Charges and fees
│   ├── core/             # Core services and guards
│   ├── home/             # Dashboard and overview
│   ├── loans/            # Loan application
│   ├── login/            # Authentication
│   ├── transfers/        # Fund transfers
│   ├── tpt/              # Third party transfers
│   └── shared/           # Shared components and modules
├── assets/               # Static assets
├── environments/         # Environment configurations
└── translations/         # Internationalization files
```

## 🏗️ Build Commands

### Development Build
```bash
ng build
```

### Production Build
```bash
ng build --configuration production
```

### GitHub Pages Deployment
```bash
npm run deploy
```

## 🧪 Testing

### Unit Tests
```bash
ng test
```

### End-to-End Tests
```bash
ng e2e
```

### Linting
```bash
ng lint
```

## 🔧 Development

### Generate New Components
```bash
ng generate component component-name
```

### Generate Services
```bash
ng generate service service-name
```

### Generate Modules
```bash
ng generate module module-name
```

## 📱 Features Overview

### Dashboard
- Account balance overview
- Recent transactions
- Quick action buttons
- Charts and analytics

### Account Management
- View account details
- Transaction history
- Account statements
- Balance information

### Transfers
- Internal transfers between accounts
- Third-party transfers
- Beneficiary management
- Transfer history

### Loans
- Loan application form
- Loan status tracking
- Payment schedules
- Loan history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

This project was developed by a team of 4 developers inspired by existing banking models.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.

---

**Note**: This is a demonstration application and should not be used for actual banking operations.

