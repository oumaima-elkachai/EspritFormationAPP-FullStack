import { Component, OnInit, HostListener } from '@angular/core';
import { Route, Router } from '@angular/router';
import { User } from 'src/app/demo/models/user.model';
import { AuthService } from 'src/app/demo/services/auth.service';
import { StorageService } from 'src/app/demo/services/storage.service';
import { UserService } from 'src/app/demo/services/user.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user!: User;
  isSponsor = false;
  isMentor = false; 

  userId: string | null = null;
  isAuthenticated: boolean = this.authService.isAuthenticated();
  isAdmin = false;
  isStudent = false;
  userMenuVisible = false; // Property to control dropdown visibility
  

  constructor(
    public router: Router,
    public layoutService: LayoutService,
    private userService: UserService,
    private storageService: StorageService,
    private authService: AuthService,
    
      
  ) {}

  username = '';
  applicationsMenuVisible = false;


  ngOnInit(): void {
    this.userMenuVisible = false;
    this.applicationsMenuVisible = false;
    const userId = this.storageService.getLoggedInUserId();
    console.log('User ID from storage:', this.authService.isAuthenticated());
    
    if (userId) {
      this.userService.getUserById(userId).subscribe((data) => {
        this.user = data;
        this.username = data.name;
        // Check if user has SPONSOR role
        this.isSponsor = this.user.roles?.some(role => role.name === 'SPONSOR') || false;
        this.isMentor = this.user.roles?.some(role => role.name === 'MENTOR') || false;

      });
    }
  } 




  navigateToLanding() {
    this.router.navigate(['/landing']);
  }

    navigateToTeamSubmission(): void {
        this.router.navigate(['/team-submission']); // Navigation directe vers /team-submission
    }
  getBadgeIcon(): string {
    const badgeIcons: Record<string, string> = {
      JUNIOR_COACH: 'assets/demo/images/avatar/JUNIOR_COACH.png',
      ASSISTANT_COACH: 'assets/demo/images/avatar/ASSISTANT_COACH.png',
      SENIOR_COACH: 'assets/demo/images/avatar/SENIOR_COACH.png',
      HEAD_COACH: 'assets/demo/images/avatar/HEAD_COACH.png',
      MASTER_MENTOR: 'assets/demo/images/avatar/MASTER_MENTOR.png'
    };
    return this.user ? badgeIcons[this.user.badge] || 'assets/icons/default_badge.png' : '';
  } 

  viewOrCreateMentorApplication(): void {
    const userId = this.storageService.getLoggedInUserId();
    if (this.isMentor) {
      // Navigate to view their existing application
      this.router.navigate(['/mentor-applications/user', userId]);
    } else {
      // Navigate to create a new application
      this.router.navigate(['/mentor-applications/new']);
    }}
    
  logout()
  {
      this.authService.logout();
      this.storageService.clearAll();
      window.location.reload();
      this.userMenuVisible = false;
  }
  

  
  // Close user menu dropdown
  closeUserMenu(): void {
    this.userMenuVisible = false;
  }
  
  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Check if the click is outside the dropdown area
    const clickedElement = event.target as HTMLElement;
    const dropdown = document.querySelector('.user-dropdown');
    
    if (dropdown && !dropdown.contains(clickedElement)) {
      this.userMenuVisible = false;
    }
  }


 // Method to toggle applications dropdown
toggleApplicationsMenu(event: Event) {
  event.stopPropagation();
  this.applicationsMenuVisible = !this.applicationsMenuVisible;
  
  // Close user menu if open
  if (this.applicationsMenuVisible && this.userMenuVisible) {
    this.userMenuVisible = false;
  }
}

// Method to toggle user menu dropdown
toggleUserMenu(event: Event) {
  event.stopPropagation();
  this.userMenuVisible = !this.userMenuVisible;
  
  // Close applications menu if open
  if (this.userMenuVisible && this.applicationsMenuVisible) {
    this.applicationsMenuVisible = false;
  }
}

// Close both dropdowns when clicking outside
@HostListener('document:click', ['$event'])
handleDocumentClick(event: MouseEvent) {
  // Get references to your dropdown elements
  const userMenuButton = document.querySelector('.badge-icon');
  const userDropdownMenu = document.querySelector('.user-dropdown-menu');
  const applicationsMenuButton = document.querySelector('.applications-toggle');
  const applicationsDropdown = document.querySelector('.applications-dropdown');
  
  // Close user menu if click is outside
  if (userMenuButton && !userMenuButton.contains(event.target as Node) && 
      userDropdownMenu && !userDropdownMenu.contains(event.target as Node) &&
      this.userMenuVisible) {
    this.userMenuVisible = false;
  }
  
  // Close applications menu if click is outside
  if (applicationsMenuButton && !applicationsMenuButton.contains(event.target as Node) && 
      applicationsDropdown && !applicationsDropdown.contains(event.target as Node) &&
      this.applicationsMenuVisible) {
    this.applicationsMenuVisible = false;
  }
} 
}
