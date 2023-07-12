import { useEffect, useState, useMemo, MouseEvent, Key } from 'react';
import Box from '@carrier-io/fds-react/Box';
import FormControl from '@carrier-io/fds-react/FormControl';
import Select from '@carrier-io/fds-react/Select';
import Typography from '@carrier-io/fds-react/Typography';
import IconButton from '@carrier-io/fds-react/IconButton';
import CircularProgress from '@carrier-io/fds-react/CircularProgress';
import Tooltip from '@carrier-io/fds-react/Tooltip';
import Input from '@carrier-io/fds-react/Input';
import { useTranslation } from 'react-i18next';
import {
  Save,
  DeleteOutline,
  Refresh as RefreshIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from '@mui/icons-material';
import { useRbac } from '@carrier-io/rbac-provider-react';
import { AssetView, HistoryFrequency, Maybe, QuickDate } from '@carrier-io/lynx-fleet-types';

import { setAssetViewAsDefaultAction, deleteAssetViewAction } from '../../stores';

import { AssetHistoryGraphSaveViewDialog } from './AssetHistoryGraphSaveViewDialog';
import { AssetHistoryGraphDeleteViewDialog } from './AssetHistoryGraphDeleteViewDialog';
import {
  controlIconsStyles,
  iconsStyles,
  menuIconsContainerStyle,
  menuItemContainerStyle,
  MenuItemStyled,
} from './styles';

import { companyActionPayload, HasPermission } from '@/features/authorization';
import { useToggle } from '@/hooks';
import { getAuthTenantId } from '@/features/authentication';
import { useAppDispatch, useAppSelector } from '@/stores';
import { useApplicationContext } from '@/providers/ApplicationContext';
import { SelectChangeEvent } from '@/types';

const SAVE_VIEW_INDEX = 0;
const RESET_ALL_INDEX = -1;
export const SYSTEM_DEFAULT_VIEW_INDEX = 1;

interface IAssetHistoryGraphViewSelect {
  views?: AssetView[];
  viewsLoaded?: boolean;
  selectedView: Maybe<string | number>;
  setSelectedView: (view: Maybe<string | number>) => void;
  quickDate: Maybe<QuickDate>;
  frequency: Maybe<HistoryFrequency>;
  email?: string;
}

export function AssetHistoryGraphViewSelect(props: IAssetHistoryGraphViewSelect) {
  const { views, viewsLoaded, selectedView, setSelectedView, quickDate, frequency, email } = props;

  const tenantId = useAppSelector(getAuthTenantId);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const applicationContext = useApplicationContext();
  const applicationProps = useMemo(
    () => ({
      setAssetHistoryChartSelectedView: applicationContext.setAssetHistoryChartSelectedView,
      currentColumnsToDisplay: applicationContext.applicationState.legendSettings.columnsToDisplay,
    }),
    [applicationContext]
  );
  const { hasPermission } = useRbac();

  // graph view state
  const [defaultView, setDefaultView] = useState<Maybe<number | string>>(SYSTEM_DEFAULT_VIEW_INDEX);
  const [hoveredView, setHoveredView] = useState<number | Maybe<string> | undefined>(null);

  const {
    value: saveViewDialogOpen,
    toggleOn: handleOpenSaveViewDialogOpen,
    toggleOff: handleCloseSaveViewDialogOpen,
  } = useToggle(false);

  const {
    value: openDeleteViewDialog,
    toggleOn: handleOpenDeleteViewDialog,
    toggleOff: handleCloseDeleteViewDialog,
  } = useToggle(false);
  const [deleteViewId, setDeleteViewId] = useState<Maybe<string> | undefined>(null);

  const assetViewCreateAllowed = hasPermission(companyActionPayload('report.assetViewCreate', tenantId));

  useEffect(() => {
    // set default view when the views are loaded from the backend
    let foundDefault = false;
    if (views && viewsLoaded) {
      views.forEach((view) => {
        if (view.isDefault) {
          if (view?.id) {
            setDefaultView(view.id);
          }

          if (!selectedView) {
            applicationProps.setAssetHistoryChartSelectedView(view);
            setSelectedView(view.id || '');
            foundDefault = true;
          } else if (view.id === selectedView) {
            applicationProps.setAssetHistoryChartSelectedView(view);
          }
        } else if (view.id === selectedView) {
          applicationProps.setAssetHistoryChartSelectedView(view);
        }
      });

      if (!foundDefault && !selectedView) {
        setSelectedView(SYSTEM_DEFAULT_VIEW_INDEX);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [views, viewsLoaded]);

  const onSaveView = () => {
    setSelectedView(null);
    handleOpenSaveViewDialogOpen();
  };

  const setDefaultAssetViewHandler = (viewId: AssetView['id'] | number, event?: MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    const emailAddress = views ? views[0].email : null;
    if (!emailAddress) {
      return;
    }

    if (viewId === SYSTEM_DEFAULT_VIEW_INDEX) {
      setDefaultView(SYSTEM_DEFAULT_VIEW_INDEX);
      dispatch(setAssetViewAsDefaultAction(emailAddress, ''));

      return;
    }
    if (viewId !== defaultView) {
      setDefaultView(viewId as string);
      dispatch(setAssetViewAsDefaultAction(emailAddress, viewId as AssetView['id']));
    }
  };

  const onResetAll = () => {
    setSelectedView(SYSTEM_DEFAULT_VIEW_INDEX);
    applicationProps.setAssetHistoryChartSelectedView(null);
    setDefaultAssetViewHandler(SYSTEM_DEFAULT_VIEW_INDEX);
  };

  const onSetView = (view: Maybe<string | number>) => {
    setSelectedView(view);
    applicationProps.setAssetHistoryChartSelectedView(views?.find((v) => v.id === view));
  };

  const dropdownMenuSelectHandler = (event: SelectChangeEvent<unknown>) => {
    if (event.target.value === SAVE_VIEW_INDEX) {
      return onSaveView();
    }
    if (event.target.value === RESET_ALL_INDEX) {
      return onResetAll();
    }

    return onSetView(event.target.value as number);
  };

  const deleteAssetViewHandler = (viewId: AssetView['id']) => {
    const viewToDelete = views?.find((view) => view.id === viewId);
    if (!viewToDelete) {
      return;
    }

    if (viewToDelete.isDefault) {
      setDefaultView(SYSTEM_DEFAULT_VIEW_INDEX);
    }

    if (viewToDelete.id === selectedView) {
      if (viewToDelete.isDefault) {
        setSelectedView(SYSTEM_DEFAULT_VIEW_INDEX);
        applicationProps.setAssetHistoryChartSelectedView(null);
      } else {
        setSelectedView(defaultView);
        applicationProps.setAssetHistoryChartSelectedView(views?.find((view) => view.isDefault));
      }
    }

    dispatch(deleteAssetViewAction(viewToDelete));
  };

  const onDeleteAssetView = () => {
    deleteAssetViewHandler(deleteViewId);
    handleCloseDeleteViewDialog();
  };

  const selectedViewValue =
    !selectedView || selectedView === SYSTEM_DEFAULT_VIEW_INDEX ? SYSTEM_DEFAULT_VIEW_INDEX : selectedView;

  return (
    <>
      <FormControl variant="outlined" sx={{ width: '260px', mr: 2 }}>
        <Select
          id="assetHistoryViewDropdownSelect"
          value={viewsLoaded ? selectedViewValue : ''}
          displayEmpty
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
            MenuListProps: {
              disablePadding: true,
              style: {
                height: !viewsLoaded ? '350px' : 'auto',
              },
            },
            PaperProps: {
              style: {
                maxHeight: '350px',
                minHeight: '350px',
                width: '260px',
              },
            },
          }}
          renderValue={(value) => {
            if (value === '' || value === 0 || value === SYSTEM_DEFAULT_VIEW_INDEX) {
              return t('assethistory.saved-views');
            }

            return views?.find((view) => view.id === value)?.name;
          }}
          input={<Input />}
          onChange={dropdownMenuSelectHandler}
          sx={{
            pb: 2,
          }}
          size="small"
        >
          <MenuItemStyled sx={{ display: 'none' }} value={SYSTEM_DEFAULT_VIEW_INDEX}>
            <Typography variant="subtitle1">{t('assethistory.saved-views')}</Typography>
          </MenuItemStyled>

          {viewsLoaded && assetViewCreateAllowed && (
            <MenuItemStyled
              sx={{
                py: 1.5,
                position: 'sticky',
                top: '0px',
                zIndex: 999,
                '&:hover': {
                  color: (theme) => theme.palette.primary.main,
                },
                backgroundColor: 'white',
              }}
              value={SAVE_VIEW_INDEX}
            >
              <Save sx={{ ...iconsStyles, mr: 1 }} />
              <Typography variant="subtitle1">{t('assethistory.save-current-view')}</Typography>
            </MenuItemStyled>
          )}
          {viewsLoaded && (
            <MenuItemStyled
              sx={{
                py: 1.5,
                position: 'sticky',
                top: '44px',
                borderBottom: (theme) => `1px solid ${theme.palette.grey['400']}`,
                zIndex: 999,
                '&:hover': {
                  color: (theme) => theme.palette.primary.main,
                },
                backgroundColor: 'white',
              }}
              value={RESET_ALL_INDEX}
            >
              <RefreshIcon sx={{ ...iconsStyles, mr: 1 }} />
              <Typography variant="subtitle1">{t('assethistory.reset-all')}</Typography>
            </MenuItemStyled>
          )}
          {viewsLoaded &&
            views &&
            views.map((view) => (
              <MenuItemStyled
                value={view.id ?? undefined}
                onMouseEnter={() => setHoveredView(view.id)}
                onMouseLeave={() => setHoveredView(null)}
                key={view.id as Key}
                sx={menuItemContainerStyle}
              >
                <Box
                  sx={{ width: '70%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                >
                  {view.name}
                </Box>
                <Box sx={menuIconsContainerStyle}>
                  <HasPermission action="report.assetViewDelete" subjectType="COMPANY" subjectId={tenantId}>
                    <Tooltip title={t('assethistory.delete-view')} arrow>
                      <IconButton
                        size="small"
                        onClick={(event: MouseEvent) => {
                          event.stopPropagation();
                          setDeleteViewId(view.id);
                          handleOpenDeleteViewDialog();
                        }}
                      >
                        <DeleteOutline
                          sx={{
                            ...controlIconsStyles,
                            opacity: () => (hoveredView === view.id ? 1 : 0),
                            '&:hover': {
                              color: (theme) => theme.palette.grey['800'],
                            },
                            mr: 0.5,
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </HasPermission>
                  <HasPermission action="report.assetViewUpdate" subjectType="COMPANY" subjectId={tenantId}>
                    <Tooltip title={defaultView === view.id ? '' : t('assethistory.set-as-default')} arrow>
                      <IconButton
                        size="small"
                        onClick={(event: MouseEvent) => {
                          setDefaultAssetViewHandler(view.id, event);
                        }}
                      >
                        <CheckCircleOutlineIcon
                          sx={{
                            ...controlIconsStyles,
                            opacity: () => (defaultView === view.id || hoveredView === view.id ? 1 : 0),
                            color: (theme) =>
                              defaultView === view.id
                                ? theme.palette.primary.main
                                : theme.palette.grey['500'],
                            '&:hover': {
                              color: (theme) =>
                                defaultView === view.id
                                  ? theme.palette.primary.main
                                  : theme.palette.grey['800'],
                            },
                            cursor: () => (defaultView === view.id ? 'auto' : 'pointer'),
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </HasPermission>
                </Box>
              </MenuItemStyled>
            ))}
          {!viewsLoaded && (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </Select>
      </FormControl>
      {saveViewDialogOpen && (
        <AssetHistoryGraphSaveViewDialog
          open={saveViewDialogOpen}
          onClose={handleCloseSaveViewDialogOpen}
          email={email}
          quickDate={quickDate}
          frequency={frequency}
          legendSettings={applicationProps.currentColumnsToDisplay}
          views={views}
          setSelectedView={setSelectedView}
        />
      )}
      {deleteViewId && (
        <AssetHistoryGraphDeleteViewDialog
          open={openDeleteViewDialog}
          onClose={handleCloseDeleteViewDialog}
          onCancel={handleCloseDeleteViewDialog}
          onConfirm={onDeleteAssetView}
        />
      )}
    </>
  );
}
