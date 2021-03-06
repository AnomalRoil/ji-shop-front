import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ScanConfigurationWithItems} from '../../../types/scan_configuration';
import {BackendService} from '../../../services/backend.service';
import {Item, ItemList, PosConfigItem} from '../../../types/items';
import {PosConfiguration} from '../../../types/pos_configuration';

@Component({
  selector: 'app-admin-view-pos-config',
  templateUrl: './admin-view-pos-config.component.html'
})
export class AdminViewPosConfigComponent implements OnInit {
  config: PosConfiguration = null;
  items: PosConfigItem[] = null;

  private addedItems: number[];
  private availableItems: ItemList[];
  filteredAvailableItems: ItemList[];

  private events: Map<number, string> = new Map();

  id: number;

  constructor(private backend: BackendService, public route: ActivatedRoute, private router: Router) {
  }

  private buildAddedItems() {
    this.addedItems = [];

    for (const item of this.items) {
      this.addedItems.push(item.item.id);
    }
  }

  getEventName(id: number) {
    if (this.events.has(id)) {
      return this.events.get(id);
    } else {
      return id.toString();
    }
  }

  reload() {
    this.backend.getPosConfiguration(this.id).subscribe(res => {
      this.config = res.config;
      this.items = res.items;

      this.buildAddedItems();
      this.filterAvailableItems();
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(map => {
      if (!map.has('id') || !map.get('id')) {
        return;
      }

      this.id = Number(map.get('id'));

      this.reload();
      this.backend.getInvisibleItems().subscribe(res => {
        this.availableItems = res.tickets.concat(res.goodies);
        this.filterAvailableItems();
      });
    });
  }

  private filterAvailableItems() {
    if (!this.addedItems) {
      this.filteredAvailableItems = this.availableItems;
      return;
    }

    if (!this.availableItems) {
      return;
    }

    this.events = new Map();
    this.availableItems.map(list => list.event).forEach(ev => this.events.set(ev.id, ev.name));


    this.filteredAvailableItems = this.availableItems.map(list => {
      return {event: list.event, items: list.items.filter(it => this.addedItems.indexOf(it.id) === -1)};
    }).filter(list => list.items.length > 0);
  }

  removeProduct(product: Item) {
    this.backend.removeProductFromPosConfiguration(this.id, product).subscribe(res => this.reload());
  }

  delete(): void {
    const conf = confirm('Voulez vous vraiment supprimer cette configuration ? Elle sera définitivement perdue.');

    if (conf) {
      this.backend.deletePosConfig(this.id).subscribe(res => {
        this.router.navigate(['admin', 'pos']);
      }, err => {
        alert('Une erreur s\'est produite.');
        this.reload();
      });
    }
  }
}
