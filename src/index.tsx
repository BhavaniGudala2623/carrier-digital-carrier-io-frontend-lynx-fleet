import { Suspense } from 'react';
import { ApolloProvider } from '@apollo/client';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { userClient } from '@carrier-io/lynx-fleet-data-lib';

import { IntercomProvider } from './features/customer-support';
import { AuthenticationProvider } from './features/authentication';
import { AuthorizationProvider } from './features/authorization';
import { SnackbarProvider } from './providers/SnackbarProvider';
import { UserSettingsContextProvider } from './providers/UserSettings';
import { LookerUserProvider } from './features/reports';
import { StrictModeProvider } from './providers/StrictModeProvider';

import { SplashScreen } from '@/components';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AppRoutes } from '@/routes/AppRoutes';
import { ApplicationProvider } from '@/providers/ApplicationContext';
import { AssetsAddressProvider } from '@/providers/AssetsAddress/context';
import { store } from '@/stores';
import { initLogRocket } from '@/config/logrocket';
import '@/config/i18n';

import '@/styles/index.scss';

initLogRocket();

const container = document.getElementById('app');
const root = createRoot(container!);

root.render(
  <StrictModeProvider>
    <ApplicationProvider>
      <Provider store={store}>
        <Suspense fallback={<SplashScreen />}>
          <BrowserRouter>
            <ApolloProvider client={userClient}>
              <ThemeProvider>
                <SnackbarProvider>
                  <AuthenticationProvider>
                    <AuthorizationProvider>
                      <UserSettingsContextProvider>
                        <IntercomProvider>
                          <LookerUserProvider>
                            <AssetsAddressProvider>
                              <AppRoutes />
                            </AssetsAddressProvider>
                          </LookerUserProvider>
                        </IntercomProvider>
                      </UserSettingsContextProvider>
                    </AuthorizationProvider>
                  </AuthenticationProvider>
                </SnackbarProvider>
              </ThemeProvider>
            </ApolloProvider>
          </BrowserRouter>
        </Suspense>
      </Provider>
    </ApplicationProvider>
  </StrictModeProvider>
);
