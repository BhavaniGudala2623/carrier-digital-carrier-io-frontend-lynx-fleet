Feature: Login


Scenario: The user is not logged in when they access /auth/login

  When I go to /auth/login
  Then I'm not logged in


Scenario: The user is able to pick interface language on login page

  When I go to /auth/login
  Then I see "Welcome to" on the page

  When I switch language to "Français"
  Then I see "Bienvenue à" on the page

  When I switch language to "Deutsch"
  Then I see "Willkommen bei" on the page

  When I switch language to "English"
  Then I see "Welcome to" on the page
