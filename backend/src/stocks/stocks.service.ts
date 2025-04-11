import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class StocksService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async searchStocks(query: string) {
    const apiKey = this.configService.get<string>('FINNHUB_API_KEY');
    
    try {
      const response = await axios.get(
        `https://finnhub.io/api/v1/search?q=${query}&token=${apiKey}`
      );
      
      return response.data.result;
    } catch (error) {
      console.error('Error searching stocks:', error);
      throw error;
    }
  }

  async getStockQuote(symbol: string) {
    const apiKey = this.configService.get<string>('FINNHUB_API_KEY');
    
    try {
      const response = await axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
      );
      
      // Get company name
      const companyResponse = await axios.get(
        `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`
      );
      
      return {
        symbol,
        name: companyResponse.data.name || symbol,
        price: response.data.c,
        change: response.data.d,
        percentChange: response.data.dp,
        high: response.data.h,
        low: response.data.l,
        open: response.data.o,
        previousClose: response.data.pc,
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