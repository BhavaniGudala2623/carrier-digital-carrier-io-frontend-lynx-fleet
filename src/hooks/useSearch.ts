import { useState } from 'react';
import { debounce } from 'lodash-es';
import { OnSearchBoxChange } from '@carrier-io/fds-react/patterns/SearchBox';

export const useSearch = (delay = 300) => {
  const [searchText, setSearchText] = useState('');

  const handleSearchBoxChange = debounce(({ text = '' }: OnSearchBoxChange) => {
    setSearchText(text);
  }, delay);

  return {
    searchText,
    handleSearchBoxChange,
  };
};
