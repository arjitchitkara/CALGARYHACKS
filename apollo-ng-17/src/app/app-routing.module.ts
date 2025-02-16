import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { HomeComponent } from './pages/home/home.component';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    {
        path: '', 
        loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule)
    },
    {
        path: 'auth', 
        loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'home', 
        component: AppLayoutComponent,
        children: [
            {
                path: '',
                data: { breadcrumb: 'Home' },
                component: HomeComponent
            }
        ]
    },
    // ✅ Dictionary Page Route
    {
        path: 'dictionary',
        loadChildren: () => import('./pages/dictionary/dictionary.module').then(m => m.DictionaryModule)
    },
    // ✅ Browse Page Route (Newly Added)
    {
        path: 'browse',
        loadChildren: () => import('./pages/browse/browse.module').then(m => m.BrowseModule)
    },
    {
        path: 'landing', 
        loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule)
    },
    {
        path: 'notfound', 
        loadChildren: () => import('./demo/components/notfound/notfound.module').then(m => m.NotfoundModule)
    },
    { path: '**', redirectTo: '/notfound' } // Redirect any unknown routes
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
