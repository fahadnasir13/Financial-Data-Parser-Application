# Financial Data Parser

An enterprise-grade financial data parsing application built with Next.js, TypeScript, and modern web technologies. This application provides intelligent parsing of financial data with confidence scoring, comprehensive filtering, and visual analytics.

## 🚀 Features

### Core Functionality
- **Smart Financial Parsing**: Supports US, European, Indian, and abbreviated number formats
- **Type Detection**: Automatically detects currency, percentage, number, date, and text data types
- **Confidence Scoring**: AI-powered confidence assessment for parsed values
- **Multi-format Import**: CSV, JSON, and manual data entry support
- **Real-time Processing**: Instant parsing and validation with progress indicators

### Data Management
- **Advanced Filtering**: Filter by type, confidence score, and search queries
- **Range Search**: Date range and numerical range filtering capabilities
- **Data Export**: Export processed data in CSV and JSON formats
- **Persistent Storage**: Browser-based storage with automatic save/restore

### Visualization & Analytics
- **Interactive Charts**: Pie charts, bar charts, and distribution analysis
- **Data Quality Metrics**: Confidence distribution and format analysis
- **Real-time Insights**: Live statistics and data quality assessment
- **Responsive Design**: Optimized for desktop and mobile viewing

### Technical Excellence
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Error Handling**: Comprehensive error boundaries and validation
- **Testing Suite**: Unit tests, integration tests, and API testing
- **Performance**: Optimized rendering with React 18 and Next.js 13

## 🛠 Technology Stack

### Frontend
- **Next.js 13**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Modern component library
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: Data visualization library

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Custom Parsing Engine**: Advanced financial data processing
- **In-memory Storage**: Fast data operations with persistence

### Testing & Quality
- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing
- **TypeScript**: Static type checking
- **ESLint**: Code quality and consistency

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/financial-data-parser.git
   cd financial-data-parser
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage
- **Unit Tests**: Individual component and function testing
- **Integration Tests**: Full application workflow testing
- **API Tests**: Backend parsing engine validation
- **Context Tests**: State management verification

## 🏗 Project Structure

```
financial-data-parser/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   ├── DataImport.tsx    # Data import interface
│   ├── DataTable.tsx     # Data display table
│   ├── DataVisualization.tsx # Charts and analytics
│   └── ParsingEngine.tsx # Parsing status display
├── contexts/             # React contexts
│   └── FinancialDataContext.tsx # Global state management
├── hooks/                # Custom React hooks
│   └── use-toast.ts      # Toast notifications
├── lib/                  # Utility functions
│   └── utils.ts          # Helper utilities
├── __tests__/            # Test files
│   ├── components/       # Component tests
│   ├── contexts/         # Context tests
│   ├── api/             # API tests
│   └── integration/     # Integration tests
└── types/               # TypeScript type definitions
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for local development:

```env
# Add any environment-specific variables here
NEXT_PUBLIC_APP_NAME=Financial Data Parser
```

### Tailwind Configuration
The application uses a custom Tailwind configuration with:
- Custom color palette for financial data visualization
- Extended spacing and typography scales
- Dark mode support
- Animation utilities

## 📊 Parsing Engine

### Supported Formats

#### Currency Formats
- **US Format**: `$1,234.56`, `$1,000,000.00`
- **European Format**: `€1.234,56`, `€1.000.000,00`
- **Indian Format**: `₹1,23,456.78`, `₹10,00,000.00`
- **Negative Values**: `-$500.00`, `($500.00)`

#### Number Formats
- **Abbreviated**: `2.5K`, `1.2M`, `3.5B`
- **Percentages**: `15.5%`, `-2.3%`, `100%`
- **Scientific**: `1.23e+6`, `4.56E-3`
- **Fractions**: `1/2`, `3/4`, `22/7`

#### Date Formats
- **US Format**: `03/15/2024`, `12/31/2023`
- **ISO Format**: `2024-03-15`, `2023-12-31`
- **Named Months**: `Mar 15, 2024`, `December 31, 2023`

### Confidence Scoring
- **90-100%**: High confidence, well-formatted data
- **70-89%**: Medium confidence, minor formatting issues
- **50-69%**: Low confidence, ambiguous formatting
- **Below 50%**: Very low confidence, likely text data

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#0ea5e9) - Trust and reliability
- **Secondary**: Emerald (#10b981) - Success and growth
- **Accent**: Orange (#f97316) - Energy and attention
- **Supporting**: Purple (#8b5cf6), Red (#ef4444), Gray (#6b7280)

### Typography
- **Headings**: Inter font family, multiple weights
- **Body**: Optimized line height (1.5) for readability
- **Code**: Monospace font for data display

### Components
- **Cards**: Elevated surfaces with subtle shadows
- **Buttons**: Multiple variants with hover states
- **Forms**: Accessible inputs with validation
- **Tables**: Responsive data display with sorting
- **Charts**: Interactive visualizations with tooltips

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Static Export
The application is configured for static export:
```bash
npm run build && npm run export
```

### Deployment Platforms
- **Vercel**: Optimized for Next.js applications
- **Netlify**: Static site hosting with form handling
- **GitHub Pages**: Free hosting for open source projects

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure accessibility compliance
- Maintain responsive design

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn/ui**: Beautiful and accessible component library
- **Recharts**: Powerful charting library for React
- **Framer Motion**: Smooth animations and gestures
- **Tailwind CSS**: Utility-first CSS framework
- **Next.js**: The React framework for production

## 📞 Support

For support, email support@financialparser.com or join our Slack channel.

## 🔄 Changelog

### Version 1.0.0
- Initial release with core parsing functionality
- Support for multiple financial formats
- Interactive data visualization
- Comprehensive test suite
- Production-ready deployment configuration

---

Built with ❤️ by the Financial Data Parser Team