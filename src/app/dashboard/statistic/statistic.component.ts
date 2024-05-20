import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as d3 from 'd3';
import { RestaurantService } from 'src/app/shared/data-access/restaurant/restaurant.service';
import { StatisticService } from 'src/app/shared/data-access/statistic/statistic.service';
import { IOrderCombDto } from 'src/app/shared/model/order/order-comb-dto';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-statistic',
  standalone: true,
  imports: [SharedModule, FormsModule],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.scss',
})
export class StatisticComponent implements OnInit {
  currentPage: 'promo' | 'no-promo' = 'no-promo';
  selectedRestaurantId = 0;
  fromDate!: Date;
  toDate!: Date;

  private _statisticService = inject(StatisticService);
  private _restaurantService = inject(RestaurantService);

  restaurantList$ = this._restaurantService.getAllRestaurants();

  ngOnInit(): void {
    const currentDate = new Date();
    this.fromDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    this.toDate = currentDate;
  }

  onDateChange(): void {
    this._showPage();
  }

  onRestaurantChange(target: number): void {
    this.selectedRestaurantId = target;
    this._showPage();
  }

  onTabChange(target: 'promo' | 'no-promo'): void {
    this.currentPage = target;
    this._showPage();
  }

  private async _showPage(): Promise<void> {
    let list: IOrderCombDto[] = [];

    switch (this.currentPage) {
      case 'promo':
        break;
      case 'no-promo':
        list = await this._statisticService.getOrdersFromTo(
          this.selectedRestaurantId,
          this.fromDate,
          this.toDate
        );
        break;
    }

    this._createOrderTipChart(list);
    this._createProductQuantityChart(list);
  }

  private async _createOrderTipChart(
    orderCombDtos: IOrderCombDto[]
  ): Promise<void> {
    d3.select('.order-tip-chart').selectAll('svg').remove();

    const data = await this._aggregateOrderTipData(orderCombDtos);

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select('.order-tip-chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const x = d3
      .scaleBand()
      .range([0, width])
      .padding(0.1)
      .domain(data.map((d) => d.date.toString()));

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.totalTips)!])
      .range([height, 0]);

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(y));

    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.date.toString())!)
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.totalTips))
      .attr('height', (d) => height - y(d.totalTips));
  }

  private async _createProductQuantityChart(
    orderCombDtos: IOrderCombDto[]
  ): Promise<void> {
    d3.select('.product-quantity-chart').selectAll('svg').remove();

    const data = await this._aggregateProductQuantityData(orderCombDtos);

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select('.product-quantity-chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const x = d3
      .scaleBand()
      .range([0, width])
      .padding(0.1)
      .domain(data.map((d) => d.date.toString()));

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.totalProducts)!])
      .range([height, 0]);

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(y));

    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.date?.toString())!)
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.totalProducts))
      .attr('height', (d) => height - y(d.totalProducts));
  }

  private async _aggregateOrderTipData(
    orderCombDtos: IOrderCombDto[]
  ): Promise<{ date: Date; totalTips: number }[]> {
    const tipData: { [date: string]: number } = {};

    orderCombDtos.forEach((orderCombDto) => {
      const date = new Date(
        orderCombDto.orderDto.createdDate!
      ).toLocaleDateString();
      const tips = orderCombDto.orderDto.tips;
      tipData[date] = (tipData[date] || 0) + tips;
    });

    return Object.keys(tipData).map((date) => ({
      date: new Date(date),
      totalTips: tipData[date],
    }));
  }

  private async _aggregateProductQuantityData(
    orderCombDtos: IOrderCombDto[]
  ): Promise<{ date: Date; totalProducts: number }[]> {
    const productData: { [date: string]: number } = {};

    orderCombDtos.forEach((orderCombDto) => {
      const date = new Date(
        orderCombDto.orderDto.createdDate!
      ).toLocaleDateString();
      const productCount = orderCombDto.orderProductDtos.reduce(
        (acc, curr) => acc + curr.quantity,
        0
      );
      productData[date] = (productData[date] || 0) + productCount;
    });

    return Object.keys(productData).map((date) => ({
      date: new Date(date),
      totalProducts: productData[date],
    }));
  }
}
