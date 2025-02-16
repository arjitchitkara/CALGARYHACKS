import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleFitService {

    private backendUrl = 'http://localhost:8000';

    private activityData : BehaviorSubject<any> = new BehaviorSubject({});
    activityData$ : Observable<any> = this.activityData.asObservable();

    constructor(private http: HttpClient) {}

    /**
     * Get Google OAuth Login URL
     * - Sends: No input
     * - Receives: { authUrl: string }
     */
    getAuthUrl(): Observable<{ authUrl: string }> {
    return this.http.get<{ authUrl: string }>(`${this.backendUrl}/auth/google`);
    }

    /**
     * Fetch User Profile & Fitness Data
     * - Sends: No input (session-based)
     * - Receives: { userProfileData, fitnessData }
     */
    fetchUserData(): Observable<any> {
        return this.http.get<any>(`${this.backendUrl}/fetch-data`, { withCredentials: true }).pipe(
            tap(response => {
                this.activityData.next(response); // Store response in BehaviorSubject
            })
        );
    }


    /**
     * Logout User
     * - Sends: No input
     * - Receives: { message: string }
     */
    logout(): Observable<{ message: string }> {
        return this.http.get<{ message: string }>(`${this.backendUrl}/logout`, { withCredentials: true });
    }
}
