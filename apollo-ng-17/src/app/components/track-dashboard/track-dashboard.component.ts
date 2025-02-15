import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-track-dashboard',
  standalone: true,
  imports: [TooltipModule],
  templateUrl: './track-dashboard.component.html',
  styleUrl: './track-dashboard.component.scss'
})
export class TrackDashboardComponent {

    testId : any = "";
    dlNumber : any = "";
    name : any = "";
    surname : any = "";
    dob : any = "";

    constructor(private route: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.testId = params.get('testId');
        });

        this.route.queryParamMap.subscribe(queryParams => {
            this.dlNumber = queryParams.get('dlNumber');
            this.name = queryParams.get('name');
            this.surname = queryParams.get('surname');
            this.dob = queryParams.get('dob');
        });
    }
}
