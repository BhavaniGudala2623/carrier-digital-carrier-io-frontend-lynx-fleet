/* eslint-disable no-param-reassign */
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { AssetService } from '@carrier-io/lynx-fleet-data-lib';
import { ApolloError } from '@apollo/client';
import { useRbac } from '@carrier-io/rbac-provider-react';
import { GetDeviceSnapshotResponse } from '@carrier-io/lynx-fleet-types';

import { getDeviceInfoState, setConfigTask, setFirmwareTask } from '../stores';
import { DeviceCommissioningContext, DeviceCommissioningContextInterface } from '../providers';
import { useDeviceCommissioningBreadcrumbs } from '../hooks/useDeviceCommissioningBreadcrumbs';
import { getResetSensors } from '../utils';

import { DeviceCommissioning } from './DeviceCommissioning';

import { useAppDispatch, useAppSelector } from '@/stores';
import { getErrorMessage } from '@/utils';
import { getAuthTenantId } from '@/features/authentication';
import { ErrorOverlay, Loader } from '@/components';
import { routes } from '@/routes';
import { showError } from '@/stores/actions';
import { companyActionPayload, usePermissionPreload } from '@/features/authorization';

export function DeviceCommissioningPage() {
  const { deviceId } = useParams<{
    deviceId: string;
  }>();

  const { isLoading, error } = useAppSelector(getDeviceInfoState);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { hasPermission } = useRbac();
  const tenantId = useAppSelector(getAuthTenantId);

  const memorizedActions = useMemo(
    () => [
      companyActionPayload('asset.edit', tenantId),
      companyActionPayload('device.edit', tenantId),
      companyActionPayload('device.view', tenantId),
    ],
    [tenantId]
  );

  const { permissionLoading } = usePermissionPreload(memorizedActions);

  const assetEditAllowed = hasPermission(companyActionPayload('asset.edit', tenantId));
  const deviceEditAllowed = hasPermission(companyActionPayload('device.edit', tenantId));
  const deviceViewAllowed = hasPermission(companyActionPayload('device.view', tenantId));

  const { t } = useTranslation();

  const [requestNumber, setRequestNumber] = useState(0);

  const [snapshot, setSnapshot] = useState<GetDeviceSnapshotResponse | undefined>();
  const [refreshingSnapshot, setRefreshingSnapshot] = useState(false);
  const intervalTimer = useRef<NodeJS.Timer>();

  const startTimer = useCallback(() => {
    intervalTimer.current = setInterval(() => {
      setRequestNumber((prev) => prev + 1);
    }, 30 * 1000);
  }, []);

  useEffect(() => {
    startTimer();

    return () => {
      if (intervalTimer.current) {
        clearInterval(intervalTimer.current);
      }
    };
  }, [startTimer]);

  const resetTimer = useCallback(() => {
    if (intervalTimer.current) {
      clearInterval(intervalTimer.current);
    }
    startTimer();
  }, [startTimer]);

  const {
    loading: isSnapshotLoading,
    error: snapshotLoadingError,
    refetch: refetchSnapshotData,
  } = AssetService.useGetDeviceSnapshot(
    {
      deviceId: deviceId ?? '',
    },
    {
      onError: (err: ApolloError) => {
        setRefreshingSnapshot(false);
        showError(dispatch, getErrorMessage(err));
      },
      onCompleted: (data) => {
        setSnapshot(data.getDeviceSnapshot);
        setRefreshingSnapshot(false);
        setConfigTask(data.getDeviceSnapshot.device?.configTask || {});
        setFirmwareTask(data.getDeviceSnapshot.device?.firmwareTask || {});
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const {
    data: fotawebDeviceData,
    loading: isFotawebDeviceLoading,
    refetch: refetchFotawebDevice,
  } = AssetService.useGetFotawebDevice(
    {
      id: snapshot?.device?.id ?? '',
      imei: snapshot?.device?.imei ?? '',
    },
    {
      fetchPolicy: 'network-only',
      skip: !snapshot?.device?.id || !snapshot?.device?.imei,
      onError: (err) => showError(dispatch, getErrorMessage(err)),
    }
  );

  const {
    data: fotawebGroupsData,
    loading: isFotawebGroupsLoading,
    refetch: refetchFotawebGroups,
  } = AssetService.useGetFotawebGroups({
    fetchPolicy: 'network-only',
    onError: (err) => showError(dispatch, getErrorMessage(err)),
  });

  useEffect(() => {
    if (requestNumber === 0) {
      return;
    }
    refetchSnapshotData();
    // fetch snapshots once in 30 seconds whereas fotaweb once in 1 minute
    if (requestNumber % 2 === 0) {
      refetchFotawebDevice();
      refetchFotawebGroups();
    }
  }, [requestNumber, refetchSnapshotData, refetchFotawebDevice, refetchFotawebGroups]);

  useDeviceCommissioningBreadcrumbs({
    selectedDevice: snapshot?.device,
  });

  const updateSnapshotFlespiData = useCallback(() => {
    if (deviceId) {
      setRefreshingSnapshot(true);
      setSnapshot((prev) => ({
        ...prev,
        flespiData: {
          ...prev?.flespiData,
          ...getResetSensors(),
        },
      }));
      resetTimer();
      AssetService.refreshSensors({
        input: {
          id: deviceId,
        },
      }).catch((err) => {
        setRefreshingSnapshot(false);
        showError(dispatch, getErrorMessage(err));
      });
    }
  }, [deviceId, dispatch, resetTimer]);

  const contextValue: DeviceCommissioningContextInterface = useMemo(
    () => ({
      isLoading,
      error,
      permissions: {
        assetEditAllowed,
        deviceEditAllowed,
      },
      snapshot: snapshot ?? {},
      fotawebDevice: fotawebDeviceData?.getFotawebDevice,
      fotawebGroups: fotawebGroupsData?.getFotawebGroups?.groups ?? [],
      updateSnapshotFlespiData,
      refreshingSnapshot,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      assetEditAllowed,
      deviceEditAllowed,
      error,
      fotawebDeviceData?.getFotawebDevice,
      fotawebGroupsData?.getFotawebGroups?.groups,
      isLoading,
      snapshot,
      requestNumber,
      updateSnapshotFlespiData,
      refreshingSnapshot,
    ]
  );

  useEffect(() => {
    if (!permissionLoading && (!deviceId || !deviceViewAllowed)) {
      navigate(routes.deviceManagement.path);
    }
  }, [deviceId, deviceViewAllowed, navigate, permissionLoading]);

  if (permissionLoading) {
    return <Loader />;
  }

  if (!deviceId || !deviceViewAllowed) {
    return null;
  }

  if ((isSnapshotLoading && !snapshot) || !snapshot || isFotawebGroupsLoading || isFotawebDeviceLoading) {
    return <Loader />;
  }

  if (snapshotLoadingError) {
    return (
      <ErrorOverlay
        message={`${t('device.management.device.info.error-loading-device-data')}: "${
          snapshotLoadingError?.message
        }"`}
      />
    );
  }

  return (
    <DeviceCommissioningContext.Provider value={contextValue}>
      <DeviceCommissioning />
    </DeviceCommissioningContext.Provider>
  );
}
