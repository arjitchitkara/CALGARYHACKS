import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { ListComponent } from './pages/list/list.component';
import { TrackComponent } from './pages/track/track.component';
import { TrackFormComponent } from './components/track-form/track-form.component';
import { TrackDashboardComponent } from './components/track-dashboard/track-dashboard.component';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    {
        path: '', component: AppLayoutComponent,
        children: [

            { path: '', loadChildren: () => import('./demo/components/dashboards/dashboards.module').then(m => m.DashboardsModule) },

            { path: 'testlist',
            data: { breadcrumb: 'Test List' },
            component: ListComponent,
            },

            { path: 'track',
                data: { breadcrumb: 'Tracking' },
                component: TrackComponent,
                children : [
                    {
                        path: '',
                        component: TrackFormComponent,
                        data: { breadcrumb: 'authorize'}
                    },
                    {
                        path: ':testId',
                        component: TrackDashboardComponent,
                        data: { breadcrumb: 'Live'}
                    }
                ]
            }
        ]
    },
    { path: 'auth', data: { breadcrumb: 'Auth' }, loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
    { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
    { path: 'notfound', loadChildren: () => import('./demo/components/notfound/notfound.module').then(m => m.NotfoundModule) },
    { path: '**', redirectTo: '/notfound' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
