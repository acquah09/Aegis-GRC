# GRC Project - Governance, Risk & Compliance Platform

A comprehensive Governance, Risk Management, and Compliance (GRC) platform built with modern web technologies.

## 🚀 Features

### 📊 Risk Management
- Risk assessment and evaluation
- Centralized risk register
- Automated risk scoring based on impact and likelihood
- Risk categorization and tracking

### 🔐 Authentication
- Secure user authentication
- Session management
- Password recovery

### 📈 Dashboard
- Real-time metrics
- Data visualizations
- Export-ready reports

## 🛠️ Technology Stack

- **Next.js**: 16.1.6
- **React**: 19.2.3
- **TypeScript**: 5.x
- **Tailwind CSS**: 4.x
- **Supabase**: 2.93.3
- **TanStack Query**: 5.90.20
- **React Hook Form**: 7.71.1
- **Zod**: 4.3.6

## 📦 Installation

1. Clone the repository
   ```bash
   git clone https://github.com/acquah09/Aegis-GRC.git
   cd GRC-Project
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/          # Main dashboard
│   ├── risks/             # Risk management
│   └── layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── charts.tsx        # Data visualizations
├── lib/                  # Utility functions
└── types/                # TypeScript definitions
```

##  Usage

1. Sign up for an account
2. Add your first risk assessment
3. View dashboard metrics and visualizations
4. Export reports as needed

## 🚀 Deployment

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 🗺️ Roadmap

### Planned Features
- [ ] Advanced compliance management
- [ ] Framework integration
- [ ] Multi-tenant support
- [ ] API integrations
- [ ] Mobile application
- [ ] Advanced analytics and AI insights

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

Report issues on [GitHub Issues](https://github.com/acquah09/Aegis-GRC/issues).

---

Built with Next.js, TypeScript, and Supabase.
