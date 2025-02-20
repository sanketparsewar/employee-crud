import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  @Input() totalPages: number = 1;
  @Input() totalPagesArray: number[] = [];
  @Input() totalEmployees: number = 0;
  @Input() currentPage: number = 1;
  @Input() queryParameters: any;
  @Output() getEmployeeList = new EventEmitter();

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.queryParameters.page = page;
      this.currentPage = page;
      this.getEmployeeList.emit();
    }
  }

  getVisiblePages(): number[] {
    let pages = [];
    let range = 1; // Number of pages before and after current page to show
    let start = Math.max(1, this.currentPage - range);
    let end = Math.min(this.totalPages, this.currentPage + range);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
