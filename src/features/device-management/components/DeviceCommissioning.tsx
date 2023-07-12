/* eslint-disable react-hooks/exhaustive-deps */
import { FormikErrors, FormikProvider, useFormik } from 'formik';
import domtoimage from 'dom-to-image-more';
import { useTranslation } from 'react-i18next';
import Typography from '@carrier-io/fds-react/Typography';
import Accordion from '@carrier-io/fds-react/Accordion';
import AccordionSummary from '@carrier-io/fds-react/AccordionSummary';
import AccordionDetails from '@carrier-io/fds-react/AccordionDetails';
import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import { ExpandMore, RefreshOutlined } from '@mui/icons-material';
import { SyntheticEvent, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { isEmpty } from 'lodash-es';
import { CircularProgress } from '@carrier-io/fds-react';

import { DeviceCommissioningContext } from '../providers';
import { DeviceCommissioningFormValues, SectionId, Section } from '../types';
import { validateAssetName } from '../api';
import { commissionDeviceAction, updateCommissionedDevice } from '../stores/deviceInfo/deviceInfoActions';
import {
  getControlSectionId,
  isIncludeDatacoldSensors,
  getInitialValues,
  prepareDin4TypeSensors,
} from '../utils';

import { getSectionContent, sections } from './SectionContent';
import { LeavePageDialog } from './LeavePageDialog';

import { productFamilies } from '@/constants';
import { downloadBlob } from '@/utils/downloadBlob';
import { getFirstErrorKey } from '@/utils';
import { useAppDispatch } from '@/stores';
import { showError, showMessage } from '@/stores/actions';
import { useCallbackPrompt } from '@/hooks';
import { TableBox } from '@/components/TableBox';

function getAccordionDisabledStatus(id: SectionId, groupId?: number, groupName?: string) {
  switch (id) {
    case 'asset':
    case 'sensors':
      return !groupId;
    case 'datacold':
      return groupId ? !groupName?.includes('DC600') : true;
    default:
      return false;
  }
}

const getExpandedSections = (sectionsItems: Section[], groupId?: number, groupName?: string) =>
  sectionsItems
    .filter((item) => !getAccordionDisabledStatus(item.id, groupId, groupName))
    .map((item) => item.id);

export const DeviceCommissioning = () => {
  const context = useContext(DeviceCommissioningContext);
  const {
    permissions,
    isLoading,
    error,
    snapshot,
    fotawebDevice,
    fotawebGroups,
    updateSnapshotFlespiData,
    refreshingSnapshot,
  } = context;
  const { deviceEditAllowed } = permissions;
  const { device, asset, flespiData } = snapshot;

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [expandedSectionIds, setExpandedSectionIds] = useState<SectionId[]>(['device']);
  const [commissioning, setCommissioning] = useState(false);
  const [assetName, setAssetName] = useState('');

  const handleValidate = async (values: DeviceCommissioningFormValues) => {
    const errors: FormikErrors<DeviceCommissioningFormValues> = {};

    if (!values.fotaweb.groupId) {
      if (!errors.fotaweb) {
        errors.fotaweb = {};
      }

      if (!values.fotaweb.groupId) {
        errors.fotaweb.groupId = t('device.management.drawer.entry-required');
      }
    }

    if (!values.device.productFamily) {
      if (!errors.device) {
        errors.device = {};
      }

      if (!values.device.productFamily) {
        errors.device.productFamily = t('device.management.drawer.entry-required');
      }
    } else if (!productFamilies.map(({ family }) => family).includes(values.device.productFamily)) {
      errors.device = {};
      errors.device.productFamily = t('device.management.drawer.entry-required');
    }

    let assetNameError = values.asset.name ? '' : t('device.management.drawer.entry-required');

    if (!assetNameError && snapshot.asset?.name !== values.asset.name) {
      const validateMessage = await validateAssetName(values.asset.name);
      if (validateMessage) {
        assetNameError = t(validateMessage);
      }
    }

    if (assetNameError) {
      errors.asset = {
        name: assetNameError,
      };
    }

    return errors;
  };

  const handleFormSubmit = (values: DeviceCommissioningFormValues, helpers) => {
    setCommissioning(true);

    const includeDatacoldSensors = isIncludeDatacoldSensors(values.sensorConfiguration);

    const isTRSConfig = values?.fotaweb.groupName?.includes('TRS');
    const isDin4Config = values?.fotaweb.groupName?.includes('DIN4') && !isTRSConfig;

    const updatedConfig = prepareDin4TypeSensors(
      values.sensorConfiguration,
      isDin4Config && !isTRSConfig,
      isTRSConfig
    );

    const updatedValues = { ...values, sensorConfiguration: updatedConfig };

    if (!asset?.id) {
      // create new asset
      dispatch(commissionDeviceAction(updatedValues, includeDatacoldSensors));
    } else {
      // update existing asset
      dispatch(updateCommissionedDevice(updatedValues, context, includeDatacoldSensors));
    }

    helpers.resetForm({ values });
  };

  const formik = useFormik({
    initialValues: getInitialValues({ flespiData, asset, device, fotawebDevice, fotawebGroups }, t),
    onSubmit: handleFormSubmit,
    validate: handleValidate,
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
  });

  const {
    handleSubmit,
    values: { fotaweb, asset: formikAsset },
  } = formik;

  useEffect(() => {
    if (formik.values.asset.name) {
      setAssetName(formik.values.asset.name);
    }
  }, [formik.values.asset.name]);

  const showDialog = useMemo(() => formik.dirty, [formik.dirty]);

  const { showPrompt, confirmNavigation, cancelNavigation } = useCallbackPrompt(showDialog);

  const saveAndGo = useCallback(() => {
    handleSubmit();
    cancelNavigation();
  }, [cancelNavigation, handleSubmit]);

  useEffect(() => {
    if (commissioning && !isLoading) {
      if (error) {
        showError(dispatch, `${t('common.error')}: ${error}`);
      } else {
        showMessage(
          dispatch,
          `${t('device.management.device.commissioning.commissioning-saved-for', {
            assetId: assetName,
          })}`
        );
      }

      setCommissioning(false);
      formik.setSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, assetName]);

  const handleGenerateInstallCertificate = useCallback(() => {
    const fileName =
      formikAsset?.name && device?.imei
        ? `${formikAsset.name}_${device.imei}.png`
        : 'uncommissioned_device_certificate.png';

    const form = document.getElementById('device-commissioning-data');

    if (form) {
      const priorExpandedSectionIds = [...expandedSectionIds];

      setExpandedSectionIds(getExpandedSections(sections, fotaweb?.groupId, fotaweb?.groupName));

      setTimeout(() => {
        domtoimage.toBlob(form).then((blob) => {
          downloadBlob(blob, fileName);
          setExpandedSectionIds(priorExpandedSectionIds);
        });
      }, 500);
    }
  }, [formikAsset?.name, device?.imei, expandedSectionIds, fotaweb?.groupId, fotaweb?.groupName]);

  const handleAccordionChange = (id: SectionId) => (_event: SyntheticEvent, isExpanded: boolean) => {
    const items = expandedSectionIds.filter((item) => item !== id);

    if (isExpanded) {
      items.push(id);
    }

    setExpandedSectionIds(items);
  };

  const handleResetSensors = useCallback((event) => {
    event.stopPropagation();
    updateSnapshotFlespiData();
  }, []);

  useEffect(() => {
    if (!formik.isValid && formik.submitCount !== 0 && formik.isSubmitting) {
      const controlId = getFirstErrorKey(formik.errors);
      const control = document.getElementById(controlId);
      const sectionId = getControlSectionId(controlId);

      if (control && sectionId) {
        let timeout = 10;

        if (!expandedSectionIds.includes(sectionId)) {
          timeout = 500;
          setExpandedSectionIds(expandedSectionIds.concat(sectionId));
        }

        setTimeout(() => {
          control.focus();
        }, timeout);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.submitCount, formik.isValid, formik.errors, formik.isSubmitting]);

  useEffect(() => {
    if (fotaweb?.groupId) {
      setExpandedSectionIds(getExpandedSections(sections, fotaweb?.groupId, fotaweb?.groupName));
    }
  }, [fotaweb?.groupId, fotaweb?.groupName]);

  const savingCommissioningDisabled = useMemo(
    () =>
      isLoading ||
      !deviceEditAllowed ||
      formik.isSubmitting ||
      !formik.dirty ||
      !formik.isValid ||
      !isEmpty(formik.errors),
    [deviceEditAllowed, formik.dirty, formik.isSubmitting, formik.isValid, isLoading, formik.errors]
  );

  const generateInstallCertificateDisabled = useMemo(
    () => isLoading || formik.isSubmitting || !formik.isValid,
    [formik.isSubmitting, formik.isValid, isLoading]
  );

  const getAccordionDetailsSx = (sectionId: SectionId) => (sectionId === 'datacold' ? { px: 0 } : {});

  return (
    <>
      <LeavePageDialog
        open={showPrompt}
        onClose={cancelNavigation}
        onLeave={confirmNavigation}
        onSave={saveAndGo}
        disableSaving={savingCommissioningDisabled}
      />
      <FormikProvider value={formik}>
        <TableBox>
          <Box display="flex" justifyContent="flex-end" width="100%" minHeight={32} mb={2}>
            <Button
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
              onClick={() => handleGenerateInstallCertificate()}
              disabled={generateInstallCertificateDisabled}
            >
              <Typography variant="buttonMedium">
                {t('device.management.device.commissioning.install-certificate')}
              </Typography>
            </Button>

            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() => handleSubmit()}
              disabled={savingCommissioningDisabled}
            >
              {t('device.management.drawer.save-commissioning')}
            </Button>
          </Box>
          <Box display="flex" flexDirection="column" overflow="auto">
            <div id="device-commissioning-data">
              {sections.map((section) => (
                <Accordion
                  key={`DeviceSection_${section.id}`}
                  expanded={expandedSectionIds.includes(section.id)}
                  onChange={handleAccordionChange(section.id)}
                  disabled={getAccordionDisabledStatus(
                    section.id,
                    formik.values.fotaweb?.groupId,
                    formik.values.fotaweb?.groupName
                  )}
                  sx={{
                    '&.MuiAccordion-root:hover': {
                      backgroundColor: '#ffffff!important',
                    },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant="subtitle2">{t(section.title)}</Typography>
                      {expandedSectionIds.includes(section.id) && section.id === 'sensors' && (
                        <Button
                          sx={{ ml: 3 }}
                          startIcon={
                            refreshingSnapshot ? <CircularProgress size={20} /> : <RefreshOutlined />
                          }
                          variant="outlined"
                          onClick={(e) => handleResetSensors(e)}
                          disabled={refreshingSnapshot}
                        >
                          {t('device.management.device.commissioning.refresh')}
                        </Button>
                      )}
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={getAccordionDetailsSx(section.id)}>
                    {getSectionContent(section)}
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </Box>
        </TableBox>
      </FormikProvider>
    </>
  );
};
