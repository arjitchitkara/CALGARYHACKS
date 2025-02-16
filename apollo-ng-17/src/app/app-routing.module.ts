import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { TrackFormComponent } from './components/track-form/track-form.component';
import { TrackDashboardComponent } from './components/track-dashboard/track-dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { BrowseComponent } from './pages/browse/browse.component';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    {
        path: '', loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule)
    },
    {
        path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'home', component: AppLayoutComponent,
        children: [
            {


                path : '',
                data : { breadcrumb: 'Home'},
                component : HomeComponent
            },
            {
                path : 'browse',
                data : { breadcrumb : 'Browse'},
                component : BrowseComponent

            }
        ]
    },
    // ✅ Added Dictionary Page Route
    {
        path: 'dictionary',
        loadChildren: () => import('./pages/dictionary/dictionary.module').then(m => m.DictionaryModule)
    },
    { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
    { path: 'notfound', loadChildren: () => import('./demo/components/notfound/notfound.module').then(m => m.NotfoundModule) },
    { path: '**', redirectTo: '/notfound' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
