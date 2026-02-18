# Aegis GRC - Governance, Risk & Compliance Platform

A comprehensive Governance, Risk Management, and Compliance (GRC) platform built with Next.js 13, TypeScript, and Supabase. Aegis GRC helps organizations manage their risk assessments, compliance frameworks, and internal controls in a unified, user-friendly interface.

## 🚀 Features

### 📊 Risk Management
- **Risk Assessment**: Comprehensive risk identification and evaluation
- **Risk Register**: Centralized repository for all organizational risks
- **Risk Scoring**: Automated risk level calculation based on impact and likelihood
- **Risk Categories**: Organized categorization for different risk types
- **Visual Analytics**: Risk distribution charts and trend analysis

### 🛡️ Compliance Management
- **Framework Integration**: Support for multiple compliance frameworks
- **Compliance Tracking**: Monitor compliance status across regulations
- **Audit Trail**: Complete history of compliance activities
- **Reporting**: Export-ready compliance reports for management

### 🔐 Authentication & Security
- **Secure Authentication**: Supabase-based user authentication
- **Role-Based Access**: User permissions and access control
- **Session Management**: Secure session handling
- **Password Recovery**: Forgot password functionality

### 📈 Dashboard & Analytics
- **Real-time Metrics**: Live dashboard with key performance indicators
- **Data Visualizations**: Interactive charts and graphs
- **Management Reports**: Export-ready visualizations for stakeholders
- **Progressive Experience**: Clean slate for new users, growing with data

### 🎨 User Experience
- **Modern UI**: Beautiful glass morphism design with Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support**: Optimized for different lighting conditions
- **Accessibility**: WCAG compliant interface

## 🛠️ Technology Stack

### Frontend
- **Next.js 13**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **React Hook Form**: Form management with validation
- **Zod**: Schema validation

### Backend & Database
- **Supabase**: Backend-as-a-Service with PostgreSQL
- **Authentication**: Supabase Auth for user management
- **Database**: PostgreSQL with real-time subscriptions
- **Storage**: Supabase Storage for file uploads

### UI Components
- **shadcn/ui**: High-quality component library
- **Radix UI**: Unstyled, accessible components
- **Class Variance Authority**: Type-safe component variants

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/acquah09/Aegis-GRC.git
   cd Aegis-GRC
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Database Setup**
   - Set up your Supabase project
   - Run the provided SQL schema in Supabase SQL Editor
   - Configure authentication settings

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   │   ├── sign-in/       # Sign in page
│   │   ├── sign-up/       # Sign up page
│   │   └── forgot-password/ # Password recovery
│   ├── dashboard/          # Main dashboard
│   ├── risks/             # Risk management pages
│   ├── compliance/        # Compliance management
│   └── layout.tsx        # Root layout
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── charts.tsx         # Data visualizations
│   ├── header.tsx         # Navigation header
│   └── forms/            # Form components
├── lib/                  # Utility functions
│   ├── supabase/         # Supabase client
│   └── session.ts        # Session management
└── types/                # TypeScript type definitions
```

## 🔧 Configuration

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key

### Database Schema
The application uses the following main tables:
- `users`: User profiles and metadata
- `risks`: Risk assessments and evaluations
- `controls`: Internal controls and mitigations
- `frameworks`: Compliance frameworks
- `compliance_records`: Compliance tracking

## 📚 Usage

### Getting Started

1. **Sign Up**: Create a new account with your first and last name
2. **Risk Assessment**: Add your first risk to establish your risk profile
3. **Dashboard**: View real-time metrics and visualizations
4. **Compliance**: Track compliance across different frameworks
5. **Reports**: Export data for management presentations

### Key Features

#### Risk Management
- Navigate to **Risk Management** to add new risks
- Use the **Risk Assessment Form** to evaluate potential risks
- View all risks in the **Risk Register**
- Monitor risk levels with color-coded indicators

#### Dashboard Analytics
- **Risk Distribution**: Visual breakdown of risk levels
- **Trend Analysis**: Monthly trends for risks and controls
- **Compliance Metrics**: Real-time compliance status
- **Management Reports**: Export-ready visualizations

#### User Management
- **Profile Management**: Update user information
- **Session Security**: Secure sign-in and sign-out
- **Password Recovery**: Reset forgotten passwords

## 🎨 Design System

### Color Scheme
- **Primary**: Teal-600 (`#0D9488`)
- **Background**: Glass morphism with backdrop blur
- **Text**: Black text inside cards for readability
- **Risk Levels**: Red (High), Yellow (Medium), Green (Low)

### Component Library
- Built with **shadcn/ui** components
- Custom variants for consistent styling
- Responsive design patterns
- Accessibility-first approach

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
1. **Vercel**: Connect your GitHub repository
2. **Supabase**: Configure production database
3. **Environment Variables**: Set production environment variables
4. **Deploy**: Automatic deployment on push to main

### Docker Support
```bash
docker build -t aegis-grc .
docker run -p 3000:3000 aegis-grc
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README and code comments
- **Issues**: Report bugs on [GitHub Issues](https://github.com/acquah09/Aegis-GRC/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/acquah09/Aegis-GRC/discussions)

### Common Issues

#### Authentication Problems
- Verify Supabase configuration
- Check environment variables
- Ensure CORS settings are correct

#### Database Issues
- Run database migrations
- Check table permissions
- Verify connection strings

#### Build Errors
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify environment variables

## 🗺️ Roadmap

### Upcoming Features
- [ ] Advanced reporting with PDF export
- [ ] Multi-tenant support
- [ ] API integrations for external systems
- [ ] Advanced analytics and AI insights
- [ ] Mobile application
- [ ] Workflow automation
- [ ] Audit logging and compliance tracking

### Version History
- **v1.0.0**: Initial release with core GRC functionality
- **v1.1.0**: Enhanced visualizations and reporting
- **v1.2.0**: Improved user experience and onboarding

## 📞 Contact

- **Project Maintainer**: [Emmanuel Acquah](https://github.com/acquah09)
- **Email**: [Contact Form](https://github.com/acquah09)
- **LinkedIn**: [Professional Profile](https://linkedin.com/in/)

---

**Aegis GRC** - Your comprehensive solution for Governance, Risk & Compliance management.

Built with ❤️ using Next.js, TypeScript, and Supabase.
