import { Controller, Get, Post, Delete, Param, Query, Body, ParseIntPipe } from '@nestjs/common';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('search')
  async searchStocks(
    @Query('q') query: string,
    @Query('exchange') exchange: string
  ) {
    // No conversion needed, directly pass the exchange parameter
    return this.stocksService.searchStocks(query, exchange);
  }

  @Get('news')
  async getNews(@Query('category') category: string = 'general') {
    return this.stocksService.getNews(category);
  }

  @Get('quote/:symbol')
  async getStockQuote(@Param('symbol') symbol: string) {
    return this.stocksService.getStockQuote(symbol);
  }

  @Post('save')
  async saveStock(@Body() body: { symbol: string }) {
    return this.stocksService.saveStock(body.symbol);
  }

  @Get()
  async getSavedStocks() {
    return this.stocksService.getSavedStocks();
  }

  @Delete(':id')
  async deleteStock(@Param('id', ParseIntPipe) id: number) {
    return this.stocksService.deleteStock(id);
  }
} 