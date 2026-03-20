import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-bottom-panel',
  templateUrl: './bottom-panel.component.html',
  styleUrls: ['./bottom-panel.component.scss']
})
export class BottomPanelComponent {
  @Input() leftLabel: string = '';
  @Input() leftValue: string = '';
  @Input() rightLabel: string = '';
  @Input() rightValue: string = '';
  @Input() showAddButton: boolean = false;
  @Output() addClick = new EventEmitter<void>();
}
