import { FC, ReactNode, useMemo } from 'react';
import FleetLocalizationProvider from '@carrier-io/fds-react/FleetLocalizationProvider';
import FleetThemeProvider from '@carrier-io/fds-react/theme/FleetThemeProvider';
import { StyledEngineProvider, createTheme, ThemeOptions } from '@carrier-io/fds-react/styles';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';
import { enUS, enGB, de, es, fr, nl, pl, it, sv, da, nb } from 'date-fns/locale';
import { LanguageType } from '@carrier-io/lynx-fleet-types';

import { useApplicationContext } from '@/providers/ApplicationContext';
import { themePalette } from '@/theme/themePalette';

import '@carrier-io/fds-react/fonts/index.css';

const themeLynx: ThemeOptions = {
  palette: themePalette,
};

const combinedTheme = createTheme(fleetThemeOptions, themeLynx);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const { appLanguage } = useApplicationContext();

  const locale = useMemo(() => {
    const dateLocale: Record<LanguageType, Locale> = {
      'en-US': enUS,
      'en-GB': enGB,
      'de-DE': de,
      'es-ES': es,
      'fr-FR': fr,
      'it-IT': it,
      'nl-NL': nl,
      'pl-PL': pl,
      'sv-SE': sv,
      'da-DK': da,
      'nb-NO': nb,
    };

    return dateLocale[appLanguage] ?? enUS;
  }, [appLanguage]);

  return (
    <FleetLocalizationProvider locale={locale}>
      <StyledEngineProvider injectFirst>
        <FleetThemeProvider theme={combinedTheme}>{children}</FleetThemeProvider>
      </StyledEngineProvider>
    </FleetLocalizationProvider>
  );
};
