import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { getAssetHistoryState, getAssetsAction, getAssetViewsByUserEmailAction } from '../stores';
import { useAssetHistoryBreadcrumns } from '../hooks';
import { AssetHistoryPageProvider } from '../providers';

import { AssetHistory } from './AssetHistory';

import { getAuthTenantId, getAuthUserEmail } from '@/features/authentication';
import { useAppDispatch, useAppSelector } from '@/stores';
import { ContentRoute } from '@/components/layouts';
import { companyActionPayload, usePermissionPreload } from '@/features/authorization';
import { Loader } from '@/components';

export const AssetHistoryPage = () => {
  const { assetId = '' } = useParams<{ assetId: string }>();
  const { assets } = useAppSelector(getAssetHistoryState);

  const dispatch = useAppDispatch();
  const authUserEmail = useAppSelector(getAuthUserEmail);
  const tenantId = useAppSelector(getAuthTenantId);

  useEffect(() => {
    dispatch(getAssetsAction());
    dispatch(getAssetViewsByUserEmailAction(authUserEmail));
  }, [dispatch, authUserEmail]);

  useAssetHistoryBreadcrumns({ assets, selectedAssetId: assetId });

  const memorizedActions = useMemo(
    () => [
      companyActionPayload('dashboard.assetHistoryExport', tenantId),
      companyActionPayload('dashboard.assetHistoryList', tenantId),
      companyActionPayload('dashboard.eventHistoryExport', tenantId),
      companyActionPayload('dashboard.eventHistoryList', tenantId),
      companyActionPayload('dashboard.routeReplayList', tenantId),
      companyActionPayload('report.assetViewCreate', tenantId),
      companyActionPayload('report.assetViewList', tenantId),
      companyActionPayload('scheduledReports.create', tenantId),
    ],
    [tenantId]
  );

  const { permissionLoading } = usePermissionPreload(memorizedActions);

  if (permissionLoading) {
    return <Loader />;
  }

  return (
    <ContentRoute>
      <AssetHistoryPageProvider assetId={assetId}>
        <AssetHistory />
      </AssetHistoryPageProvider>
    </ContentRoute>
  );
};
