<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# AI Financial Advisor Project Instructions

This project is an AI-powered financial advisor application for the Indian stock market built with Next.js, TypeScript, and Tailwind CSS.

## Key Components:
- **InvestmentForm**: User input form for investment parameters
- **PortfolioResults**: Display component for portfolio recommendations  
- **portfolioGenerator**: Core algorithm for generating stock allocations
- **marketData**: Mock stock data for NSE/BSE listed companies

## Coding Guidelines:
- Use TypeScript with strict typing for all components
- Follow Next.js 13+ App Router conventions
- Use Tailwind CSS for styling with consistent design patterns
- Implement proper error handling and loading states
- Ensure responsive design for mobile and desktop

## Data Structure:
- Focus on Indian stock market (NSE tickers like TCS.NS, RELIANCE.NS)
- Support risk preferences: low, moderate, high
- Generate realistic expected returns based on duration (3/6 months)
- Include proper rationale for each stock selection

## Financial Logic:
- Use scoring algorithm based on PE ratio, dividend yield, beta, market cap
- Apply sector-wise allocation based on risk preference
- Generate confidence levels and portfolio notes
- Provide actionable recommendations and disclaimers
