import {
  CreateNotificationInput,
  NotificationPageItem,
  UpdateNotificationInput,
} from '@carrier-io/lynx-fleet-types';
import i18n from 'i18next';
import { NotificationService } from '@carrier-io/lynx-fleet-data-lib';

import { withSearchFields } from '../utils';

import { notificationsSlice } from './slice';

import { showError, showMessage } from '@/stores/actions';
import { getErrorMessage } from '@/utils/getErrorMessage';
import type { AppDispatch } from '@/stores';
import { fetchAllRecords } from '@/utils';

const { actions } = notificationsSlice;

export const fetchNotifications = (cancelRequest) => async (dispatch: AppDispatch) => {
  dispatch(actions.startCall({}));

  try {
    const entities = await fetchAllRecords<NotificationPageItem>(NotificationService.getNotifications);

    if (!cancelRequest.isCancelled) {
      return dispatch(
        actions.notificationsFetched({
          entities: entities.map(withSearchFields),
        })
      );
    }
  } catch (error) {
    dispatch(actions.catchError({ error: getErrorMessage(error) }));
  }

  return undefined;
};

export const fetchNotification = async (notificationId: string) => {
  const { data } = await NotificationService.getNotification({ notificationId });
  if (!data.getNotification.success) {
    throw new Error(data.getNotification.error);
  }

  return data.getNotification.doc;
};

export const createNotificationAction = (payload: CreateNotificationInput) => async (dispatch) =>
  NotificationService.createNotification({
    doc: payload,
  })
    .then(({ data }) => {
      if (!data?.createNotification.success) {
        throw new Error(data?.createNotification.error);
      }

      showMessage(dispatch, i18n.t('notifications.saved') as string);

      return dispatch(
        actions.notificationCreated({
          notification: data?.createNotification.doc,
        })
      );
    })
    .catch((error) => {
      const errorMessage = getErrorMessage(error);
      if (errorMessage !== 'notification_with_such_name_already_exists') {
        showError(dispatch, errorMessage);
      }

      throw new Error(errorMessage);
    });

export const updateNotificationAction = (payload: UpdateNotificationInput) => async (dispatch) =>
  NotificationService.updateNotification({
    doc: payload,
  })
    .then(({ data }) => {
      if (!data?.updateNotification.success) {
        throw new Error(data?.updateNotification.error);
      }

      if (payload?.active) {
        showMessage(dispatch, i18n.t('notifications.active') as string);
      } else {
        showMessage(dispatch, i18n.t('notifications.inactive') as string);
      }

      return dispatch(
        actions.notificationUpdated({
          notification: data?.updateNotification.doc,
        })
      );
    })
    .catch((error) => {
      const errorMessage = getErrorMessage(error);
      if (errorMessage !== 'notification_with_such_name_already_exists') {
        showError(dispatch, errorMessage);
      }

      throw new Error(errorMessage);
    });

export const deleteNotificationAction = (notificationId: string) => async (dispatch) =>
  NotificationService.deleteNotification({
    notificationId,
  })
    .then(({ data }) => {
      if (!data?.deleteNotification.success) {
        throw new Error(data?.deleteNotification.error);
      }

      showMessage(dispatch, i18n.t('notifications.deleted') as string);

      return dispatch(
        actions.notificationDeleted({
          notificationId: data?.deleteNotification?.doc?.notificationId,
        })
      );
    })
    .catch((error) => {
      const errorMessage = getErrorMessage(error);
      showError(dispatch, errorMessage);
      throw new Error(errorMessage);
    });
