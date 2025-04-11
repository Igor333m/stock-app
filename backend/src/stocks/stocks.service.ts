import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

// Define interfaces for the API responses
interface FinnhubSearchResult {
  count: number;
  result: Array<{
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
    exchange?: string;
  }>;
}

interface FinnhubQuote {
  c: number;  // Current price
  d: number;  // Change
  dp: number; // Percent change
  h: number;  // High price of the day
  l: number;  // Low price of the day
  o: number;  // Open price of the day
  pc: number; // Previous close price
}

interface FinnhubCompanyProfile {
  country: string;
  currency: string;
  exchange: string;
  finnhubIndustry: string;
  ipo: string;
  logo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  type?: string;
}

@Injectable()
export class StocksService {
  // Queue for handling API requests with rate limits
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  private async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;
    
    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
          // Wait 200ms between requests to avoid hitting Finnhub rate limits
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          console.error('Error processing API request:', error);
        }
      }
    }

    this.isProcessingQueue = false;
  }

  private enqueueRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  private async finnhubRequest<T>(url: string): Promise<T> {
    const apiKey = this.configService.get<string>('FINNHUB_API_KEY');
    return this.enqueueRequest(() => 
      axios.get(`${url}&token=${apiKey}`).then(response => response.data as T)
    );
  }

  async searchStocks(query: string, exchange: string) {
    try {
      // Add &exchange=US parameter if filtering for US exchanges
      const exchangeParam = exchange === 'US' ? '&exchange=US' : '';
      
      const searchResults = await this.finnhubRequest<FinnhubSearchResult>(
        `https://finnhub.io/api/v1/search?q=${query}${exchangeParam}`
      );
      
      // Take only the first 8 results to avoid excessive API calls
      const topResults = searchResults.result.slice(0, 8);
      
      return topResults;
    } catch (error) {
      console.error('Error searching stocks:', error);
      throw error;
    }
  }

  async getStockQuote(symbol: string) {
    try {
      // Parallel requests with rate limiting handled by our queue
      const [quoteData, companyData] = await Promise.all([
        this.finnhubRequest<FinnhubQuote>(`https://finnhub.io/api/v1/quote?symbol=${symbol}`),
        this.finnhubRequest<FinnhubCompanyProfile>(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}`)
      ]);
      
      return {
        symbol,
        name: companyData.name || symbol,
        price: quoteData.c,
        change: quoteData.d,
        percentChange: quoteData.dp,
        high: quoteData.h,
        low: quoteData.l,
        open: quoteData.o,
        previousClose: quoteData.pc,
        exchange: companyData.exchange,
        country: companyData.country,
        currency: companyData.currency,
        industry: companyData.finnhubIndustry,
      };
    } catch (error) {
      console.error('Error getting stock quote:', error);
      throw error;
    }
  }

  async saveStock(symbol: string) {
    const stockData = await this.getStockQuote(symbol);
    
    return this.prisma.stock.upsert({
      where: { symbol },
      update: {
        name: stockData.name,
        price: stockData.price,
        change: stockData.change,
      },
      create: {
        symbol,
        name: stockData.name,
        price: stockData.price,
        change: stockData.change,
      },
    });
  }

  async getSavedStocks() {
    return this.prisma.stock.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }

  async deleteStock(id: number) {
    const stock = await this.prisma.stock.findUnique({
      where: { id },
    });
    
    if (!stock) {
      throw new NotFoundException(`Stock with ID ${id} not found`);
    }
    
    return this.prisma.stock.delete({
      where: { id },
    });
  }
} 