import { useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { debounce } from 'lodash-es';

import { useGeofenceContext } from '../features/geofences/providers/GeofenceProvider';
import { useAssetsPageContext } from '../providers/AssetsPageProvider';
import { AutocompleteFilter } from '../components/FilterPanel/AutocompleteFilter';
import { Address, Category, FilterOption } from '../types';
import { useMap } from '../features/map';
import { getGeofenceData } from '../utils';
import { flyToGeofence } from '../features/map/mapGeofences';
import { flyToAddress } from '../features/map/utils/flyToAddress';
import { useAssetsPageDataContext } from '../providers/AssetsPageDataProvider';
import {
  getAddressOptions,
  getAssetsOptions,
  getGeofencesOptions,
  sortAssetsFilterOptions,
} from '../utils/getAssetsAutocompleteList';

import { geofencesSlice } from '@/stores/assets/geofence';
import { useAppDispatch, useAppSelector } from '@/stores';
import { useCompanyHierarchyTenantIds } from '@/features/common';
import { useApplicationContext } from '@/providers/ApplicationContext';
import { getMapboxAddress, localeToLanguageCode } from '@/utils';

export const AutocompleteFilterContainer = () => {
  const { appLanguage } = useApplicationContext();
  const { companyHierarchyTenantIds } = useCompanyHierarchyTenantIds();
  const { geofenceGroupsState, selectedGeofenceRowId } = useAppSelector(
    (state) => ({
      geofenceGroupsState: state.geofenceGroups,
      selectedGeofenceRowId: state.geofences.selectedRowId,
    }),
    shallowEqual
  );

  const { entities: groups } = geofenceGroupsState;
  const {
    setFilterSettings,
    setTableTab,
    setSelectedAssetSearchFilterId,
    selectedAssetSearchFilterId,
    selectedAssetRowId,
  } = useAssetsPageContext();
  const { filteredSnapshots } = useAssetsPageDataContext();

  const dispatch = useAppDispatch();
  const { map, showAssetHoverPopup, popup } = useMap();

  const { filteredGeofences, handleSetGeofenceProperties } = useGeofenceContext();

  const [selectedOption, setSelectedOption] = useState<FilterOption | null>(null);
  const [initialized, setInitialized] = useState(false);

  const [categorySelected, setCategorySelected] = useState<Category | null>(null);
  const [selectedAddressRowId, setSelectedAddressRowId] = useState<unknown>(null);
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const getAddresses = useCallback(
    async (search: string) => {
      const languageCode = localeToLanguageCode(appLanguage);
      const geoCoderUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?access_token=${process.env.REACT_APP_MAPBOX_KEY}&language=${languageCode}`;
      fetch(geoCoderUrl)
        .then((response) => response.json())
        .then((data) => {
          const items: Address[] = data.features.map(
            (item): Address => ({
              id: item.id,
              center: item.center,
              place_name: getMapboxAddress(languageCode, item),
            })
          );

          setAddresses(items);
        });
    },
    [appLanguage]
  );

  const combinedOptionsList = useMemo(() => {
    const combinedList: FilterOption[] = [];
    switch (categorySelected?.name) {
      case 'assets':
        if (filteredSnapshots) {
          combinedList.push(...getAssetsOptions(filteredSnapshots));
        }
        break;
      case 'geofences':
        if (filteredGeofences && groups) {
          combinedList.push(...getGeofencesOptions(filteredGeofences, groups, appLanguage));
        }
        break;
      case 'addresses':
        if (addresses) {
          combinedList.push(...getAddressOptions(addresses));
        }
        break;
      default:
        if (filteredSnapshots) {
          combinedList.push(...getAssetsOptions(filteredSnapshots));
        }
        if (filteredGeofences && groups) {
          combinedList.push(...getGeofencesOptions(filteredGeofences, groups, appLanguage));
        }

        if (addresses) {
          combinedList.push(...getAddressOptions(addresses));
        }
    }

    return sortAssetsFilterOptions(combinedList);
  }, [filteredSnapshots, filteredGeofences, groups, appLanguage, addresses, categorySelected]);

  useEffect(() => {
    if (combinedOptionsList && combinedOptionsList.length && !initialized) {
      if (selectedGeofenceRowId) {
        const selectedGeofence = combinedOptionsList.find((item) => item.value === selectedGeofenceRowId);
        if (selectedGeofence) {
          setSelectedOption(selectedGeofence);
        }
      }
      if (selectedAssetSearchFilterId) {
        const selectedAsset = combinedOptionsList.find((item) => item.value === selectedAssetSearchFilterId);
        if (selectedAsset) {
          setSelectedOption(selectedAsset);
        }
      }
      if (selectedAddressRowId) {
        const selectedAddress = combinedOptionsList.find((item) => item.value === selectedAddressRowId);
        if (selectedAddress) {
          setSelectedOption(selectedAddress);
        }
      }
      if (!selectedAssetSearchFilterId && selectedAssetRowId) {
        setFilterSettings({
          searchText: '',
        });
      }
      if (!selectedAssetSearchFilterId && !selectedGeofenceRowId) {
        setSelectedOption(null);
      }
      setInitialized(true);
    }
  }, [
    combinedOptionsList,
    selectedAssetSearchFilterId,
    selectedGeofenceRowId,
    initialized,
    selectedAssetRowId,
    setFilterSettings,
    selectedAddressRowId,
  ]);

  const handleInputChange = useMemo(
    () =>
      debounce(async (value: string) => {
        setFilterSettings({
          searchText: value,
        });
        getAddresses(value);
      }),
    [setFilterSettings, getAddresses]
  );

  const handleOptionChange = useCallback(
    (option: FilterOption | null) => {
      setSelectedOption(option);
      if (option?.type === 'Asset') {
        setTableTab('assets');
        const selectedAsset = filteredSnapshots?.find((item) => item.asset?.id === option.value);
        if (selectedAsset) {
          setSelectedAssetSearchFilterId(selectedAsset.asset?.id ?? null);
          showAssetHoverPopup(selectedAsset);
        }
      }

      if (option?.type === 'Address') {
        setTableTab('assets');
        const selectedAddess = addresses?.find((item) => item?.id === option.value);
        if (selectedAddess) {
          setSelectedAddressRowId(selectedAddess ? selectedAddess.id : null);
          flyToAddress(map, selectedAddess.center, true);
        }
      }

      if (option?.type === 'Geofence') {
        setTableTab('geofences');
        const selectedGeofence = filteredGeofences.find((item) => item.geofenceId === option.value);
        if (selectedGeofence) {
          dispatch(
            geofencesSlice.actions.selectGeofenceRow(selectedGeofence ? selectedGeofence.geofenceId : null)
          );
          const geofenceData = getGeofenceData(selectedGeofence);

          if (geofenceData) {
            handleSetGeofenceProperties(geofenceData);
            flyToGeofence(map, selectedGeofence.geofenceId);
          }
        }
      }

      if (!option) {
        setSelectedAssetSearchFilterId(null);
        dispatch(geofencesSlice.actions.selectGeofenceRow(null));
        handleSetGeofenceProperties(null);
      }
    },
    [
      dispatch,
      filteredGeofences,
      filteredSnapshots,
      map,
      setTableTab,
      handleSetGeofenceProperties,
      setSelectedAssetSearchFilterId,
      showAssetHoverPopup,
      addresses,
    ]
  );

  useEffect(() => {
    if (
      companyHierarchyTenantIds &&
      selectedOption?.tenantId &&
      !companyHierarchyTenantIds.includes(selectedOption.tenantId)
    ) {
      setSelectedOption(null);
      dispatch(geofencesSlice.actions.selectGeofenceRow(null));
      setSelectedAssetSearchFilterId(null);
      handleSetGeofenceProperties(null);
      setFilterSettings({
        searchText: '',
      });
      popup.remove();
    }
  }, [
    dispatch,
    handleSetGeofenceProperties,
    popup,
    companyHierarchyTenantIds,
    selectedOption?.tenantId,
    setSelectedAssetSearchFilterId,
    setFilterSettings,
    setSelectedOption,
  ]);

  useEffect(() => {
    setFilterSettings({
      searchText: '',
    });
  }, [setFilterSettings]);

  useEffect(() => {
    const name = categorySelected?.name;
    if (name === 'geofences') {
      setTableTab('geofences');
    } else if (!name || name === 'assets') {
      setTableTab('assets');
    }
  }, [categorySelected, setTableTab]);

  return (
    <AutocompleteFilter
      options={combinedOptionsList}
      onInputChange={handleInputChange}
      onOptionChange={handleOptionChange}
      selectedOption={selectedOption}
      handleCategorySelect={setCategorySelected}
      categorySelected={categorySelected}
    />
  );
};
