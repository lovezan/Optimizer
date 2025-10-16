# Amazon Listing Optimizer

A full-stack web application that uses AI to optimize Amazon product listings by fetching product details and generating improved titles, bullet points, descriptions, and keyword suggestions.

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MySQL
- **AI Provider**: OpenRouter API (DeepSeek R1T2 Chimera Free Model)
- **Web Scraping**: Cheerio

## Features

- Fetch Amazon product details directly from ASIN
- AI-powered optimization of:
  - Product titles (keyword-rich and readable)
  - Bullet points (clear and concise)
  - Product descriptions (persuasive and compliant)
  - Keyword suggestions (3-5 new keywords)
- Side-by-side comparison of original vs optimized listings
- Complete optimization history tracking for each ASIN
- Clean, modern UI with responsive design

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MySQL Server (v8.0 or higher)
- OpenRouter API Key (provided)

### 1. Database Setup

First, create the MySQL database:

```bash
mysql -u root -p
```

Then run the setup script:

```sql
source server/setup-db.sql
```

Or manually create the database:

```bash
mysql -u root -p < server/setup-db.sql
```

### 2. Environment Configuration

The `.env` file is already configured with:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Talib@6229
DB_NAME=amazon_optimizer

# OpenRouter API
OPENROUTER_API_KEY=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
```

### 3. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ..
npm install
```

### 4. Start the Application

#### Terminal 1 - Start Backend Server

```bash
cd server
npm run dev
```

The backend server will start on `http://localhost:3000`

#### Terminal 2 - Start Frontend Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### 5. Access the Application

Open your browser and navigate to: `http://localhost:5173`

## How to Use

1. **Enter an ASIN**: Type a valid 10-character Amazon ASIN (e.g., `B08N5WRWNW`)
2. **Click Optimize**: The app will:
   - Fetch product details from Amazon
   - Send data to AI for optimization
   - Display original vs optimized versions side-by-side
   - Save results to MySQL database
3. **View History**: Click the "History" button to see all past optimizations for an ASIN

## Project Structure

```
amazon-optimizer/
├── server/
│   ├── server.js          # Express server & API routes
│   ├── database.js        # MySQL connection & queries
│   ├── scraper.js         # Amazon product scraper
│   ├── ai.js              # OpenRouter AI integration
│   ├── setup-db.sql       # Database schema
│   └── package.json       # Backend dependencies
├── src/
│   ├── components/
│   │   ├── OptimizationResult.tsx  # Side-by-side comparison
│   │   └── HistoryView.tsx         # Optimization history
│   ├── types.ts           # TypeScript interfaces
│   ├── App.tsx            # Main React component
│   └── main.tsx           # React entry point
├── .env                   # Environment variables
└── README.md
```

## API Endpoints

### POST `/api/optimize`

Fetch and optimize an Amazon product listing.

**Request:**
```json
{
  "asin": "B08N5WRWNW"
}
```

**Response:**
```json
{
  "id": 1,
  "asin": "B08N5WRWNW",
  "original_title": "...",
  "original_bullets": ["..."],
  "original_description": "...",
  "optimized_title": "...",
  "optimized_bullets": ["..."],
  "optimized_description": "...",
  "keywords": ["..."]
}
```

### GET `/api/history/:asin`

Retrieve optimization history for a specific ASIN.

**Response:**
```json
[
  {
    "id": 1,
    "asin": "B08N5WRWNW",
    "original_title": "...",
    "optimized_title": "...",
    "created_at": "2025-10-16T12:00:00.000Z",
    ...
  }
]
```

### GET `/api/optimizations`

Get the most recent 50 optimizations across all ASINs.

## AI Prompt Strategy

The AI optimization prompt is structured to:

1. **Provide Context**: Give the AI the role of an Amazon listing expert
2. **Input Original Data**: Supply the fetched product title, bullets, and description
3. **Define Clear Tasks**: Specify exactly what to optimize (title, bullets, description, keywords)
4. **Set Constraints**:
   - Character limits for titles (50-200 chars)
   - Number of bullet points (5)
   - Description length (150-300 words)
   - Keyword count (3-5)
5. **Enforce Best Practices**:
   - Include keywords naturally
   - Focus on customer benefits
   - Maintain Amazon compliance
   - Ensure readability
6. **Request JSON Output**: Enforce structured response for easy parsing

## Database Schema

### `optimizations` Table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key (auto-increment) |
| asin | VARCHAR(20) | Amazon Standard Identification Number |
| original_title | TEXT | Original product title |
| original_bullets | TEXT | Original bullet points (JSON array) |
| original_description | TEXT | Original product description |
| optimized_title | TEXT | AI-optimized title |
| optimized_bullets | TEXT | AI-optimized bullets (JSON array) |
| optimized_description | TEXT | AI-optimized description |
| keywords | TEXT | Suggested keywords (JSON array) |
| created_at | TIMESTAMP | Record creation timestamp |

Indexes:
- `idx_asin`: Fast lookups by ASIN
- `idx_created_at`: Efficient sorting by date

## Design Decisions

### Web Scraping Approach

- **Cheerio**: Lightweight HTML parser for extracting product data
- **User-Agent Spoofing**: Mimic browser requests to avoid blocking
- **Robust Selectors**: Multiple fallback selectors for reliability
- **Error Handling**: Graceful degradation if data is missing

### AI Integration

- **OpenRouter**: Unified API access to multiple AI models
- **Free Model**: Using DeepSeek R1T2 Chimera for cost-free operation
- **JSON Response**: Structured output for reliable parsing
- **Retry Logic**: JSON extraction with regex fallback

### Database Design

- **JSON Storage**: Store arrays as JSON strings for flexibility
- **Timestamps**: Track when each optimization occurred
- **Indexes**: Optimize queries by ASIN and date
- **History Tracking**: Never delete records for complete audit trail

### Frontend Architecture

- **Component Separation**: Modular components for maintainability
- **TypeScript**: Type safety across the application
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Loading States**: Clear feedback during async operations
- **Error Handling**: User-friendly error messages

## Testing Recommendations

1. **Test with Valid ASINs**: Try popular products like `B08N5WRWNW` (Amazon Echo)
2. **Check History**: Optimize the same ASIN multiple times to verify history
3. **Error Cases**: Test invalid ASINs to see error handling
4. **Database**: Verify data persistence by checking MySQL directly

## Troubleshooting

### MySQL Connection Issues

```bash
# Check MySQL is running
sudo systemctl status mysql

# Verify credentials
mysql -u root -p
```

### Amazon Scraping Blocked

Amazon may block requests from certain IPs. Solutions:
- Use a VPN
- Add delays between requests
- Consider using Amazon Product Advertising API for production

### AI API Errors

Check the OpenRouter API status and your API key validity at: https://openrouter.ai/

## Future Enhancements

- Add A/B testing comparison metrics
- Implement keyword ranking analysis
- Export optimizations to CSV/PDF
- Bulk ASIN processing
- Image optimization suggestions
- Competitive analysis features
- Amazon Product Advertising API integration
- Caching layer for frequently accessed ASINs

## License

MIT
