import { useMemo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import Typography from '@carrier-io/fds-react/Typography';
import { useFormikContext } from 'formik';
import Box from '@carrier-io/fds-react/Box';

import { NotificationFormData } from '../../../types';
import { EventViewMapper } from '../Event/EventMapper';

import { useTenantAssets } from '@/features/common';
import { ListPopover } from '@/components/ListPopover';

const listStyle = { padding: 0, margin: 0, paddingLeft: 20 };

export const NotificationReview = () => {
  const { values } = useFormikContext<NotificationFormData>();
  const { t } = useTranslation();

  const { assets, isAssetsLoading } = useTenantAssets(values.assets.companyId);

  const { recipients } = values;

  const recipientItems =
    recipients
      .slice()
      .sort((a: string, b: string) => a.localeCompare(b))
      .map((recipient) => ({
        value: recipient,
        label: recipient,
      })) || [];

  const recipientsPopoverValue = `(${recipientItems.length} ${t('common.selected').toLowerCase()})`;

  const selectedAssets = useMemo(
    () =>
      assets
        .filter((item) => values.assets.assetIds?.includes(item.id))
        .map((item) => ({ value: item.id, label: item.name ?? item.id })),
    [assets, values.assets.assetIds]
  );

  const assetsPopoverValue = `(${selectedAssets.length} ${t('common.selected').toLowerCase()})`;

  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        {values.name || t('notifications.name')}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1">
          {t('notifications.send-notification')} {t('common.if')}:
        </Typography>
        {values.conditions.length > 0 ? (
          <ul style={{ ...listStyle }}>
            {values.conditions.map((event) => (
              <li key={event.type + event.expression.comparison}>
                <EventViewMapper event={event} showIcon={false} />
              </li>
            ))}
          </ul>
        ) : (
          <Typography variant="body1">{t('notifications.none')}</Typography>
        )}
      </Box>
      {values.conditions.length > 0 &&
        values.conditions[0].type !== 'DOOR' &&
        values.conditions[0].type !== 'FUEL_LEVEL' &&
        values.conditions[0].type !== 'BATTERY_LEVEL' &&
        values.conditions[0].type !== 'ASSET_OFFLINE' && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">{t('notifications.except-when')}:</Typography>
            {values.exceptConditions.length > 0 ? (
              <ul style={{ ...listStyle }}>
                {values.exceptConditions.map((event) => (
                  <li key={event.type + event.expression.comparison}>
                    <EventViewMapper event={event} showIcon={false} />
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="body1">{t('notifications.none')}</Typography>
            )}
          </Box>
        )}

      {values.enableTimeCondition && (
        <Box sx={{ my: 2 }}>
          <Typography variant="body1">{t('notifications.time-threshold')}:</Typography>
          <ul style={{ ...listStyle }}>
            <li>
              <Typography variant="body1">
                {t('notifications.time-conditions-met')}{' '}
                <b>
                  {values.time.hr} {t(values.time.hr !== 1 ? 'common.hours' : 'common.hour')} &amp;{' '}
                  {values.time.min} {t(values.time.min !== 1 ? 'common.minutes' : 'common.minute')}
                </b>
              </Typography>
            </li>
          </ul>
        </Box>
      )}
      {values.conditions.length > 0 && values.conditions[0].type === 'ASSET_OFFLINE' && (
        <Box sx={{ my: 2 }}>
          <Typography variant="body1">{t('notifications.time-threshold')}:</Typography>
          <ul style={{ ...listStyle }}>
            <li>
              <Typography variant="body1">
                {t('notifications.time-conditions-met')}{' '}
                <b>{t('notifications.asset-offline.time-threshold')}</b>
              </Typography>
            </li>
          </ul>
        </Box>
      )}

      <Typography variant="body1" sx={{ mb: 2 }}>
        <Trans
          i18nKey="notifications.when-these-assets-affected"
          count={selectedAssets.length}
          components={[
            <ListPopover
              items={selectedAssets}
              containerContent={assetsPopoverValue}
              isLoading={isAssetsLoading}
            />,
          ]}
        />
        {values.sendEmail && (
          <>
            {', '}
            <br />
            <Trans i18nKey="notifications.send-email-to" count={recipientItems.length} />
            <ListPopover items={recipientItems} containerContent={recipientsPopoverValue} />
          </>
        )}
      </Typography>
    </>
  );
};
