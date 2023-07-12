import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { shallowEqual } from 'react-redux';
import { GeofenceGroup, Maybe, Geofence } from '@carrier-io/lynx-fleet-types';
import mapboxgl from 'mapbox-gl';

import { UNASSIGNED_GROUP_ID } from '../../../constants';
import { useCreateGeofenceDialog, useGeofence } from '../hooks';
import { CreateGeofenceDialog } from '../components/CreateEditDialog/Create';
import { EditGeofenceDialog } from '../components/CreateEditDialog/Edit';
import { MapboxPopupWrapper } from '../../../components/MapboxPopupWrapper';
import { DeleteGeofenceConfirmationDialog } from '../components/DeleteDialog';
import { GeofenceDetailsPopup } from '../components/DetailsPopup';
import { useMap, mapPopupOffset } from '../../map';
import { useAssetsPageContext } from '../../../providers';
import { GeofenceProperties } from '../../../types';

import { useAppSelector } from '@/stores';
import { useNullableContext } from '@/hooks/useNullableContext';
import { useToggle } from '@/hooks';
import { ExportTaskType } from '@/types';
import { useCompanyHierarchyTenantIds } from '@/features/common';

export type GeofenceContextValue = {
  filteredGeofences: Geofence[];
  geofence?: Geofence;
  group?: GeofenceGroup;
  geofenceProperties: Maybe<GeofenceProperties>;
  handleSetGeofenceProperties: (data: GeofenceProperties | null) => void;
  taskToExport: ExportTaskType;
  setTaskToExport: Dispatch<SetStateAction<ExportTaskType>>;
};

const GeofenceContext = createContext<GeofenceContextValue | null>(null);

export const useGeofenceContext = () => useNullableContext(GeofenceContext);

export const GeofenceProvider = ({ children }: { children: ReactNode }) => {
  const { geofencesState, geofenceGroupsState } = useAppSelector(
    (state) => ({
      geofencesState: state.geofences,
      geofenceGroupsState: state.geofenceGroups,
    }),
    shallowEqual
  );

  const { entities: geofences } = geofencesState;
  const { filters: filterGroups } = geofenceGroupsState;

  const {
    value: openEditGeofenceDialog,
    toggleOn: handleOpenEditGeofenceDialog,
    toggleOff: handleCloseEditGeofenceDialog,
  } = useToggle(false);

  const {
    value: openDeleteGeofenceDialog,
    toggleOn: handleOpenDeleteGeofenceDialog,
    toggleOff: handleCloseDeleteGeofenceDialog,
  } = useToggle(false);

  const { filter } = useAssetsPageContext();

  const geofenceState = useGeofence();
  const { geofence: currentGeofence, group, geofenceProperties, handleSetGeofenceProperties } = geofenceState;

  const { map, draw } = useMap();

  const { companyHierarchyTenantIds } = useCompanyHierarchyTenantIds();

  const filteredGeofences = useMemo(() => {
    if (!geofences) {
      return [];
    }

    return geofences.filter((geofence) => {
      let filterResult = true;

      if (filterResult && !companyHierarchyTenantIds?.includes(geofence.tenantId)) {
        filterResult = false;
      }

      if (filterResult && filter?.searchText) {
        filterResult =
          geofence?.name?.toUpperCase().includes(filter.searchText.toUpperCase()) ||
          geofence?.description?.toUpperCase().includes(filter.searchText.toUpperCase());
      }

      if (filterResult && filterGroups) {
        filterResult = geofence.groupId
          ? filterGroups.includes(geofence.groupId)
          : filterGroups.includes(UNASSIGNED_GROUP_ID);
      }

      return filterResult;
    });
  }, [geofences, filter?.searchText, companyHierarchyTenantIds, filterGroups]);

  const onEditGeofenceClose = useCallback(() => {
    if (draw) {
      const selected = draw.getSelected();
      if (selected?.features[0]?.id) {
        draw.delete(String(selected.features[0].id));
      }
    }
    handleSetGeofenceProperties(null);
    handleCloseEditGeofenceDialog();
  }, [draw, handleCloseEditGeofenceDialog, handleSetGeofenceProperties]);

  const [taskToExport, setTaskToExport] = useState<ExportTaskType>('NONE');

  const contextValue = useMemo(
    () => ({
      filteredGeofences,
      ...geofenceState,
      taskToExport,
      setTaskToExport,
    }),
    [filteredGeofences, geofenceState, taskToExport, setTaskToExport]
  );

  const {
    currentPolygon,
    openCreateGeofenceDialog,
    handleOpenCreateGeofenceDialog,
    handleCancelCreateGeofenceDialog,
    handleCloseCreateGeofenceDialog,
  } = useCreateGeofenceDialog();

  const handleAreaDraw = useCallback(
    ({ features }) => {
      handleOpenCreateGeofenceDialog(features[0]);
    },
    [handleOpenCreateGeofenceDialog]
  );

  const handleCreatePopup = useCallback(
    ({ popupRef }) => {
      if (map && geofenceProperties) {
        return new mapboxgl.Popup({
          closeButton: false,
          offset: mapPopupOffset,
          className: 'popup-wrapper',
        })
          .setMaxWidth('270px')
          .setLngLat([geofenceProperties.longitude, geofenceProperties?.latitude])
          .setDOMContent(popupRef.current)
          .addTo(map);
      }

      return null;
    },
    [geofenceProperties, map]
  );

  useEffect(() => {
    if (map) {
      map.on('draw.create', handleAreaDraw);

      return () => {
        map.off('draw.create', handleAreaDraw);
      };
    }

    return undefined;
  }, [handleAreaDraw, map]);

  return (
    <>
      <GeofenceContext.Provider value={contextValue}>{children}</GeofenceContext.Provider>
      {openCreateGeofenceDialog && (
        <CreateGeofenceDialog
          currentPolygon={currentPolygon}
          onCancel={handleCancelCreateGeofenceDialog}
          onClose={handleCloseCreateGeofenceDialog}
        />
      )}

      {openEditGeofenceDialog && (
        <EditGeofenceDialog geofenceData={currentGeofence} onClose={onEditGeofenceClose} />
      )}
      {openDeleteGeofenceDialog && (
        <DeleteGeofenceConfirmationDialog
          geofenceData={currentGeofence}
          onClose={handleCloseDeleteGeofenceDialog}
        />
      )}
      {geofenceProperties && map && (
        <MapboxPopupWrapper map={map} handleCreatePopup={handleCreatePopup}>
          <GeofenceDetailsPopup
            geofence={currentGeofence}
            group={group}
            onEdit={handleOpenEditGeofenceDialog}
            onDelete={handleOpenDeleteGeofenceDialog}
          />
        </MapboxPopupWrapper>
      )}
    </>
  );
};
