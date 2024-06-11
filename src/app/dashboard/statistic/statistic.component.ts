import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as d3 from 'd3';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ROLES_CONFIG } from 'src/app/shared/configs/app-role';
import { RestaurantService } from 'src/app/shared/data-access/restaurant/restaurant.service';
import { StatisticService } from 'src/app/shared/data-access/statistic/statistic.service';
import { AuthService } from 'src/app/shared/data-access/user/auth.service';
import { IOrderCombDto } from 'src/app/shared/model/order/order-comb-dto';
import { IProductContent } from 'src/app/shared/model/product/product-content';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-statistic',
  standalone: true,
  imports: [SharedModule, FormsModule],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.scss',
})
export class StatisticComponent implements OnInit {
  currentPage: 'promo' | 'no-promo' | string = 'no-promo';
  selectedRestaurantId = 0;
  fromDate!: Date;
  toDate!: Date;
  topProduct: IProductContent[] = [];

  authService = inject(AuthService);

  get ROLES_CONFIG() {
    return ROLES_CONFIG;
  }

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
    this.selectedRestaurantId = this.authService.currentUser?.restaurantId || 0;
    this._showPage();
  }

  downloadPDF(): void {
    const content1 = document.querySelector('.top-product') as HTMLElement;
    const content2 = document.querySelector('.diagrams') as HTMLElement;
    if (content1 && content2) {
      html2canvas(content1).then((canvas1) => {
        html2canvas(content2).then((canvas2) => {
          const pdf = new jsPDF();
          const imgWidth = pdf.internal.pageSize.getWidth();
          const imgHeight1 = (canvas1.height * imgWidth) / canvas1.width;
          const imgHeight2 = (canvas2.height * imgWidth) / canvas2.width;

          pdf.addImage(canvas1, 'PNG', 0, 0, imgWidth - 10, imgHeight1);
          pdf.addImage(
            canvas2,
            'PNG',
            10,
            imgHeight1 + 10,
            imgWidth - 20,
            imgHeight2
          );

          pdf.save(
            `statistics_${this.currentPage}_${new Date().toISOString()}.pdf`
          );
        });
      });
    }
  }

  onDateChange(): void {
    this._showPage();
  }

  onRestaurantChange(target: number): void {
    this.selectedRestaurantId = target;
    this._showPage();
  }

  onTabChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.currentPage = target.value;
    this._showPage();
  }

  private async _showPage(): Promise<void> {
    if (this.selectedRestaurantId === 0) return;
    let list: IOrderCombDto[] = [];

    switch (this.currentPage) {
      case 'promo':
        this.topProduct = await this._statisticService.getTopPromProduct(
          this.selectedRestaurantId,
          this.fromDate,
          this.toDate
        );
        list = await this._statisticService.getPromOrdersFromTo(
          this.selectedRestaurantId,
          this.fromDate,
          this.toDate
        );
        break;
      case 'no-promo':
        this.topProduct = await this._statisticService.getTopProduct(
          this.selectedRestaurantId,
          this.fromDate,
          this.toDate
        );
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
      .attr('height', (d) => height - y(d.totalTips))
      .on('mouseover', (event, d) => {
        const tooltip = d3.select('.tooltip');
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(`${d.date}: ${d.totalTips}`)
          .style('left', event.pageX + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', (event, d) => {
        d3.select('.tooltip').transition().duration(500).style('opacity', 0);
      });
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
      .attr('x', (d) => x(d.date.toString())!)
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.totalProducts))
      .attr('height', (d) => height - y(d.totalProducts))
      .on('mouseover', (event, d) => {
        const tooltip = d3.select('.tooltip');
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(`${d.date}: ${d.totalProducts}`)
          .style('left', event.pageX + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', (event, d) => {
        d3.select('.tooltip').transition().duration(500).style('opacity', 0);
      });
  }

  private async _aggregateOrderTipData(
    orderCombDtos: IOrderCombDto[]
  ): Promise<{ date: string; totalTips: number }[]> {
    const tipData: { [date: string]: number } = {};

    orderCombDtos.forEach((orderCombDto) => {
      const date = new Date(
        orderCombDto.orderDto.createdDate!
      ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const tips = orderCombDto.orderDto.tips;
      tipData[date] =
        (tipData[date] || 0) + tips + orderCombDto.orderDto.sumPaid;
    });

    const sortedTipData = Object.entries(tipData).sort(
      (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
    );

    return sortedTipData.map(([date, totalTips]) => ({
      date,
      totalTips,
    }));
  }

  private async _aggregateProductQuantityData(
    orderCombDtos: IOrderCombDto[]
  ): Promise<{ date: string; totalProducts: number }[]> {
    const productData: { [date: string]: number } = {};

    orderCombDtos.forEach((orderCombDto) => {
      const date = new Date(
        orderCombDto.orderDto.createdDate!
      ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const productCount = orderCombDto.orderProductDtos.reduce(
        (acc, curr) => acc + curr.quantity,
        0
      );
      productData[date] = (productData[date] || 0) + productCount;
    });

    const sortedProductData = Object.entries(productData).sort(
      (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
    );

    return sortedProductData.map(([date, totalProducts]) => ({
      date,
      totalProducts,
    }));
  }
}
