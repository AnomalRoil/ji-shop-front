import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as Errors from '../../../constants/errors';
import {EventService} from '../event.service';
import {ScanConfiguration} from '../../../types/scan_configuration';

@Component({
  selector: 'app-admin-create-scanning-config',
  templateUrl: 'admin-create-scanning-config.component.html'
})
export class AdminCreateScanningConfigComponent implements OnInit {
  config: ScanConfiguration;
  sending = false;
  loading = false;
  isNew = true;

  constructor(private backend: BackendService, private router: Router, private route: ActivatedRoute, private eventService: EventService) {}

  submit() {
    this.backend.createOrUpdateConfig(this.config).subscribe(
      res => {
        this.router.navigate(['admin', 'scan', res]);
      },
      err => {
        const errors = Errors.replaceErrorsInResponse(err, undefined, new Map<string, string>([
          ['name', 'Nom'],
        ]));

        alert('Des erreurs se sont produites durant l\'envoi : ' + errors.join('; '));
        this.sending = false;
      }
    );

    this.sending = true;
  }

  ngOnInit(): void {
    if (this.route.parent) {
      this.route.paramMap.subscribe(map => {
        if (map.has('id')) {
          const configId = map.get('id');
          this.loading = true;

          this.backend.getScanningConfiguration(Number(configId)).subscribe(c => {
            this.config = c;
            this.isNew = false;
            this.loading = false;
          });
        }
      });
    }

    this.config = new ScanConfiguration();
  }
}
