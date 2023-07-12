import Autocomplete from '@carrier-io/fds-react/Autocomplete';
import TextField from '@carrier-io/fds-react/TextField';
import InputAdornment from '@carrier-io/fds-react/InputAdornment';
import { useTranslation } from 'react-i18next';

import { useReplayTabDataContext } from '../providers';

import { SearchIcon } from '@/components';

export const Search = () => {
  const { searchOptions, selectedEventType, setSelectedEventType } = useReplayTabDataContext();

  const { t } = useTranslation();

  const handleOptionChanged = (_, option) => {
    setSelectedEventType(option?.sourceType ?? null);
  };

  const selectedOption = searchOptions.find((option) => option.sourceType === selectedEventType);

  return (
    <Autocomplete
      options={searchOptions}
      value={selectedOption || null}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={t('common.search')}
          InputProps={{
            ...params.InputProps,
            style: { flexWrap: 'nowrap' },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      )}
      onChange={handleOptionChanged}
      forcePopupIcon={false}
      sx={{ mx: '6px', height: 70 }}
      clearOnBlur={false}
      isOptionEqualToValue={(option, value) => option.sourceType === value.sourceType}
    />
  );
};
